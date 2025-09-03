# Discord Permission Troubleshooting Guide

If you're getting "Forbidden" errors with your Discord bot, follow this step-by-step guide to fix the issue.

## 🔍 **Quick Diagnosis**

**Error 403 (Forbidden)** usually means one of these issues:
1. Bot lacks required permissions
2. Bot role hierarchy is too low
3. Channel permissions are blocking the bot
4. Bot hasn't been properly invited to the server

## 🛠️ **Step-by-Step Fix**

### **Step 1: Check Bot Permissions**

1. **Go to Discord Developer Portal**
   - Visit [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Select your application
   - Go to "Bot" section

2. **Verify Required Permissions**
   - **Send Messages** ✅
   - **Send Messages in Threads** ✅
   - **Embed Links** ✅ (for embeds)
   - **Read Message History** ✅ (for reading messages)
   - **Use Slash Commands** ✅

3. **Check Privileged Gateway Intents**
   - **MESSAGE CONTENT INTENT** ✅ (required for reading messages)
   - **SERVER MEMBERS INTENT** ✅ (if needed)

### **Step 2: Fix Bot Role Hierarchy**

**This is the most common cause of 403 errors!**

1. **Go to your Discord server**
2. **Go to Server Settings > Roles**
3. **Find your bot's role** (usually named after your bot)
4. **Drag the bot role ABOVE the channel's permission role**
5. **Ensure the bot role is below your own role** (you can't manage roles above yours)

**Example Role Order (top to bottom):**
```
👑 Server Owner
🔧 Admin
🤖 Your Bot Role  ← Should be here
📝 Moderator
👤 Member
```

### **Step 3: Check Channel Permissions**

1. **Right-click on the channel** where you want the bot to send messages
2. **Select "Edit Channel"**
3. **Go to "Permissions" tab**
4. **Check these settings:**

   **For the bot role:**
   - ✅ **Send Messages** - Allow
   - ✅ **Embed Links** - Allow (for embeds)
   - ✅ **Read Message History** - Allow (for reading)
   - ❌ **Send Messages** - Deny (should NOT be denied)

   **For @everyone role:**
   - ❌ **Send Messages** - Deny (if you want only bots to send)

### **Step 4: Re-invite the Bot**

If permissions still don't work, re-invite the bot:

1. **Go to OAuth2 > URL Generator**
2. **Select scopes:**
   - ✅ `bot`
   - ✅ `applications.commands` (if using slash commands)

3. **Select bot permissions:**
   - ✅ **Send Messages**
   - ✅ **Send Messages in Threads**
   - ✅ **Embed Links**
   - ✅ **Read Message History**
   - ✅ **Use Slash Commands**

4. **Copy the generated URL**
5. **Open in browser and re-authorize**

### **Step 5: Test Bot Permissions**

Use this simple test to verify bot permissions:

1. **Add a Discord node** to your workflow
2. **Configure with your bot token and channel ID**
3. **Set action to "Send Message"**
4. **Enter a simple test message**
5. **Click Execute**

**Expected Result:** Message appears in Discord channel
**If Still Failing:** Check the error message for specific details

## 🚨 **Common Error Messages & Solutions**

### **"Missing Permissions"**
- **Solution:** Check bot role hierarchy (Step 2)
- **Solution:** Verify bot has required permissions (Step 1)

### **"Cannot send messages to this user"**
- **Solution:** Bot needs "Send Messages" permission
- **Solution:** Check channel permissions (Step 3)

### **"Missing Access"**
- **Solution:** Bot hasn't been invited to server
- **Solution:** Re-invite bot (Step 4)

### **"Forbidden"**
- **Solution:** Usually role hierarchy issue (Step 2)
- **Solution:** Check all permissions (Steps 1-3)

## 🔧 **Advanced Troubleshooting**

### **Check Bot Status**
1. **Look at your server's member list**
2. **Bot should appear as online**
3. **If offline, check bot token and restart**

### **Verify Channel Type**
- **Text channels:** ✅ Bot can send messages
- **Voice channels:** ❌ Bot cannot send text messages
- **Announcement channels:** ✅ Bot can send messages
- **Private channels:** ❌ Bot must be explicitly added

### **Check Server Settings**
1. **Server Settings > Integrations**
2. **Find your bot**
3. **Ensure it's properly connected**

## 📋 **Permission Checklist**

Before testing, ensure:

- [ ] Bot has required permissions in Developer Portal
- [ ] Bot role is above channel permission roles
- [ ] Bot has "Send Messages" permission in channel
- [ ] Bot has "Embed Links" permission (for embeds)
- [ ] Bot has "Read Message History" permission (for reading)
- [ ] Bot is online and connected to server
- [ ] Channel allows bot access
- [ ] Bot token is correct and not expired

## 🆘 **Still Having Issues?**

If you've followed all steps and still get errors:

1. **Check the exact error message** from the workflow tool
2. **Verify your bot token** hasn't been regenerated
3. **Ensure the channel ID** is correct
4. **Try a different channel** to isolate the issue
5. **Check Discord's status** at [https://status.discord.com/](https://status.discord.com/)

## 🔗 **Useful Links**

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord Permission Calculator](https://discordapi.com/permissions.html)
- [Discord Bot Permissions Guide](https://discord.com/developers/docs/topics/permissions)
- [Discord Support](https://support.discord.com/)

---

**Remember:** 90% of Discord permission issues are solved by fixing the bot role hierarchy! 🎯
