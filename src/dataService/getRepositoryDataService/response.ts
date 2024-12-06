export interface Query {
  viewer: User
}

export interface User {
  repositories: RepositoryConnection
}

export interface RepositoryConnection {
  totalCount: number
  nodes?: Repository[] | null
  pageInfo: PageInfo
}

export interface Repository {
  name: string
  isArchived: boolean
  isFork: boolean
  isPrivate: boolean
}

export interface PageInfo {
  endCursor?: string | null
  hasNextPage: boolean
}

export interface RepositoryResponse {
  viewer: {
    repositories: {
      totalCount: number
      nodes?: Repository[] | null
      pageInfo: PageInfo
    }
  }
}
