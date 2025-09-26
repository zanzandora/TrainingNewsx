// server/models/post.ts
import type { Document } from 'mongoose'

import { model, Schema } from 'mongoose'

// Post interface
export type IPost = Document & {
  title: string
  content: string
  author: Schema.Types.ObjectId
  slug: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  featuredImage?: string
  publishedAt?: Date
  viewCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const COLLECTION_NAME = 'posts'
const MODEL_NAME = 'Post'

// Post schema
const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [10000, 'Content cannot exceed 10,000 characters'],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },

    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be draft, published, or archived',
      },
      default: 'draft',
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag cannot exceed 30 characters'],
      },
    ],

    publishedAt: {
      type: Date,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

// Add indexes
postSchema.index({ slug: 1 })
postSchema.index({ author: 1 })
postSchema.index({ status: 1 })
postSchema.index({ tags: 1 })
postSchema.index({ publishedAt: -1 })
postSchema.index({ createdAt: -1 })

// Compound indexes
postSchema.index({ status: 1, publishedAt: -1 })
postSchema.index({ author: 1, status: 1 })

// Virtual for excerpt
postSchema.virtual('excerpt').get(function (this: IPost) {
  if (this.content) {
    return (
      this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '')
    )
  }
  return ''
})

// Static methods
postSchema.statics = {
  findPublished() {
    return this.find({ status: 'published', isActive: true })
      .populate('author', 'username firstName lastName')
      .sort({ publishedAt: -1 })
  },

  findBySlug(slug: string) {
    return this.findOne({ slug, isActive: true }).populate(
      'author',
      'username firstName lastName',
    )
  },

  findByAuthor(authorId: string) {
    return this.find({ author: authorId, isActive: true }).sort({
      createdAt: -1,
    })
  },

  findByTag(tag: string) {
    return this.find({ tags: tag, status: 'published', isActive: true })
      .populate('author', 'username firstName lastName')
      .sort({ publishedAt: -1 })
  },
}

// Instance methods
postSchema.methods = {
  publish(this: IPost) {
    this.status = 'published'
    this.publishedAt = new Date()
    return this.save()
  },

  incrementViewCount(this: IPost) {
    this.viewCount += 1
    return this.save()
  },

  addTag(this: IPost, tag: string) {
    const normalizedTag = tag.toLowerCase().trim()
    if (!this.tags.includes(normalizedTag)) {
      this.tags.push(normalizedTag)
    }
    return this.save()
  },

  removeTag(this: IPost, tag: string) {
    const normalizedTag = tag.toLowerCase().trim()
    this.tags = this.tags.filter((t) => t !== normalizedTag)
    return this.save()
  },
}

// Pre-save middleware
postSchema.pre('save', function (this: IPost, next) {
  // Auto-generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

// Create and export the model
export const Post = model<IPost>(MODEL_NAME, postSchema)
