// server/plugins/mongodb.ts
import mongoose from 'mongoose'

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection
  }

  try {
    const config = useRuntimeConfig()
    const uri = config.mongodbUri

    if (!uri) {
      throw new Error('⚠️ Missing MONGODB_URI in runtime config')
    }

    console.warn('🔄 Connecting to MongoDB...')

    const connection = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    })

    isConnected = mongoose.connection.readyState === 1
    console.warn('✅ MongoDB connected successfully')

    return connection
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    isConnected = false
    throw error
  }
}

// Nitro plugin - automatically runs when server starts
export default defineNitroPlugin(async (nitroApp) => {
  console.warn('🚀 Initializing MongoDB connection...')

  try {
    await connectToDatabase()

    // Setup connection event listeners
    mongoose.connection.on('connected', () => {
      console.warn('✅ Mongoose connected to MongoDB')
      isConnected = true
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose disconnected')
      isConnected = false
    })

    // Graceful shutdown
    nitroApp.hooks.hook('close', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close()
        console.warn('👋 MongoDB connection closed')
      }
    })
  } catch (error) {
    console.error('❌ Failed to initialize MongoDB connection:', error)
  }
})

// Export connection status checker
export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1
}
