# Discord API Setup Guide

This guide will help you set up Discord API integration for the workflow automation tool.

## Prerequisites

1. A Discord account
2. Access to Discord Developer Portal

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" in the top right
3. Give your application a name (e.g., "Workflow Automation Bot")
4. Click "Create"

## Step 2: Create a Bot

1. In your application, go to the "Bot" section in the left sidebar
2. Click "Add Bot"
3. Click "Yes, do it!" to confirm
4. **Important**: Copy the bot token - you'll need this for the workflow tool
5. Under "Privileged Gateway Intents", enable:
   - MESSAGE CONTENT INTENT (required for reading messages)
   - SERVER MEMBERS INTENT (if you need member information)

## Step 3: Configure Bot Permissions

1. In the "Bot" section, scroll down to "Bot Permissions"
2. Select the following permissions:
   - **Send Messages** - Required for sending messages
   - **Send Messages in Threads** - For thread support
   - **Embed Links** - For sending embeds
   - **Read Message History** - For reading channel messages
   - **Use Slash Commands** - For advanced bot features

## Step 4: Invite Bot to Your Server

1. Go to the "OAuth2" > "URL Generator" section
2. In "Scopes", select "bot"
3. In "Bot Permissions", select the permissions from Step 3
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot
6. The bot will now appear in your server's member list

## Step 5: Get Channel ID

1. In Discord, enable Developer Mode:
   - Go to User Settings > Advanced
   - Toggle "Developer Mode" on
2. Right-click on the channel where you want the bot to send messages
3. Click "Copy ID" - this is your channel ID

## Step 6: Configure the Workflow Tool

1. Add a Discord node to your workflow
2. Click the settings icon (⚙️) to configure
3. Enter your bot token in the "Bot Token" field
4. Enter the channel ID in the "Channel ID" field
5. Choose your action:
   - **Send Message**: Simple text message
   - **Send Embed**: Rich embed with title, description, and color
   - **Get Channel Messages**: Retrieve recent messages from the channel

## Available Actions

### Send Message
- **Bot Token**: Your bot's token from Step 2
- **Channel ID**: The channel where messages will be sent
- **Message Content**: The text message to send

### Send Embed
- **Bot Token**: Your bot's token from Step 2
- **Channel ID**: The channel where embeds will be sent
- **Message Content**: Optional text message above the embed
- **Embed Title**: The title of the embed
- **Embed Description**: The description text
- **Embed Color**: Hex color code (e.g., #5865F2 for Discord blue)

### Get Channel Messages
- **Bot Token**: Your bot's token from Step 2
- **Channel ID**: The channel to read messages from
- Returns the 10 most recent messages

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never share your bot token** - it gives full access to your bot
2. **Keep the token secure** - don't commit it to version control
3. **Use environment variables** for production deployments
4. **Regularly rotate tokens** if compromised
5. **Limit bot permissions** to only what's necessary

## Troubleshooting

### Common Issues

1. **"Missing Permissions" error**
   - Check that the bot has the required permissions in the channel
   - Ensure the bot role is above the channel's permission settings

2. **"Invalid token" error**
   - Verify the bot token is correct
   - Check that the token hasn't been regenerated

3. **"Cannot send messages to this user" error**
   - Ensure the bot has permission to send messages in the channel
   - Check channel permission settings

4. **"Missing Access" error**
   - Verify the bot has been invited to the server
   - Check that the bot has the required scopes

### Getting Help

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord API Documentation](https://discord.com/developers/docs)
- [Discord Developer Support](https://discord.gg/discord-developers)

## Example Workflow

1. **Gmail Node** → **Discord Node**: Send email notifications to Discord
2. **Google Drive Node** → **Discord Node**: Notify when files are uploaded
3. **Discord Node** → **Gmail Node**: Send Discord messages via email

## Rate Limits

Discord has rate limits to prevent spam:
- **Message Creation**: 5 messages per 2 seconds per channel
- **API Requests**: 50 requests per second per bot
- **Embed Limits**: 10 embeds per message maximum

## Production Deployment

For production use:
1. Use environment variables for all sensitive data
2. Implement proper error handling and logging
3. Set up monitoring for rate limit violations
4. Use webhooks for high-volume scenarios
5. Implement retry logic for failed requests
