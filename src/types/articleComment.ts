import type { Author } from './author'

export interface ArticleComment {
  id: string
  author: Author
  content: string
  createdAt: string
}
