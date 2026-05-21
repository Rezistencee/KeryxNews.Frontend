import { api } from './client'

export async function createComment(articleId: string, content: string) {
  const response = await api.post(`/article/${articleId}/comments`, {
    content,
  })

  return response.data
}
