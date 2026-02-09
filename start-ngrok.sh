#!/bin/bash

# Start ngrok and expose mock API to public internet
echo "Starting ngrok..."
echo ""
echo "Keep this terminal open while testing with GitHub Pages"
echo "Copy the 'Forwarding' URL and update .env.production"
echo ""

ngrok http 3000
