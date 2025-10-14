import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Database } from './database.types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

type MoodCheck = Database['public']['Tables']['mood_checks']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export async function generateInitialMessage(user: User & { initial_assessment?: any }): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const assessment = user.initial_assessment;
    
    const prompt = `You are an empathetic AI mental health assistant initiating a conversation with a user based on their assessment data.

Assessment data: ${JSON.stringify(assessment)}

Guidelines:
1. Start with a warm, personalized welcome
2. Acknowledge specific aspects from their assessment (mood, challenges, goals)
3. Show understanding of their current state
4. Ask one open-ended question about their most pressing concern
5. Keep response concise (3-4 sentences maximum)

Tone: Warm, supportive, and understanding

Focus areas:
- Current emotional state
- Main challenges they identified
- Their goals and coping strategies
- Support system availability

Remember: Be gentle and encouraging, especially if they indicated low mood or high stress.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'How are you feeling right now?';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Thank you for sharing your thoughts with me. How are you feeling right now?';
  }
}

export async function generateChatResponse(
  message: string,
  sessionHistory: Message[],
  recentMoodChecks: MoodCheck[],
  initialAssessment: any
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format mood data for context
    const moodContext = recentMoodChecks.map(check => ({
      date: new Date(check.created_at).toISOString(),
      score: check.score,
      assessment: check.assessment_data
    }));

    // Format chat history
    const chatHistory = sessionHistory.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const prompt = `You are an empathetic AI mental health assistant using Socratic dialogue to help users explore their thoughts and feelings.

Initial Assessment: ${JSON.stringify(initialAssessment)}
Recent mood data: ${JSON.stringify(moodContext)}
Chat History: ${JSON.stringify(chatHistory)}

Socratic Dialogue Guidelines:
1. Ask one question at a time
2. Use these types of questions:
   - Clarifying: "Can you tell me more about...?"
   - Probing assumptions: "What makes you think...?"
   - Probing reasons: "Why do you feel...?"
   - Exploring perspectives: "How else might you look at...?"
   - Exploring implications: "What might happen if...?"

Response Structure:
1. Brief acknowledgment/reflection (1 sentence)
2. One clear, focused question
3. Optional gentle suggestion or observation

Key Principles:
- Keep responses concise (2-3 sentences maximum)
- Focus on the user's immediate concerns
- Use simple, clear language
- Avoid multiple questions in one response
- Guide rather than direct

Crisis Keywords: suicide, self-harm, kill, die, end it all
If these appear, immediately provide crisis resources and encourage professional help.

Current user message: ${message}

Remember: Your role is to help users explore their own thoughts and feelings, not to provide solutions or advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'I apologize, but I am unable to provide a response at the moment.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'I apologize, but I am unable to provide a response at the moment. Please try again later.';
  }
}

export async function generateMoodInsights(moodChecks: MoodCheck[]): Promise<string> {
  if (moodChecks.length === 0) return '';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const moodData = moodChecks.map(check => ({
      date: new Date(check.created_at).toISOString(),
      score: check.score,
      assessment: check.assessment_data
    }));

    const prompt = `Analyze the mood and assessment data and provide insights in plain text format.

Guidelines:
- Use simple headings without any special characters
- Use plain bullet points with a dash (-)
- Use regular numbers for numbered lists (1., 2., etc.)
- No markdown symbols, asterisks, or other formatting
- No hashtags or special characters

Required sections:

Mood Patterns
- List key patterns in mood fluctuations
- Note significant trends

Progress Areas
1. First area of progress
2. Second area of progress
3. Additional areas as needed

Focus Points
- Key area to focus on
- Supporting points
- Practical suggestions

Recommendations
1. First actionable step
2. Second actionable step
3. Additional steps as needed

Keep the response concise and actionable, using only plain text.

Mood data: ${JSON.stringify(moodData)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Unable to generate insights at this time. Please try again later.';
  }
}

export async function generateDailyInspiration(): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate a short, inspiring message for someone starting their day. Include:
- A brief, relatable metaphor about personal growth
- A gentle question for self-reflection
- A simple encouragement

Keep it concise (2-3 sentences) and uplifting.
Focus on mindfulness and present-moment awareness.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Start your day with intention and purpose.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Every new day brings fresh opportunities for growth and positive change.';
  }
}
