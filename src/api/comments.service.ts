import { api } from './client'

export async function createComment(articleId: string, content: string) {
  const response = await api.post(`/article/${articleId}/comments`, {
    content,
  })

  return response.data
}

export async function reportComment(commentId: string, reason: string) {
  const response = await api.post(`/comment/${commentId}/reports`, {
    reason,
  })

  return response.data
}
