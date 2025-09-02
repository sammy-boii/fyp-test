import FlowCanvas from '@/components/flow/FlowCanvas'

const HomePage = () => {
  return (
    <div className='p-6'>
      <div className='mb-4 flex items-end justify-between'>
        <div>
          <h1 className='text-xl font-semibold'>Flow Playground</h1>
          <p className='text-sm text-muted-foreground'>
            Custom nodes styled with shadcn-like classes
          </p>
        </div>
      </div>
      <FlowCanvas />
    </div>
  )
}
export default HomePage
