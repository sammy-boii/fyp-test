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
import { MessageCircle, Settings, Play } from 'lucide-react'
import { sendDiscordMessage, validateDiscordToken } from '@/lib/api'

type DiscordNodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: {
    action: 'send_message' | 'send_embed' | 'get_channel_messages'
    channelId?: string
    message?: string
    embedTitle?: string
    embedDescription?: string
    embedColor?: string
    botToken?: string
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

export default function DiscordNode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<DiscordNodeData>(
    data as DiscordNodeData
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleConfigSave = (config: DiscordNodeData['config']) => {
    setNodeData((prev) => ({
      ...prev,
      config,
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const handleExecute = async () => {
    if (!nodeData.config?.botToken) {
      alert('Please configure the Discord node first')
      return
    }

    if (!validateDiscordToken(nodeData.config.botToken)) {
      alert('Invalid Discord bot token format')
      return
    }

    setNodeData((prev) => ({ ...prev, isExecuting: true }))

    try {
      const result = await sendDiscordMessage(nodeData.config)

      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: result.success ? 'success' : 'error',
          message: result.success
            ? `Discord ${nodeData.config?.action} completed successfully`
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
          message: `Failed to ${nodeData.config?.action} Discord message: ${error}`,
          timestamp: new Date()
        }
      }))
    }
  }

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'>
          <MessageCircle className='h-5 w-5' />
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
                <SheetTitle>Configure Discord Node</SheetTitle>
                <SheetDescription>
                  Set up your Discord node configuration. You'll need to provide
                  a bot token and channel ID.
                </SheetDescription>
              </SheetHeader>
              <DiscordConfigForm
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

function DiscordConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: DiscordNodeData['config']
  onSave: (config: DiscordNodeData['config']) => void
}) {
  const [formData, setFormData] = useState({
    action: initialConfig?.action || 'send_message',
    channelId: initialConfig?.channelId || '',
    message: initialConfig?.message || '',
    embedTitle: initialConfig?.embedTitle || '',
    embedDescription: initialConfig?.embedDescription || '',
    embedColor: initialConfig?.embedColor || '#5865F2',
    botToken: initialConfig?.botToken || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='action'>Action</Label>
        <Select
          value={formData.action}
          onValueChange={(
            value: 'send_message' | 'send_embed' | 'get_channel_messages'
          ) => setFormData((prev) => ({ ...prev, action: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='send_message'>Send Message</SelectItem>
            <SelectItem value='send_embed'>Send Embed</SelectItem>
            <SelectItem value='get_channel_messages'>
              Get Channel Messages
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='botToken'>Bot Token</Label>
        <Input
          id='botToken'
          type='password'
          placeholder='Enter your Discord bot token'
          value={formData.botToken}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, botToken: e.target.value }))
          }
          required
        />
        <p className='text-xs text-muted-foreground'>
          You can get this from Discord Developer Portal when creating a bot
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='channelId'>Channel ID</Label>
        <Input
          id='channelId'
          placeholder='Enter Discord channel ID (e.g., 123456789012345678)'
          value={formData.channelId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, channelId: e.target.value }))
          }
          required
        />
        <p className='text-xs text-muted-foreground'>
          Right-click on a channel and select "Copy ID" (Developer Mode must be
          enabled)
        </p>
      </div>

      {(formData.action === 'send_message' ||
        formData.action === 'send_embed') && (
        <div className='space-y-2'>
          <Label htmlFor='message'>Message Content</Label>
          <Textarea
            id='message'
            placeholder='Enter your message content'
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={3}
            required
          />
        </div>
      )}

      {formData.action === 'send_embed' && (
        <>
          <div className='space-y-2'>
            <Label htmlFor='embedTitle'>Embed Title</Label>
            <Input
              id='embedTitle'
              placeholder='Enter embed title'
              value={formData.embedTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, embedTitle: e.target.value }))
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='embedDescription'>Embed Description</Label>
            <Textarea
              id='embedDescription'
              placeholder='Enter embed description'
              value={formData.embedDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  embedDescription: e.target.value
                }))
              }
              rows={3}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='embedColor'>Embed Color (Hex)</Label>
            <Input
              id='embedColor'
              placeholder='#5865F2'
              value={formData.embedColor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, embedColor: e.target.value }))
              }
              required
            />
            <p className='text-xs text-muted-foreground'>
              Use hex color codes (e.g., #5865F2 for Discord blue)
            </p>
          </div>
        </>
      )}

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='submit' className='w-full'>
          Save Configuration
        </Button>
      </div>
    </form>
  )
}
