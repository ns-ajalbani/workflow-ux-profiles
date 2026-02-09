# Mock API Deployment for GitHub Pages

## The Issue

When your app runs on GitHub Pages, it cannot access `http://localhost:3000` because:
- `localhost` is not accessible from the internet
- GitHub Pages runs on GitHub's servers, not your local machine
- Your mock API server is only available on your computer

## Solutions

### Option 1: Use ngrok for Local Tunneling (Easiest for Testing)

ngrok creates a public URL that tunnels to your local server.

**Steps:**

1. Install ngrok: https://ngrok.com/download
2. Start the mock API server: `npm run mock-api` (or `node server.js`)
3. In another terminal, expose it: `ngrok http 3000`
4. ngrok will show you a public URL like: `https://abc123.ngrok.io`
5. Update `.env.production` or set environment variable:
   ```
   VITE_API_BASE_URL=https://abc123.ngrok.io/api
   ```
6. Rebuild and deploy: `npm run build && git push`

**Pros:**
- Quick to test
- No code changes needed

**Cons:**
- ngrok URL changes each time
- Free tier has rate limits
- Requires ngrok to be running

### Option 2: Deploy to a Cloud Server (Recommended for Production)

Host the mock API on a cloud platform:

- **Heroku** (free tier available)
- **AWS Lambda** + API Gateway
- **Vercel** Functions
- **Railway.app**
- **Render**

**Steps:**
1. Deploy `server.js` to your chosen platform
2. Get the public URL (e.g., `https://my-api.herokuapp.com`)
3. Update CORS in `server.js` with the GitHub Pages domain
4. Set `VITE_API_BASE_URL` to the deployed API URL
5. Redeploy

**Pros:**
- Permanent, reliable URL
- Always available
- Professional setup

**Cons:**
- Requires hosting account
- May have costs
- More setup

### Option 3: Environment-Specific Configuration

Use different API endpoints for development and production:

**In `.env` (local development):**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

**In GitHub Actions** (production):
Set a secret `VITE_API_BASE_URL` pointing to your deployed API

**Current CORS Configuration:**

`server.js` now allows CORS from:
- `http://localhost:5173` (dev server)
- `http://localhost:3000` (local testing)
- `https://ns-ajalbani.github.io` (your GitHub Pages)
- Any `*.github.io` domain

## Recommended Setup

For your project:
1. Keep using `localhost:3000` for local development
2. Deploy the mock API to a free tier cloud service (Heroku or Railway)
3. Use that URL for GitHub Pages

This way:
- ✅ Local development works perfectly
- ✅ GitHub Pages can access the API
- ✅ No complex setup needed
