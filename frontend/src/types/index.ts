export interface Feature {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'PLANNED' | 'IN_PROGRESS' | 'DONE'
  authorId: string
  authorName: string
  voteCount: number
  hasVoted: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

export interface ApiError {
  error: string
  message: string
  field?: string
}
