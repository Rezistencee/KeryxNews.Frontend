import type { Article } from './article'

export interface User {
  id: string
  fullName: string
  email: string
  avatarUrl: string
  createdAt: string

  articles?: Article[]
}
