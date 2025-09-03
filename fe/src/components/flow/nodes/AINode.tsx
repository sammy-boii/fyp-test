'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Bot, Settings, Play } from 'lucide-react'
import { executeAIAction, validateAIToken, type AIConfig } from '@/lib/api'

type AINodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: AIConfig
  isConfigured?: boolean
  isExecuting?: boolean
  lastExecution?: {
    status: 'success' | 'error'
    message: string
    timestamp: Date
  }
}

const handleBase =
  'w-3 h-3 !bg-primary !border-2 !border-background rounded-full'

export default function AINode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<AINodeData>(data as AINodeData)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleConfigSave = (config: AIConfig) => {
    setNodeData((prev) => ({
      ...prev,
      config,
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const handleExecute = async () => {
    if (!nodeData.config?.apiKey) {
      alert('Please configure the AI node first')
      return
    }

    if (!validateAIToken(nodeData.config.apiKey, nodeData.config.provider)) {
      alert('Invalid API key format')
      return
    }

    setNodeData((prev) => ({ ...prev, isExecuting: true }))

    try {
      const result = await executeAIAction({
        provider: nodeData.config.provider,
        model: nodeData.config.model,
        prompt: nodeData.config.prompt,
        apiKey: nodeData.config.apiKey,
        maxTokens: nodeData.config.maxTokens,
        temperature: nodeData.config.temperature
      })

      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: result.success ? 'success' : 'error',
          message: result.success
            ? `AI ${nodeData.config?.provider} completed successfully`
            : result.error || 'Unknown error occurred',
          timestamp: new Date()
        }
      }))
    } catch (error) {
      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: 'error',
          message: `Failed to execute AI: ${error}`,
          timestamp: new Date()
        }
      }))
    }
  }

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'>
          <Bot className='h-5 w-5' />
        </div>
        <div className='flex min-w-0 flex-col flex-1'>
          <span className='truncate text-sm font-semibold'>
            {nodeData.title}
          </span>
          {nodeData.subtitle ? (
            <span className='truncate text-xs text-muted-foreground'>
              {nodeData.subtitle}
            </span>
          ) : null}
          {nodeData.config?.provider && (
            <span className='text-xs text-muted-foreground capitalize'>
              {nodeData.config.provider}
            </span>
          )}
        </div>
        <div className='flex gap-1'>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <Settings className='h-4 w-4' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-[400px] sm:w-[540px]'>
              <SheetHeader>
                <SheetTitle>Configure AI Node</SheetTitle>
                <SheetDescription>
                  Choose an AI provider and configure your prompt.
                </SheetDescription>
              </SheetHeader>
              <AIConfigForm
                initialConfig={nodeData.config}
                onSave={handleConfigSave}
              />
            </SheetContent>
          </Sheet>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={handleExecute}
            disabled={!nodeData.isConfigured || nodeData.isExecuting}
          >
            <Play
              className={`h-4 w-4 ${
                nodeData.isExecuting ? 'animate-spin' : ''
              }`}
            />
          </Button>
        </div>
      </div>

      <div className='px-4 pb-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-2'>
          <span>Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              nodeData.isConfigured
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}
          >
            {nodeData.isConfigured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
        {nodeData.lastExecution && (
          <div className='text-xs text-muted-foreground'>
            <div
              className={`flex items-center gap-1 ${
                nodeData.lastExecution.status === 'success'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              <span className='w-2 h-2 rounded-full bg-current'></span>
              {nodeData.lastExecution.message}
            </div>
            <div className='text-xs opacity-75 mt-1'>
              {nodeData.lastExecution.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 border-t'>
        <div className='px-3 py-2 text-xs text-muted-foreground'>input</div>
        <div className='px-3 py-2 text-right text-xs text-muted-foreground'>
          output
        </div>
      </div>

      <Handle type='target' position={Position.Top} className={handleBase} />
      <Handle type='source' position={Position.Bottom} className={handleBase} />
    </div>
  )
}

function AIConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: AIConfig
  onSave: (config: AIConfig) => void
}) {
  const [formData, setFormData] = useState<AIConfig>({
    provider: initialConfig?.provider || 'openai',
    model: initialConfig?.model || 'gpt-3.5-turbo',
    prompt: initialConfig?.prompt || '',
    apiKey: initialConfig?.apiKey || '',
    maxTokens: initialConfig?.maxTokens || 1000,
    temperature: initialConfig?.temperature || 0.7
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const getModelsForProvider = (provider: string) => {
    const models = {
      openai: [
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
      ],
      anthropic: [
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' }
      ],
      google: [
        { value: 'gemini-pro', label: 'Gemini Pro' },
        { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
      ],
      groq: [
        { value: 'llama2-70b-4096', label: 'Llama 2 70B' },
        { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
        { value: 'gemma-7b-it', label: 'Gemma 7B' }
      ]
    }
    return models[provider as keyof typeof models] || []
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='provider'>AI Provider</Label>
        <Select
          value={formData.provider}
          onValueChange={(
            value: 'openai' | 'anthropic' | 'google' | 'groq'
          ) => {
            setFormData((prev) => ({
              ...prev,
              provider: value,
              model: getModelsForProvider(value)[0]?.value || ''
            }))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select AI provider' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='openai'>OpenAI (GPT)</SelectItem>
            <SelectItem value='anthropic'>Anthropic (Claude)</SelectItem>
            <SelectItem value='google'>Google (Gemini)</SelectItem>
            <SelectItem value='groq'>Groq (Fast LLMs)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='model'>Model</Label>
        <Select
          value={formData.model}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, model: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select model' />
          </SelectTrigger>
          <SelectContent>
            {getModelsForProvider(formData.provider).map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='apiKey'>API Key</Label>
        <Input
          id='apiKey'
          type='password'
          placeholder='Enter your API key'
          value={formData.apiKey}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
          }
          required
        />
        <p className='text-xs text-muted-foreground'>
          Get your API key from the provider's dashboard
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='prompt'>Prompt</Label>
        <Textarea
          id='prompt'
          placeholder='Enter your prompt here...'
          value={formData.prompt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, prompt: e.target.value }))
          }
          rows={4}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='maxTokens'>Max Tokens</Label>
          <Input
            id='maxTokens'
            type='number'
            min='1'
            max='4000'
            value={formData.maxTokens}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxTokens: parseInt(e.target.value) || 1000
              }))
            }
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='temperature'>Temperature</Label>
          <Input
            id='temperature'
            type='number'
            min='0'
            max='2'
            step='0.1'
            value={formData.temperature}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                temperature: parseFloat(e.target.value) || 0.7
              }))
            }
          />
        </div>
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='submit' className='w-full'>
          Save Configuration
        </Button>
      </div>
    </form>
  )
}
