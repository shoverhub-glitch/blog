# Analytics Setup Guide

This project supports Google Analytics 4 (GA4) for tracking visitor behavior.

## What's Tracked

- Page views (automatic on route changes)
- Top content performance
- Traffic sources
- User behavior flow

## Setup

### 1. Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in → Click "Start measuring"
3. Create account (name it "ShoverHub Blog")
4. Property name: `ShoverHub Blog`
5. Time zone: Your timezone
6. Currency: USD
7. Click "Create" → Accept terms

### 2. Get Measurement ID

1. After creation, you'll see "Data Stream" screen
2. Click "Web" → Enter your site URL: `https://blog.shoverhub.com`
3. Give it a name: "ShoverHub Blog"
4. Click "Create stream"
5. Copy the **Measurement ID** (starts with `G-XXXXXXXXXX`)

### 3. Configure Environment

Add to your `.env` file:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Rebuild & Deploy

```bash
npm run build
```

Analytics will now track all visitors automatically.

## Google Search Console vs Analytics

| Feature | Search Console | Analytics |
|---------|---------------|-----------|
| Search rankings | ✅ | ❌ |
| Index status | ✅ | ❌ |
| Page views | ❌ | ✅ |
| Time on site | ❌ | ✅ |
| Traffic sources | ❌ | ✅ |
| Top content | ❌ | ✅ |

Both can be connected in GA4 under **Admin → Property Settings → Search Console**.

## Notes

- Analytics only loads when `VITE_GA_MEASUREMENT_ID` is set
- No errors in development without the ID
- Free tier: unlimited hits, 14-month data retention
- No Supabase storage impact (external service)