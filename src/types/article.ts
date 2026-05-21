import type { ArticleComment } from './articleComment'

export interface Article {
  id?: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  views: number
  commentsCount: number

  comments: ArticleComment[]
}
