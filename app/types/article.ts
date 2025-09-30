export type Article = {
  id?: number | string
  image?: string
  category?: string
  title?: string
  description?: string
  author?: {
    name?: string
    avarta?: {
      src?: string
    }
  }
  pubDate?: string
  featured?: boolean
}

export type AuthorAvatar = {
  src: string
}

export type PostAuthor = {
  name: string
  avatar: AuthorAvatar
}

export type Post = {
  id: string
  v?: number | null
  author: PostAuthor
  title: string
  slug: string
  link: string
  pubDate: string
  description: string
  image?: string | null
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
  source?: string | null
  tags: string[]
  categories: [
    {
      id: string
      name: string
      slug: string
    },
  ]
}
