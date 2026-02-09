# ngrok Setup Guide

## Quick Start

### Step 1: Download ngrok

Download from: https://ngrok.com/download

### Step 2: Install ngrok

**macOS (Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**Or download directly:**
1. Extract the downloaded file
2. Move it to your PATH (or just use the full path to run it)

### Step 3: Start Your Mock API

In a terminal window:
```bash
npm run mock-api
# or
node server.js
```

You should see:
```
╔════════════════════════════════════════╗
║   Mock API Server Running              ║
║   URL: http://localhost:3000         ║
║   Endpoint: GET /api/profiles          ║
╚════════════════════════════════════════╝
```

### Step 4: Expose with ngrok

In another terminal window:
```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       [your-account]
Version                       X.X.X
Region                        us (United States)
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000
```

**Copy the forwarding URL** (e.g., `https://abc123def456.ngrok.io`)

### Step 5: Configure Your App

Edit `.env.local` or `.env` and update:
```
VITE_API_BASE_URL=https://abc123def456.ngrok.io/api
```

Replace `abc123def456` with your actual ngrok URL.

### Step 6: Restart Dev Server

```bash
npm run dev
```

Your app at `http://localhost:5173/` will now use the ngrok API.

### Step 7: Test GitHub Pages

1. Build your app: `npm run build`
2. Push to GitHub: `git push origin master`
3. Your GitHub Pages app will use the ngrok URL to connect to your local mock API!

## Important Notes

- **ngrok URL changes on restart**: Each time you run `ngrok http 3000`, you get a new URL
- **URL is public**: Anyone with the URL can access your local API
- **Keep ngrok running**: As long as ngrok is running, the URL works
- **Rate limits**: Free tier has limits, but fine for testing
- **Disconnect**: Press `Ctrl+C` in the ngrok terminal to stop

## Troubleshooting

### "Connection refused"
- Make sure mock API is running on localhost:3000
- Check that ngrok is configured for port 3000

### "ngrok: command not found"
- Make sure ngrok is installed and in your PATH
- Try using the full path to ngrok binary

### GitHub Pages still shows 404
- Verify the ngrok URL is correct in `.env`
- Rebuild: `npm run build`
- Clear browser cache
- Check browser console for the actual API URL being called

## Stopping ngrok

When you're done:
1. Press `Ctrl+C` in the ngrok terminal
2. The public URL will no longer work
3. Keep using localhost:3000 locally

## Next Steps

For permanent deployment, see `MOCK_API_DEPLOYMENT.md` for cloud hosting options.
