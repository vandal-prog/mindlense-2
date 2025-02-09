import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { generateChatResponse, generateInitialMessage, generateMoodInsights } from '../lib/openai';
import type { Database } from '../lib/database.types';

type Message = Database['public']['Tables']['messages']['Row'];
type MoodCheck = Database['public']['Tables']['mood_checks']['Row'];

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  loading: boolean;
  error: string | null;
  insights: string | null;
  lastViewedMessageId: Record<string, string>;
  activeConversations: {
    id: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  }[];
  sendMessage: (content: string, userId: string) => Promise<void>;
  loadChatHistory: (sessionId: string) => Promise<void>;
  startNewSession: (userId: string) => Promise<void>;
  generateInsights: (userId: string) => Promise<void>;
  setLastViewedMessage: (sessionId: string, messageId: string) => void;
  markMessagesAsRead: (sessionId: string) => void;
  loadActiveConversations: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: null,
      loading: false,
      error: null,
      insights: null,
      lastViewedMessageId: {},
      activeConversations: [],

      sendMessage: async (content: string, userId: string) => {
        set({ loading: true, error: null });
        try {
          let sessionId = get().sessionId;
          
          if (!sessionId) {
            const { data: session } = await supabase
              .from('sessions')
              .insert({ user_id: userId })
              .select()
              .single();
            
            sessionId = session?.id;
            set({ sessionId });
          }

          const { data: message } = await supabase
            .from('messages')
            .insert({
              session_id: sessionId!,
              content,
              type: 'user'
            })
            .select()
            .single();

          if (message) {
            set(state => ({
              messages: [...state.messages, message],
              lastViewedMessageId: {
                ...state.lastViewedMessageId,
                [sessionId!]: message.id
              }
            }));
          }

          const [{ data: user }, { data: moodChecks }] = await Promise.all([
            supabase
              .from('users')
              .select('initial_assessment')
              .eq('id', userId)
              .single(),
            supabase
              .from('mood_checks')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(5)
          ]);

          const aiResponse = await generateChatResponse(
            content,
            get().messages,
            moodChecks || [],
            user?.initial_assessment
          );

          const { data: aiMessage } = await supabase
            .from('messages')
            .insert({
              session_id: sessionId!,
              content: aiResponse,
              type: 'ai'
            })
            .select()
            .single();

          if (aiMessage) {
            set(state => ({
              messages: [...state.messages, aiMessage],
              lastViewedMessageId: {
                ...state.lastViewedMessageId,
                [sessionId!]: aiMessage.id
              }
            }));
          }

          await get().loadActiveConversations(userId);
        } catch (error) {
          set({ error: 'Failed to send message' });
          console.error('Error sending message:', error);
        } finally {
          set({ loading: false });
        }
      },

      loadChatHistory: async (sessionId: string) => {
        try {
          const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

          set({ messages: data || [], sessionId });
        } catch (error) {
          console.error('Error loading chat history:', error);
          set({ error: 'Failed to load chat history' });
        }
      },

      startNewSession: async (userId: string) => {
        try {
          const { data: session } = await supabase
            .from('sessions')
            .insert({ user_id: userId })
            .select()
            .single();

          if (session) {
            set({ sessionId: session.id, messages: [] });

            const { data: user } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single();

            if (user) {
              const initialMessage = await generateInitialMessage(user);
              const { data: message } = await supabase
                .from('messages')
                .insert({
                  session_id: session.id,
                  content: initialMessage,
                  type: 'ai'
                })
                .select()
                .single();

              if (message) {
                set(state => ({
                  messages: [message],
                  lastViewedMessageId: {
                    ...state.lastViewedMessageId,
                    [session.id]: message.id
                  }
                }));
              }

              await get().loadActiveConversations(userId);
            }
          }
        } catch (error) {
          console.error('Error starting new session:', error);
          set({ error: 'Failed to start new session' });
        }
      },

      generateInsights: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const { data: moodChecks } = await supabase
            .from('mood_checks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

          if (moodChecks && moodChecks.length > 0) {
            const insights = await generateMoodInsights(moodChecks);
            set({ insights });
          }
        } catch (error) {
          console.error('Error generating insights:', error);
          set({ error: 'Failed to generate insights' });
        } finally {
          set({ loading: false });
        }
      },

      setLastViewedMessage: (sessionId: string, messageId: string) => {
        set(state => ({
          lastViewedMessageId: {
            ...state.lastViewedMessageId,
            [sessionId]: messageId
          }
        }));
      },

      markMessagesAsRead: (sessionId: string) => {
        set(state => {
          const lastMessage = state.messages[state.messages.length - 1];
          if (lastMessage) {
            return {
              lastViewedMessageId: {
                ...state.lastViewedMessageId,
                [sessionId]: lastMessage.id
              },
              activeConversations: state.activeConversations.map(conv =>
                conv.id === sessionId ? { ...conv, unreadCount: 0 } : conv
              )
            };
          }
          return state;
        });
      },

      loadActiveConversations: async (userId: string) => {
        try {
          const { data: sessions } = await supabase
            .from('sessions')
            .select(`
              id,
              created_at,
              messages (
                id,
                content,
                created_at,
                type
              )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (sessions) {
            const conversations = sessions.map(session => {
              const messages = session.messages as Message[];
              const lastMessage = messages[messages.length - 1];
              const lastViewed = get().lastViewedMessageId[session.id];
              const unreadCount = lastViewed
                ? messages.filter(m => 
                    m.created_at > messages.find(msg => msg.id === lastViewed)?.created_at!
                  ).length
                : messages.length;

              return {
                id: session.id,
                lastMessage: lastMessage?.content || 'New Conversation',
                timestamp: lastMessage?.created_at || session.created_at,
                unreadCount
              };
            });

            set({ activeConversations: conversations });
          }
        } catch (error) {
          console.error('Error loading active conversations:', error);
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        lastViewedMessageId: state.lastViewedMessageId
      })
    }
  )
);