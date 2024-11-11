export interface Repository {
  name: string
  isPrivate: boolean
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}
