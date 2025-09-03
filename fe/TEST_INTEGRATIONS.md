# Testing Your Integrations

## 🧪 **Test Discord Integration**

1. **Add a Discord node** to your workflow
2. **Configure with your bot token and channel ID**
3. **Test "Send Message" action:**
   - Set action to "Send Message"
   - Enter channel ID (right-click channel → Copy ID)
   - Enter a test message: "Hello from Workflow Automation! 🚀"
   - Click Execute

**Expected Result:** Message appears in your Discord channel
**If Failing:** Check [Discord Troubleshooting Guide](DISCORD_TROUBLESHOOTING.md)

## 🧪 **Test Twitter Integration**

1. **Add a Twitter node** to your workflow
2. **Configure with your bearer token**
3. **Test "Get User Tweets" action:**
   - Set action to "Get User Tweets"
   - Enter username: "twitter" (or any public account)
   - Set count to 5
   - Click Execute

**Expected Result:** Returns recent tweets from the user
**If Failing:** Check [Twitter Troubleshooting Guide](TWITTER_TROUBLESHOOTING.md)

## ✅ **Success Indicators**

- **Discord**: Message appears in channel, execution shows "Success"
- **Twitter**: Tweets are returned, execution shows "Success"
- **No CORS errors** in browser console
- **No "Forbidden" errors** for Discord

## 🔧 **Quick Debug**

- Check browser console for errors
- Verify tokens are correct and not expired
- Ensure Discord bot has proper permissions
- Confirm Twitter API access level
