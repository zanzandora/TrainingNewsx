// server/api/test-insert.post.ts
import { mongoose } from '../utils/database'

// Define a simple test schema
const TestSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const message =
      body?.message || `Test message created at ${new Date().toISOString()}`

    // Create a test document
    const testDoc = new TestModel({ message })
    const savedDoc = await testDoc.save()

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: savedDoc._id,
        message: savedDoc.message,
        createdAt: savedDoc.createdAt,
      },
      message: 'Document created successfully',
    }
  } catch (error) {
    console.error('Database insert error:', error)

    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create document',
    }
  }
})
