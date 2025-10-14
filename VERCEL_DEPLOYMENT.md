# Vercel Deployment Guide for MindLense

## Quick Fix for White Screen Issue

The white screen on Vercel is typically caused by missing environment variables. Follow these steps:

## 1. Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your MindLense project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 2. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a new deployment

## 3. Check Build Logs

If still having issues:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check the **Build Logs** for any errors
4. Look for TypeScript errors or missing dependencies

## Common Issues & Solutions

### Issue 1: White Screen
**Cause**: Missing environment variables
**Solution**: Add all required environment variables in Vercel settings

### Issue 2: Build Errors
**Cause**: TypeScript errors or missing dependencies
**Solution**: 
```bash
npm run build
```
Check for errors locally before deploying

### Issue 3: Runtime Errors
**Cause**: Environment variables not accessible at runtime
**Solution**: Ensure variables start with `VITE_` prefix

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | `AIza...` |

## Testing Locally

Before deploying, test locally:

1. Create a `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

2. Run the development server:
```bash
npm run dev
```

3. Test the build:
```bash
npm run build
npm run preview
```

## Vercel Configuration

The project includes a `vercel.json` file with proper SPA routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Debugging Steps

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Check Vercel Function Logs**:
   - Go to Vercel dashboard
   - Check Function logs for server-side errors

3. **Verify Environment Variables**:
   - Ensure all variables are set correctly
   - Check for typos in variable names
   - Verify values are correct

## Build Configuration

The project uses Vite with the following configuration:
- React 18
- TypeScript
- Tailwind CSS
- Automatic code splitting

## Support

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your Supabase project is properly configured
4. Check that your OpenAI API key is valid

## Quick Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase project configured
- [ ] OpenAI API key valid
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Database schema deployed
