export interface Query {
  viewer: User
}

export interface User {
  repositories: RepositoryConnection
}

export interface RepositoryConnection {
  totalCount: number
  nodes?: Repository[]
  pageInfo: PageInfo
}

export interface Repository {
  name: string
  isArchived: boolean
  isFork: boolean
  isPrivate: boolean
}

export interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
}
