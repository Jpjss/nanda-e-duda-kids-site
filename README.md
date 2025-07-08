# Nanda e Duda Kids site

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/jpjss-projects/v0-nanda-e-duda-kids-site)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/nunYR2y2aZb)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/jpjss-projects/v0-nanda-e-duda-kids-site](https://vercel.com/jpjss-projects/v0-nanda-e-duda-kids-site)**

## Build your app

Continue building your app on:

## Setup and Configuration

### Environment Variables

This project requires certain environment variables to be configured for full functionality:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Configure the required variables in `.env.local`:
   - `MELHOR_ENVIO_TOKEN`: Your Melhor Envio API token for shipping calculations
     - Get your token from [Melhor Envio API documentation](https://melhorenvio.com.br/docs/authentication)

### Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```



## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
