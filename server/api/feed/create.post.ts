import { FeedModel } from '../../models/feed'
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const newFeed = await FeedModel.create(body)
    return { newFeed }
  } catch (error) {
    console.error('Error in create feed API:', error)
    event.res.statusCode = 500
    return { error: 'Failed to create feed' }
  }
})
