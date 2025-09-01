import app from '.'

const PORT = process.env.PORT || 5000

Bun.serve({
  fetch: (req) => app.fetch(req),
  port: PORT
})

console.log(`Server is running on port ${PORT}`)

export function test() {
  console.log(`Job executed at ${new Date().toISOString()}`)
}
