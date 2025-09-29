import type { Post } from './article'
import type { Category } from './category'
import type { Pagination } from './pagination'

export type PostsByCategoryResponse = {
  category: Category
  pagination: Pagination
  posts: Post[]
}
