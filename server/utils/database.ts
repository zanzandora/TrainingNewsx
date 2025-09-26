// server/utils/database.ts
import mongoose from 'mongoose'

import { connectToDatabase, isDbConnected } from '../plugins/mongodb'

// Export mongoose for direct use
export { mongoose }

// Export connection utilities
export { connectToDatabase, isDbConnected }

export async function getDatabaseStatus() {
  const connected = isDbConnected()

  return {
    connected,
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
    port: mongoose.connection.port || 'Unknown',
  }
}

// Get database stats (requires connection)
export async function getDatabaseStats() {
  if (!isDbConnected()) {
    throw new Error('Database not connected')
  }

  try {
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database instance not available')
    }

    const stats = await db.stats()
    return stats
  } catch (error) {
    console.error('Error getting database stats:', error)
    throw error
  }
}

// Ensure database connection
export async function ensureDbConnection() {
  if (!isDbConnected()) {
    await connectToDatabase()
  }
  return mongoose.connection
}

// Collection utilities
export async function getCollectionNames() {
  if (!isDbConnected()) {
    throw new Error('Database not connected')
  }

  try {
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database instance not available')
    }

    const collections = await db.listCollections().toArray()
    return collections.map((col) => col.name)
  } catch (error) {
    console.error('Error getting collection names:', error)
    throw error
  }
}

// Drop all collections (use with caution - mainly for testing)
export async function dropAllCollections() {
  if (!isDbConnected()) {
    throw new Error('Database not connected')
  }

  try {
    const collections = await mongoose.connection.db?.collections()
    if (collections) {
      await Promise.all(collections.map((collection) => collection.drop()))
    }
  } catch (error) {
    console.error('Error dropping collections:', error)
    throw error
  }
}

// Create indexes for all models
export async function createIndexes() {
  if (!isDbConnected()) {
    throw new Error('Database not connected')
  }

  try {
    const models = mongoose.models
    const indexPromises = Object.values(models).map((model) =>
      (model as mongoose.Model<unknown>).createIndexes(),
    )

    await Promise.all(indexPromises)
    console.warn('✅ All indexes created successfully')
  } catch (error) {
    console.error('Error creating indexes:', error)
    throw error
  }
}
