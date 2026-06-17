import { api } from './client'

export async function getReports() {
  const response = await api.get('/reports')

  return response.data
}
