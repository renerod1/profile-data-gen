import type { PullRequestState } from '../../types'

export interface Query {
  search: SearchResultItemConnection
}

export interface SearchResultItemConnection {
  issueCount: number
  edges?: SearchResultItemEdge[]
  pageInfo: PageInfo
}

export interface SearchResultItemEdge {
  node?: PullRequest
}

export interface PullRequest {
  title: string
  url: any
  number: number
  state: PullRequestState
  merged: boolean
  createdAt: any
  closedAt?: any | null
  author?: User
  repository: Repository
}

export interface User {
  login: string
}

export interface Repository {
  name: string
  url: string
  stargazerCount: number
}

export interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
}
