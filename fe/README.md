# 🚀 Workflow Automation Tool - "Bootleg n8n"

A powerful workflow automation platform built with Next.js, React Flow, and shadcn/ui that integrates with multiple popular services and APIs.

## ✨ Features

### 🔌 **Available Nodes**

- **📧 Gmail Node**: Send, read, and search emails
- **💾 Google Drive Node**: Upload, download, list, and search files
- **💬 Discord Node**: Send messages, embeds, and read channel messages
- **🐦 Twitter Node**: Get timeline, trending topics, and user tweets

### 🎯 **Core Capabilities**

- **Visual Workflow Builder**: Drag-and-drop interface powered by React Flow
- **Real-time Execution**: Live status updates and execution results
- **Cross-Platform Integration**: Connect different services in a single workflow
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **TypeScript**: Full type safety and IntelliSense support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Setup Guides

### 🔑 **Google APIs (Gmail + Drive)**
- **File**: `GOOGLE_API_SETUP.md`
- **Cost**: Free (with quotas)
- **Setup Time**: 15-30 minutes

### 💬 **Discord Bot**
- **File**: `DISCORD_API_SETUP.md`
- **Cost**: Free
- **Setup Time**: 10-20 minutes

### 🐦 **Twitter API v2**
- **File**: `TWITTER_API_SETUP.md`
- **Cost**: $100/month (Basic plan required)
- **Setup Time**: 1-2 weeks (approval process)

## 🚨 Troubleshooting

### **Common Issues & Solutions**

- **[Discord Permission Issues](DISCORD_TROUBLESHOOTING.md)** - Fix "Forbidden" errors and permission problems
- **[Twitter API Issues](TWITTER_TROUBLESHOOTING.md)** - Fix CORS errors and authentication issues

### **Quick Fixes**

- **Discord "Forbidden" Error**: Usually bot role hierarchy - drag bot role above channel permissions
- **Twitter CORS Error**: Already fixed with Next.js API routes - no action needed
- **API Authentication**: Verify tokens haven't expired and apps are properly configured

## 🎮 How to Use

### 1. **Add Nodes**
   - Click the "+" buttons in the toolbar to add different node types
   - Each node type has specific capabilities and configuration options

### 2. **Configure Nodes**
   - Click the settings icon (⚙️) on any node
   - Fill in the required API credentials and parameters
   - Save your configuration

### 3. **Connect Nodes**
   - Drag from the output handle (bottom) of one node to the input handle (top) of another
   - Create workflows that pass data between different services

### 4. **Execute Workflows**
   - Click the play button (▶️) on individual nodes
   - Use the "Execute" button to run entire workflows
   - Monitor real-time execution status and results

## 🔧 Example Workflows

### 📧 **Email to Discord Notification**
```
Gmail Node (Read Emails) → Discord Node (Send Message)
```
*Automatically send Discord notifications when new emails arrive*

### 💾 **File Upload to Discord**
```
Google Drive Node (Upload File) → Discord Node (Send Embed)
```
*Notify Discord when files are uploaded to Google Drive*

### 🐦 **Twitter Digest to Email**
```
Twitter Node (Get User Tweets) → Gmail Node (Send Email)
```
*Send daily email digests of specific Twitter accounts*

### 📊 **Trending Topics Alert**
```
Twitter Node (Get Trending) → Discord Node (Send Embed)
```
*Send trending topics to Discord with rich embeds*

## 🏗️ Architecture

### **Frontend Stack**
- **Next.js 14**: React framework with App Router
- **React Flow**: Interactive node-based workflow editor
- **shadcn/ui**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

### **API Integration**
- **Real API Calls**: All nodes make actual API requests (no simulation)
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: Built-in respect for API rate limits
- **Security**: Secure token handling and validation

### **State Management**
- **React Hooks**: Local state management for each node
- **Real-time Updates**: Live execution status and results
- **Persistent Configuration**: Save and reuse node configurations

## 🔒 Security Features

- **Token Validation**: Basic format validation for all API tokens
- **Secure Storage**: Tokens stored in component state (consider environment variables for production)
- **Error Handling**: Secure error messages that don't expose sensitive information
- **Rate Limiting**: Respects API rate limits to prevent abuse

## 🚧 Development

### **Project Structure**
```
fe/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── flow/           # React Flow components
│   │   │   ├── nodes/      # Node implementations
│   │   │   └── FlowCanvas.tsx
│   │   └── ui/             # shadcn/ui components
│   └── lib/                # Utility functions and API
├── public/                  # Static assets
└── docs/                    # Setup guides and documentation
```

### **Adding New Nodes**
1. Create a new node component in `src/components/flow/nodes/`
2. Add API functions in `src/lib/api.ts`
3. Register the node type in `FlowCanvas.tsx`
4. Add toolbar buttons for easy access
5. Create setup documentation

### **Styling Guidelines**
- Use Tailwind CSS classes for styling
- Follow shadcn/ui design patterns
- Maintain consistent spacing and typography
- Use semantic color variables for theming

## 🚀 Deployment

### **Environment Variables**
Create a `.env.local` file:
```env
# Google APIs
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_client_secret

# Discord (optional)
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Twitter (optional)
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
```

### **Production Build**
```bash
npm run build
npm start
```

### **Deployment Platforms**
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative with good Next.js support
- **Railway**: Good for full-stack applications
- **Self-hosted**: Docker support available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain consistent code formatting
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **n8n**: Inspiration for the workflow automation concept
- **React Flow**: Excellent node-based editor library
- **shadcn/ui**: Beautiful and accessible UI components
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the setup guides in the `docs/` folder

---

**Built with ❤️ using Next.js, React Flow, and shadcn/ui**
