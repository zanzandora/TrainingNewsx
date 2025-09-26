export type Article = {
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
