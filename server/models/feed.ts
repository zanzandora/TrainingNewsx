import type { Document } from 'mongoose'

import { model, Schema } from 'mongoose'

// Post interface
export type IFeed = Document & {
  source: string
  rss_url: string
  name: string
  category: string
  active: boolean
}

const COLLECTION_NAME = 'Feeds'
const MODEL_NAME = 'Feed'

const feedSchema = new Schema<IFeed>(
  {
    source: { type: String, required: true, default: 'tuoitre' },
    rss_url: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

export const FeedModel = model<IFeed>(MODEL_NAME, feedSchema)
