import type { ArticleComment } from './articleComment'
import type { Author } from './author'

export type ArticleStatus = 'Draft' | 'PendingReview' | 'Approved' | 'Rejected'

export interface Article {
  id?: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  status: ArticleStatus
  views: number
  commentsCount: number

  author: Author

  comments: ArticleComment[]
}
