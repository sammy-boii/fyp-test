import { Hono } from 'hono'
import { scheduleJob } from 'node-schedule'
import { test } from './server'

const app = new Hono()

app.get('/', async (c) => {
  // const { time } = await c.req.json()
  scheduleJob('*/5 * * * * *', test)
  return c.text('Done')
})

export default app
