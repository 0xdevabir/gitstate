# 🔑 Setting Up GitHub API Token

## Why You Need a Token

GitHub API has rate limits:
- **Without token**: 60 requests per hour
- **With token**: 5,000 requests per hour

## Quick Setup (2 minutes)

### 1. Create a GitHub Personal Access Token

1. Visit: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `GitHub Insights Generator`
4. **Expiration**: Set to "No expiration" or choose your preference
5. **Scopes**: Select `public_repo` (or leave default `read:user`)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)

### 2. Add Token to Your Project

Open `.env.local` and add:

```bash
GITHUB_TOKEN=ghp_your_actual_token_here
```

### 3. Restart the Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## ✅ Verify It's Working

Your requests should now work without 403 errors! You can verify by:

1. Checking the server logs - no more 403 errors
2. Testing with multiple usernames quickly
3. Refreshing the page multiple times

## 🔒 Security Notes

- **Never commit** your `.env.local` file to git (it's already in .gitignore)
- **Never share** your token publicly
- **Revoke tokens** you're not using from: https://github.com/settings/tokens
- For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)

## 🚀 For Production Deployment

### Vercel
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add: `GITHUB_TOKEN` = `your_token_here`
4. Redeploy

### Other Platforms
Add the `GITHUB_TOKEN` environment variable in your platform's settings.

## ❓ Troubleshooting

**Still getting 403 errors?**
- Make sure you uncommented the GITHUB_TOKEN line (remove the #)
- Verify the token is correct (no extra spaces)
- Restart your dev server
- Check token hasn't expired at: https://github.com/settings/tokens

**Token not working?**
- Ensure you selected the right scopes when creating it
- Try regenerating a new token
- Check the token in `.env.local` is complete (starts with `ghp_` or `github_pat_`)

## 📊 Rate Limit Check

You can check your current rate limit status at:
```
https://api.github.com/rate_limit
```

Or add this endpoint to your app to show remaining requests!
