'use server'

export const testAction = async () => {
  await new Promise((res) => setTimeout(res, 1000))
  if (Math.random() > 0.5) {
    throw new Error('Something happened')
  }
  return { data: 'Done' }
}
