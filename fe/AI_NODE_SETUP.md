# AI Node Setup Guide

This guide explains how to use the AI node with different AI providers to generate content in your workflows.

## Supported AI Providers

### 1. OpenAI (GPT Models)
- **Models:** GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **Pricing:** Pay-per-use, has free tier
- **Best for:** General text generation, coding, analysis

**Setup:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get API key
3. Add credits to your account
4. Use API key starting with `sk-`

### 2. Anthropic (Claude Models)
- **Models:** Claude 3 Haiku, Sonnet, Opus
- **Pricing:** Pay-per-use, generous free tier
- **Best for:** Long-form content, analysis, reasoning

**Setup:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account and get API key
3. Use API key starting with `sk-ant-`

### 3. Google (Gemini Models)
- **Models:** Gemini Pro, Gemini Pro Vision
- **Pricing:** Very generous free tier
- **Best for:** Multimodal content, fast responses

**Setup:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Use the generated API key

### 4. Groq (Fast LLMs)
- **Models:** Llama 2, Mixtral, Gemma
- **Pricing:** Generous free tier, very fast
- **Best for:** Fast responses, high throughput

**Setup:**
1. Go to [Groq Console](https://console.groq.com/)
2. Create an account and get API key
3. Use API key starting with `gsk_`

## Using the AI Node

### 1. Add AI Node to Workflow
- Click "AI" button in the toolbar
- The AI node will be added to your canvas

### 2. Configure the AI Node
- Click the settings (gear) icon on the AI node
- Select your preferred AI provider
- Choose a model from the dropdown
- Enter your API key
- Write your prompt
- Adjust parameters (max tokens, temperature)

### 3. Connect and Execute
- Connect the AI node to other nodes in your workflow
- Click the play button to execute
- The AI response will be available for connected nodes

## Configuration Options

### Provider Selection
Choose from:
- **OpenAI:** Best overall performance, good for most tasks
- **Anthropic:** Excellent for long-form content and analysis
- **Google:** Fast and free, good for quick tasks
- **Groq:** Fastest responses, good for high-volume tasks

### Model Selection
Each provider offers different models:
- **GPT-3.5 Turbo:** Fast and cost-effective
- **GPT-4:** Most capable, higher cost
- **Claude 3 Haiku:** Fast and efficient
- **Claude 3 Sonnet:** Balanced performance
- **Claude 3 Opus:** Most capable Claude model
- **Gemini Pro:** Google's flagship model
- **Llama 2/Mixtral:** Open-source models via Groq

### Parameters

#### Max Tokens
- Controls the maximum length of the AI response
- Range: 1-4000 tokens
- Higher values = longer responses, more cost

#### Temperature
- Controls randomness in responses
- Range: 0.0-2.0
- 0.0 = deterministic, 2.0 = very creative
- Recommended: 0.7 for balanced creativity

## Example Use Cases

### 1. Content Generation
**Prompt:** "Write a professional email to a client about project updates"
**Provider:** OpenAI GPT-4
**Use case:** Automatically generate emails from project data

### 2. Data Analysis
**Prompt:** "Analyze this data and provide insights: {data}"
**Provider:** Anthropic Claude 3 Sonnet
**Use case:** Process data from other nodes and generate insights

### 3. Code Generation
**Prompt:** "Generate a React component for a user profile card"
**Provider:** OpenAI GPT-4
**Use case:** Generate code based on requirements

### 4. Translation
**Prompt:** "Translate the following text to Spanish: {text}"
**Provider:** Google Gemini Pro
**Use case:** Translate content from other nodes

### 5. Summarization
**Prompt:** "Summarize this article in 3 bullet points: {article}"
**Provider:** Groq Mixtral
**Use case:** Process long content and create summaries

## Best Practices

### 1. Prompt Engineering
- Be specific and clear in your prompts
- Include examples when possible
- Use structured output formats (JSON, markdown)
- Test different prompt variations

### 2. Cost Optimization
- Use appropriate models for the task
- Set reasonable max token limits
- Consider using faster/cheaper models for simple tasks
- Monitor your API usage

### 3. Error Handling
- Always validate AI responses
- Implement fallback strategies
- Handle rate limits and API errors
- Test with various inputs

### 4. Security
- Never expose API keys in client-side code
- Validate and sanitize AI outputs
- Be cautious with sensitive data
- Review AI responses before using them

## Workflow Integration Examples

### 1. Email Automation
```
Gmail Trigger → AI Node (Generate Response) → Gmail Node (Send Reply)
```

### 2. Content Pipeline
```
YouTube Trigger → AI Node (Generate Summary) → LinkedIn Node (Post Summary)
```

### 3. Data Processing
```
GitHub Issue → AI Node (Analyze Issue) → Discord Node (Notify Team)
```

### 4. Multi-step AI Processing
```
Input → AI Node (Extract Key Points) → AI Node (Generate Report) → Output
```

## Troubleshooting

### Common Issues:

1. **API Key Invalid:**
   - Check if the API key is correct
   - Ensure the key has proper permissions
   - Verify the key format for each provider

2. **Rate Limits:**
   - Implement delays between requests
   - Use different API keys for high volume
   - Consider upgrading your plan

3. **Poor Responses:**
   - Improve your prompt
   - Try different models
   - Adjust temperature and max tokens
   - Add more context to your prompt

4. **High Costs:**
   - Use cheaper models for simple tasks
   - Reduce max token limits
   - Optimize your prompts
   - Monitor usage regularly

### Testing Tips:

1. **Start Simple:** Test with basic prompts first
2. **Iterate:** Refine prompts based on results
3. **Compare Models:** Try different providers/models
4. **Monitor Performance:** Track response times and costs

## Environment Variables

For production, store API keys securely:

```env
# Optional: Set default API keys (not recommended for production)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
```

## Next Steps

1. Choose an AI provider and get an API key
2. Add an AI node to your workflow
3. Write your first prompt
4. Test and iterate on your prompts
5. Connect AI nodes to other workflow components
6. Monitor usage and optimize for cost/performance
