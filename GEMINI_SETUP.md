# Google Gemini AI Setup Guide

This guide will help you set up Google's Gemini AI API for MindLense.

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key"
5. Choose "Create API key in new project" or select an existing project
6. Copy your API key (starts with `AIza...`)

## Step 2: Configure Environment Variables

### For Local Development:
Create a `.env` file in your project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### For Vercel Deployment:
1. Go to your Vercel dashboard
2. Select your MindLense project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key
   - **Environment**: Production, Preview, Development

## Step 3: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Test the chat functionality:
   - Sign up or log in
   - Go to the Chat page
   - Send a message to test Gemini integration

## Gemini Models Used

The application uses the following Gemini models:

- **gemini-1.5-flash**: Fast, efficient model for all AI interactions
  - Chat conversations
  - Mood insights generation
  - Daily inspiration messages
  - Initial assessment responses

## Features Powered by Gemini

### 1. AI Chat Conversations
- Socratic dialogue approach
- Context-aware responses
- Crisis detection and support

### 2. Mood Insights
- Pattern analysis from mood data
- Personalized recommendations
- Progress tracking insights

### 3. Daily Inspiration
- Personalized morning messages
- Mindfulness-focused content
- Motivational guidance

### 4. Initial Assessments
- Personalized welcome messages
- Goal-oriented responses
- Supportive tone

## API Usage and Limits

### Free Tier Limits:
- **Requests per minute**: 60
- **Requests per day**: 1,500
- **Tokens per minute**: 32,000
- **Tokens per day**: 1,000,000

### Paid Tier:
- Higher limits available
- Pay-per-use pricing
- No daily limits

## Troubleshooting

### Common Issues:

1. **"API key not found" error**
   - Check that `VITE_GEMINI_API_KEY` is set correctly
   - Ensure the API key starts with `AIza...`
   - Verify the key is active in Google AI Studio

2. **"Quota exceeded" error**
   - You've hit the free tier limits
   - Wait for the quota to reset (24 hours)
   - Consider upgrading to paid tier

3. **"Invalid API key" error**
   - Verify the API key is correct
   - Check that the key is enabled for the Gemini API
   - Ensure there are no extra spaces in the environment variable

4. **Slow responses**
   - Gemini 1.5 Flash is optimized for speed
   - Check your internet connection
   - Consider the complexity of your prompts

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Monitor API usage in Google AI Studio**
5. **Set up billing alerts if using paid tier**

## Cost Optimization

### Tips to reduce API usage:
1. **Cache responses** when appropriate
2. **Use shorter prompts** for simple tasks
3. **Implement rate limiting** in your app
4. **Monitor usage** in Google AI Studio dashboard

## Support

If you encounter issues:

1. Check the [Google AI Studio documentation](https://ai.google.dev/docs)
2. Verify your API key is active
3. Check the browser console for error messages
4. Ensure all environment variables are set correctly

## Migration from OpenAI

If you were previously using OpenAI:

1. **Remove OpenAI dependency**: `npm uninstall openai`
2. **Update environment variables**: Replace `VITE_OPENAI_API_KEY` with `VITE_GEMINI_API_KEY`
3. **Test all AI features**: Chat, mood insights, daily inspiration
4. **Update deployment**: Add Gemini API key to Vercel environment variables

The migration is complete and all AI features now use Google Gemini!
