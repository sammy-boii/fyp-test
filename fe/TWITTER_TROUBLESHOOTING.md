# Twitter API Troubleshooting Guide

If you're getting CORS errors or other issues with your Twitter API integration, follow this comprehensive guide to fix the problem.

## 🔍 **Quick Diagnosis**

**Common Twitter API Issues:**
1. **CORS Error** - Browser blocking cross-origin requests
2. **Authentication Error** - Invalid or expired bearer token
3. **Rate Limit Exceeded** - Too many API calls
4. **API Access Level** - Insufficient permissions for requested endpoint

## 🛠️ **Step-by-Step Fix**

### **Step 1: Verify Your Twitter API Access**

1. **Check Your Twitter Developer Account**
   - Visit [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
   - Ensure your app is approved and active
   - Check your current access level (Essential, Elevated, or Enterprise)

2. **Verify App Settings**
   - Go to your app's settings
   - Ensure "OAuth 2.0" is enabled
   - Check that your app has the required permissions

### **Step 2: Get Your Bearer Token**

1. **Navigate to Keys and Tokens**
   - In your app dashboard, go to "Keys and Tokens"
   - Look for "Bearer Token" (not OAuth 1.0a tokens)

2. **Generate New Token if Needed**
   - If you don't see a Bearer Token, click "Generate"
   - Copy the token immediately (it's only shown once)

3. **Token Format**
   - Should look like: `AAAA...` (starts with AAAA)
   - Length: approximately 100+ characters
   - Never share this token publicly

### **Step 3: Test Your Bearer Token**

Use this simple test to verify your token works:

```bash
curl -X GET "https://api.twitter.com/2/users/by/username/twitter" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN_HERE"
```

**Expected Result:** JSON response with user data
**If Failing:** Check token validity and app permissions

### **Step 4: Check API Endpoint Access**

Different Twitter API endpoints require different access levels:

| Endpoint | Essential | Elevated | Enterprise |
|-----------|-----------|----------|------------|
| User lookup | ✅ | ✅ | ✅ |
| Recent search | ❌ | ✅ | ✅ |
| User tweets | ❌ | ✅ | ✅ |
| Trending topics | ❌ | ❌ | ✅ |

**If you have Essential access only:**
- You can only do basic user lookups
- Upgrade to Elevated for more features
- Contact Twitter for Enterprise access

## 🚨 **Common Error Messages & Solutions**

### **CORS Error**
```
Access to fetch at 'https://api.twitter.com/2/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:** ✅ **Already Fixed!** 
- We've implemented Next.js API routes to proxy requests
- The workflow tool now calls `/api/twitter` instead of Twitter directly
- This bypasses CORS restrictions

### **401 Unauthorized**
```
{"errors":[{"code":32,"message":"Could not authenticate you."}]}
```

**Solutions:**
1. **Check bearer token** - ensure it's correct and not expired
2. **Verify app permissions** - ensure OAuth 2.0 is enabled
3. **Check app status** - ensure it's approved and active

### **403 Forbidden**
```
{"errors":[{"code":88,"message":"Rate limit exceeded"}]}
```

**Solutions:**
1. **Wait for rate limit reset** (usually 15 minutes)
2. **Reduce API call frequency**
3. **Check your app's rate limit** in the dashboard

### **404 Not Found**
```
{"errors":[{"code":50,"message":"User not found."}]}
```

**Solutions:**
1. **Verify username** - check spelling and case
2. **Check if user exists** - some accounts may be suspended
3. **Ensure user is public** - private accounts may not be accessible

### **429 Too Many Requests**
```
{"errors":[{"code":88,"message":"Rate limit exceeded"}]}
```

**Solutions:**
1. **Check rate limit status** in your app dashboard
2. **Implement exponential backoff** in your requests
3. **Upgrade to higher access level** for higher limits

## 🔧 **Advanced Troubleshooting**

### **Check API Response Headers**

Look for these headers in API responses:

```
x-rate-limit-limit: 300
x-rate-limit-remaining: 299
x-rate-limit-reset: 1640995200
```

**Interpretation:**
- `limit`: Total requests allowed in window
- `remaining`: Requests left in current window
- `reset`: Unix timestamp when limit resets

### **Verify Endpoint URLs**

Ensure you're using the correct API version:

- **v2 API:** `https://api.twitter.com/2/...`
- **v1.1 API:** `https://api.twitter.com/1.1/...` (deprecated)

### **Check Request Headers**

Your requests should include:

```javascript
headers: {
  'Authorization': `Bearer ${bearerToken}`,
  'Content-Type': 'application/json'
}
```

## 📋 **Pre-Testing Checklist**

Before testing your Twitter integration:

- [ ] Twitter Developer account is approved
- [ ] App is active and OAuth 2.0 enabled
- [ ] Bearer token is valid and not expired
- [ ] You have appropriate access level for desired endpoints
- [ ] Rate limits haven't been exceeded
- [ ] Username/channel IDs are correct
- [ ] Network connectivity is stable

## 🧪 **Testing Your Integration**

1. **Add a Twitter node** to your workflow
2. **Configure with your bearer token**
3. **Test each action type:**

   **Get Timeline:**
   - Should return recent tweets from followed users
   - Requires Elevated access or higher

   **Get Trending:**
   - Should return trending topics
   - Requires Enterprise access

   **Get User Tweets:**
   - Should return tweets from specified user
   - Requires Elevated access or higher

## 🆘 **Still Having Issues?**

If you've followed all steps and still get errors:

1. **Check the exact error message** from the workflow tool
2. **Verify your bearer token** hasn't been regenerated
3. **Check your app's status** in the Twitter Developer Portal
4. **Review rate limit usage** in your dashboard
5. **Try a different endpoint** to isolate the issue
6. **Check Twitter API status** at [https://api.twitter.com/2/tweets/search/recent](https://api.twitter.com/2/tweets/search/recent)

## 🔗 **Useful Links**

- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Rate Limiting Guide](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [Authentication Guide](https://developer.twitter.com/en/docs/authentication/oauth2-user-access-token)
- [Twitter API Status](https://api.twitter.com/2/tweets/search/recent)

## 💡 **Pro Tips**

1. **Always use Bearer Tokens** for app-only authentication
2. **Implement proper error handling** for rate limits
3. **Cache responses** when possible to reduce API calls
4. **Monitor your usage** in the developer dashboard
5. **Use appropriate access levels** for your use case

---

**Remember:** Most Twitter API issues are solved by checking authentication and access levels! 🐦✨
