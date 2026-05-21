import type { Article } from './article'
import type { ArticleComment } from './articleComment'

export interface User {
  id: string
  fullName: string
  email: string
  avatarUrl: string
  createdAt: string
  bannedUntil: string

  articles?: Article[]
  comments?: ArticleComment[]
}
