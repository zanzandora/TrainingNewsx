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
