export const ROLES = {
  Admin: 'Admin',
  Author: 'Author',
  User: 'User',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
