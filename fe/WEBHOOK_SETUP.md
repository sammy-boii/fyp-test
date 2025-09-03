# Webhook Setup Guide

This guide explains how to set up webhooks to trigger your workflows automatically when external events occur.

## What are Webhooks?

Webhooks are HTTP callbacks that allow external services to notify your application when specific events happen. Instead of polling for changes, services can push data to your endpoints in real-time.

## Available Webhook Triggers

### 1. Gmail Webhook
Triggers when new emails are received.

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Set up Push Notifications:
   - Go to Gmail API → Push Notifications
   - Set webhook URL: `https://yourdomain.com/api/webhooks/gmail`
   - Set verification token (store in `GMAIL_VERIFICATION_TOKEN` env var)

**Webhook URL:** `/api/webhooks/gmail`

### 2. YouTube Webhook
Triggers when new videos are uploaded to subscribed channels.

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Set up Push Notifications:
   - Go to YouTube Data API → Push Notifications
   - Set webhook URL: `https://yourdomain.com/api/webhooks/youtube`
   - Subscribe to channels you want to monitor

**Webhook URL:** `/api/webhooks/youtube`

### 3. GitHub Webhook
Triggers when new issues, pull requests, or pushes occur.

**Setup Steps:**
1. Go to your GitHub repository
2. Navigate to Settings → Webhooks
3. Click "Add webhook"
4. Set Payload URL: `https://yourdomain.com/api/webhooks/github`
5. Set Content type: `application/json`
6. Select events: Issues, Pull requests, Pushes
7. Set webhook secret (store in `GITHUB_WEBHOOK_SECRET` env var)

**Webhook URL:** `/api/webhooks/github`

### 4. Custom Webhook
For any external service that can send HTTP POST requests.

**Setup Steps:**
1. Configure your external service to send POST requests
2. Use webhook URL: `https://yourdomain.com/api/webhooks/custom`
3. Send JSON payload with your data

**Webhook URL:** `/api/webhooks/custom`

## Using Webhook Triggers in Your Workflow

1. **Add Webhook Trigger Node:**
   - Click "Webhook" button in the toolbar
   - Configure the webhook type (Gmail, YouTube, GitHub, or Custom)
   - Copy the generated webhook URL

2. **Connect to Other Nodes:**
   - Connect the webhook trigger to other nodes in your workflow
   - The webhook data will be passed to connected nodes

3. **Test Your Webhook:**
   - Use the "Test" button in the webhook node
   - Or send a POST request to your webhook URL

## Environment Variables

Add these to your `.env.local` file:

```env
# Gmail webhook verification
GMAIL_VERIFICATION_TOKEN=your_verification_token_here

# GitHub webhook secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Your app URL (for webhook URLs)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Webhook Payload Examples

### Gmail Webhook
```json
{
  "type": "new_email",
  "emailData": {
    "from": "sender@example.com",
    "subject": "Email Subject",
    "body": "Email content...",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### YouTube Webhook
```json
{
  "type": "video_uploaded",
  "videoData": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Video Title",
    "channelId": "UCxxxxxx",
    "channelTitle": "Channel Name",
    "publishedAt": "2024-01-01T12:00:00Z"
  }
}
```

### GitHub Webhook
```json
{
  "type": "issues",
  "action": "opened",
  "issue": {
    "number": 123,
    "title": "Issue Title",
    "body": "Issue description...",
    "user": {
      "login": "username"
    }
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
```

## Security Considerations

1. **Verification Tokens:** Always use verification tokens for Gmail webhooks
2. **Webhook Secrets:** Use secrets for GitHub webhooks to verify authenticity
3. **HTTPS:** Always use HTTPS for webhook URLs in production
4. **Rate Limiting:** Implement rate limiting to prevent abuse
5. **Input Validation:** Validate all incoming webhook data

## Troubleshooting

### Common Issues:

1. **Webhook not triggering:**
   - Check if the webhook URL is accessible
   - Verify the service is configured correctly
   - Check server logs for errors

2. **Verification failed:**
   - Ensure verification tokens match
   - Check environment variables are set correctly

3. **CORS errors:**
   - Webhooks should not have CORS issues (server-to-server)
   - If testing from browser, use proper testing tools

### Testing Webhooks:

Use tools like:
- [ngrok](https://ngrok.com/) for local testing
- [webhook.site](https://webhook.site/) for testing
- [Postman](https://postman.com/) for manual testing

## Next Steps

1. Set up your first webhook trigger
2. Connect it to other nodes in your workflow
3. Test the complete workflow
4. Monitor webhook activity in your application logs
