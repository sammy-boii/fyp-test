import FlowCanvas from '@/components/flow/FlowCanvas'
import DemoInstructions from '@/components/DemoInstructions'

const HomePage = () => {
  return (
    <div className='p-6'>
      <div className='mb-6 flex items-end justify-between'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Workflow Automation
          </h1>
          <p className='text-muted-foreground mt-2'>
            Create automated workflows with Gmail, Google Drive, Discord, and
            Twitter integration. Drag, connect, and execute your automation
            tasks across multiple platforms.
          </p>
        </div>
        <div className='text-right'>
          <div className='text-sm text-muted-foreground'>Bootleg n8n</div>
          <div className='text-xs text-muted-foreground'>
            Powered by React Flow & shadcn
          </div>
        </div>
      </div>
      <DemoInstructions />
      <FlowCanvas />
    </div>
  )
}
export default HomePage
