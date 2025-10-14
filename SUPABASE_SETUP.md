# MindLense Supabase Setup Guide

This guide will help you set up MindLense with a new Supabase project.

## Prerequisites

- A Supabase account
- A new Supabase project created
- OpenAI API key
- Node.js and npm installed

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `mindlense` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
6. Click "Create new project"
7. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the script
6. Verify that all tables are created successfully

## Step 3: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**: Replace the placeholder values with your actual credentials.

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Start the Development Server

```bash
npm run dev
```

## Step 7: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Try creating a new account
3. Complete the initial assessment
4. Test the chat functionality
5. Try the mood tracking feature

## Database Schema Overview

The application uses the following tables:

### `users`
- Stores user profiles and preferences
- Includes onboarding status and assessment data
- Row Level Security ensures users only see their own data

### `sessions`
- Manages chat sessions
- Links to users and stores session metadata

### `messages`
- Stores chat messages (both user and AI)
- Links to sessions for conversation history

### `mood_checks`
- Stores daily mood assessments
- Includes detailed assessment data as JSON
- Used for generating insights and tracking progress

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic user creation on signup
- Secure API key management

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your Supabase URL and anon key are correct
   - Ensure there are no extra spaces in your `.env` file

2. **"Table doesn't exist" error**
   - Make sure you ran the complete `supabase-setup.sql` script
   - Check that all tables were created successfully

3. **Authentication issues**
   - Verify that the `handle_new_user()` function was created
   - Check that the trigger is properly set up

4. **OpenAI API errors**
   - Verify your OpenAI API key is valid
   - Check that you have sufficient credits in your OpenAI account

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure the database schema was created completely

## Next Steps

Once everything is working:

1. Customize the application for your needs
2. Set up production environment variables
3. Deploy to your preferred hosting platform
4. Configure custom domains and SSL certificates

## Production Considerations

- Use environment-specific Supabase projects
- Set up proper backup strategies
- Configure monitoring and logging
- Review and update security policies as needed
- Consider rate limiting for API calls
