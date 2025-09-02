# Google API Setup Guide

This guide will help you set up Google Gmail and Drive APIs for the workflow automation tool.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Gmail API**
   - **Google Drive API**

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add your email to test users
4. Create the OAuth 2.0 client ID:
   - Application type: "Web application"
   - Name: "Workflow Automation Tool"
   - Authorized redirect URIs: `http://localhost:3000/auth/callback` (for development)
5. Download the credentials JSON file

## Step 4: Get Access Tokens

### Option A: Using OAuth 2.0 Playground (Recommended for testing)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret from step 3
5. In the left panel, find and select:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/drive.file`
6. Click "Authorize APIs"
7. Sign in with your Google account and grant permissions
8. Click "Exchange authorization code for tokens"
9. Copy the "Access token" (starts with `ya29.`)

### Option B: Using Google's OAuth 2.0 Libraries

For production use, implement proper OAuth 2.0 flow using Google's official libraries.

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Add a Gmail or Google Drive node
4. Click the settings icon to configure the node
5. Paste your access token in the "Access Token" field
6. Fill in the required fields for your chosen action
7. Click "Save Configuration"
8. Click the play button to execute the node

## API Scopes Required

The following scopes are needed for full functionality:

### Gmail API
- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/gmail.modify` - Modify emails

### Google Drive API
- `https://www.googleapis.com/auth/drive.file` - Access files created by the app
- `https://www.googleapis.com/auth/drive` - Full access to Google Drive

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit access tokens to version control**
2. **Access tokens expire** - implement refresh token logic for production
3. **Use server-side API calls** - don't make direct API calls from the frontend in production
4. **Implement proper error handling** for expired tokens
5. **Use environment variables** for sensitive configuration

## Troubleshooting

### Common Issues

1. **"Invalid access token" error**
   - Check if the token has expired
   - Ensure the token has the correct scopes
   - Verify the token format (should start with `ya29.`)

2. **"Insufficient permissions" error**
   - Make sure you've granted all required scopes
   - Check if the APIs are enabled in your Google Cloud project

3. **"Quota exceeded" error**
   - Google APIs have usage quotas
   - Check your quota usage in the Google Cloud Console

### Getting Help

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google Cloud Console](https://console.cloud.google.com/)

## Production Deployment

For production deployment:

1. Set up proper OAuth 2.0 flow with refresh tokens
2. Implement server-side API calls
3. Use environment variables for all sensitive data
4. Set up proper error handling and logging
5. Consider implementing rate limiting
6. Use HTTPS for all communications
