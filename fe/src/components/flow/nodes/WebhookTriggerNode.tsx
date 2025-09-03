'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Webhook, Settings, Copy, Check } from 'lucide-react'

type WebhookTriggerNodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: {
    webhookType: 'gmail' | 'youtube' | 'github' | 'custom'
    webhookUrl?: string
    isActive?: boolean
    lastTriggered?: Date
    triggerCount?: number
  }
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

export default function WebhookTriggerNode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<WebhookTriggerNodeData>(
    data as WebhookTriggerNodeData
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate webhook URL based on type
  const getWebhookUrl = (type: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/api/webhooks/${type}`
  }

  const handleConfigSave = (config: WebhookTriggerNodeData['config']) => {
    setNodeData((prev) => ({
      ...prev,
      config: {
        ...config,
        webhookUrl: getWebhookUrl(config?.webhookType || 'custom'),
        isActive: true
      },
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const copyWebhookUrl = async () => {
    if (nodeData.config?.webhookUrl) {
      await navigator.clipboard.writeText(nodeData.config.webhookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const simulateTrigger = () => {
    setNodeData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        lastTriggered: new Date(),
        triggerCount: (prev.config?.triggerCount || 0) + 1
      },
      lastExecution: {
        status: 'success',
        message: 'Webhook triggered successfully',
        timestamp: new Date()
      }
    }))
  }

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'>
          <Webhook className='h-5 w-5' />
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
          {nodeData.config?.webhookType && (
            <Badge variant='secondary' className='w-fit mt-1 text-xs'>
              {nodeData.config.webhookType}
            </Badge>
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
                <SheetTitle>Configure Webhook Trigger</SheetTitle>
                <SheetDescription>
                  Set up webhook triggers to start your workflows automatically.
                </SheetDescription>
              </SheetHeader>
              <WebhookConfigForm
                initialConfig={nodeData.config}
                onSave={handleConfigSave}
              />
            </SheetContent>
          </Sheet>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={simulateTrigger}
            disabled={!nodeData.isConfigured}
          >
            <Webhook className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='px-4 pb-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-2'>
          <span>Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              nodeData.config?.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}
          >
            {nodeData.config?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {nodeData.config?.webhookUrl && (
          <div className='mb-2'>
            <div className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground'>Webhook URL:</span>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 px-2 text-xs'
                onClick={copyWebhookUrl}
              >
                {copied ? (
                  <Check className='h-3 w-3 mr-1' />
                ) : (
                  <Copy className='h-3 w-3 mr-1' />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className='text-xs text-muted-foreground break-all'>
              {nodeData.config.webhookUrl}
            </div>
          </div>
        )}

        {nodeData.config?.lastTriggered && (
          <div className='text-xs text-muted-foreground mb-1'>
            Last triggered: {nodeData.config.lastTriggered.toLocaleString()}
          </div>
        )}

        {nodeData.config?.triggerCount && (
          <div className='text-xs text-muted-foreground mb-1'>
            Trigger count: {nodeData.config.triggerCount}
          </div>
        )}

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
        <div className='px-3 py-2 text-xs text-muted-foreground'>trigger</div>
        <div className='px-3 py-2 text-right text-xs text-muted-foreground'>
          output
        </div>
      </div>

      <Handle type='source' position={Position.Bottom} className={handleBase} />
    </div>
  )
}

function WebhookConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: WebhookTriggerNodeData['config']
  onSave: (config: WebhookTriggerNodeData['config']) => void
}) {
  const [formData, setFormData] = useState({
    webhookType: initialConfig?.webhookType || 'gmail'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='webhookType'>Webhook Type</Label>
        <Select
          value={formData.webhookType}
          onValueChange={(value: 'gmail' | 'youtube' | 'github' | 'custom') =>
            setFormData((prev) => ({ ...prev, webhookType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select webhook type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='gmail'>Gmail (New Email)</SelectItem>
            <SelectItem value='youtube'>YouTube (New Video)</SelectItem>
            <SelectItem value='github'>GitHub (New Issue/PR)</SelectItem>
            <SelectItem value='custom'>Custom Webhook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='p-4 bg-muted rounded-lg'>
        <h4 className='text-sm font-medium mb-2'>Setup Instructions:</h4>
        <div className='text-xs text-muted-foreground space-y-2'>
          {formData.webhookType === 'gmail' && (
            <div>
              <p>1. Go to Google Cloud Console</p>
              <p>2. Enable Gmail API</p>
              <p>3. Set up Push Notifications</p>
              <p>4. Use the webhook URL below</p>
            </div>
          )}
          {formData.webhookType === 'youtube' && (
            <div>
              <p>1. Go to Google Cloud Console</p>
              <p>2. Enable YouTube Data API</p>
              <p>3. Set up Push Notifications</p>
              <p>4. Use the webhook URL below</p>
            </div>
          )}
          {formData.webhookType === 'github' && (
            <div>
              <p>1. Go to your GitHub repository</p>
              <p>2. Settings → Webhooks</p>
              <p>3. Add webhook with the URL below</p>
              <p>4. Select events: Issues, Pull requests</p>
            </div>
          )}
          {formData.webhookType === 'custom' && (
            <div>
              <p>1. Use the webhook URL below</p>
              <p>2. Send POST requests to trigger</p>
              <p>3. Include JSON payload</p>
            </div>
          )}
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
