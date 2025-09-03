# Twitter API v2 Setup Guide

This guide will help you set up Twitter API v2 integration for the workflow automation tool.

## Prerequisites

1. A Twitter account
2. Access to Twitter Developer Portal
3. **Important**: Twitter now requires a paid Basic plan ($100/month) for API access

## Step 1: Apply for Twitter Developer Access

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Click "Apply for a Developer Account"
4. Fill out the application form:
   - Explain how you'll use the API
   - Describe your project
   - Confirm you won't violate Twitter's terms
5. Wait for approval (can take several days to weeks)

## Step 2: Create a Project and App


1. Once approved, go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create Project"
3. Give your project a name (e.g., "Workflow Automation")
4. Select your use case (choose the most appropriate)
5. Click "Create App" within your project
6. Give your app a name and description

## Step 3: Configure App Settings

1. In your app settings, go to "Keys and Tokens"
2. **Important**: You'll need the "Bearer Token" (starts with AAAA...)
3. Copy this token - you'll need it for the workflow tool
4. Under "App permissions", ensure you have:
   - **Read** - Required for getting tweets and timeline
   - **Write** - If you plan to post tweets (not implemented in this tool)

## Step 4: Set Up App Authentication

1. In "App settings" > "User authentication settings"
2. Enable "OAuth 2.0"
3. Set App type to "Web App"
4. Add callback URLs if needed
5. Set required scopes:
   - `tweet.read` - For reading tweets
   - `users.read` - For user information
   - `offline.access` - For long-term access

## Step 5: Configure the Workflow Tool

1. Add a Twitter node to your workflow
2. Click the settings icon (⚙️) to configure
3. Enter your Bearer Token in the "Bearer Token" field
4. Choose your action:
   - **Get Home Timeline**: Recent tweets from followed accounts
   - **Get Trending Topics**: Popular topics and hashtags
   - **Get User Tweets**: Tweets from a specific user

## Available Actions

### Get Home Timeline
- **Bearer Token**: Your app's bearer token from Step 3
- **Count**: Number of tweets to retrieve (1-100)
- Returns recent tweets from accounts you follow

### Get Trending Topics
- **Bearer Token**: Your app's bearer token from Step 3
- **Count**: Number of trending topics to retrieve (1-100)
- Returns popular topics and hashtags

### Get User Tweets
- **Bearer Token**: Your app's bearer token from Step 3
- **Username**: Twitter username without @ (e.g., "elonmusk")
- **Count**: Number of tweets to retrieve (1-100)
- Returns recent tweets from the specified user

## API Endpoints Used

The tool uses these Twitter API v2 endpoints:
- `GET /2/tweets/search/recent` - For timeline and trending
- `GET /2/users/by/username/{username}` - To get user ID from username
- `GET /2/users/{id}/tweets` - To get user's tweets

## Rate Limits

Twitter API v2 has strict rate limits:
- **Basic Plan ($100/month)**:
  - 300 requests per 15-minute window
  - 500,000 tweets per month
- **Pro Plan ($5000/month)**:
  - Higher limits and more features

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never share your Bearer Token** - it gives access to your app
2. **Keep tokens secure** - don't commit them to version control
3. **Use environment variables** for production deployments
4. **Monitor API usage** to avoid exceeding rate limits
5. **Follow Twitter's Developer Agreement** and terms of service

## Troubleshooting

### Common Issues

1. **"Unauthorized" error (401)**
   - Check that your Bearer Token is correct
   - Verify your app has the required permissions
   - Ensure your developer account is approved

2. **"Rate limit exceeded" error (429)**
   - Wait for the rate limit window to reset
   - Reduce the frequency of API calls
   - Consider upgrading to a higher plan

3. **"Forbidden" error (403)**
   - Check that your app has the required scopes
   - Verify your app permissions are set correctly
   - Ensure you're not violating Twitter's terms

4. **"Not Found" error (404)**
   - Verify the username exists and is public
   - Check that the user has tweets available

### Getting Help

- [Twitter Developer Portal](https://developer.twitter.com/)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Twitter Developer Support](https://developer.twitter.com/en/support)

## Example Workflows

1. **Twitter Node** → **Discord Node**: Send trending topics to Discord
2. **Twitter Node** → **Gmail Node**: Email digest of user tweets
3. **Gmail Node** → **Twitter Node**: Post email content to Twitter (if write access)

## Data Returned

### Timeline Data
```json
{
  "action": "timeline",
  "tweets": [
    {
      "id": "1234567890",
      "text": "Tweet content here..."
    }
  ],
  "count": 10,
  "retrievedAt": "2024-01-01T12:00:00.000Z"
}
```

### User Tweets Data
```json
{
  "action": "user_tweets",
  "username": "elonmusk",
  "userId": "44196397",
  "tweets": [...],
  "count": 10,
  "retrievedAt": "2024-01-01T12:00:00.000Z"
}
```

## Production Deployment

For production use:
1. Use environment variables for all sensitive data
2. Implement proper error handling and logging
3. Set up monitoring for rate limit violations
4. Implement retry logic with exponential backoff
5. Cache responses to minimize API calls
6. Monitor API usage and costs

## Cost Considerations

- **Basic Plan**: $100/month (required for API access)
- **Pro Plan**: $5000/month (higher limits)
- **Enterprise**: Custom pricing
- **Additional costs**: Per-tweet charges for high volume

## Alternative Solutions

If Twitter API costs are prohibitive:
1. **Web scraping** (not recommended, violates terms)
2. **RSS feeds** (limited functionality)
3. **Third-party services** (may have their own costs)
4. **Manual monitoring** (low-tech alternative)
