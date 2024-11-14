export interface Repository {
  name: string
}

export interface GitActor {
  name: string
}

export interface Commit {
  repository: Repository
  commitUrl: string
  message: string
  author: GitActor
  committedDate: any
  additions: number
  deletions: number
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}
