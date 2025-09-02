'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'

type IconTitleData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

const handleBase =
  'w-3 h-3 !bg-primary !border-2 !border-background rounded-full'

export default function IconTitleNode({ data }: NodeProps) {
  const d = data as IconTitleData
  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
          {d.icon ?? <span className='text-lg'>🌐</span>}
        </div>
        <div className='flex min-w-0 flex-col'>
          <span className='truncate text-sm font-semibold'>{d.title}</span>
          {d.subtitle ? (
            <span className='truncate text-xs text-muted-foreground'>
              {d.subtitle}
            </span>
          ) : null}
        </div>
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
