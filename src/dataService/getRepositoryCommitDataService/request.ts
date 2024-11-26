export interface Query {
  repository?: Repository
}

export interface Repository {
  defaultBranchRef?: Ref
}

export interface Ref {
  target?: Commit
}

export interface Commit {
  history: CommitHistoryConnection
}

export interface CommitHistoryConnection {
  totalCount: number
  nodes?: Commit[]
  pageInfo: PageInfo
}

export interface Commit {
  commitUrl: string
  message: string
  committedDate: any
  additions: number
  deletions: number
  repository: Repository
  author?: GitActor
}

export interface Repository {
  name: string
}

export interface GitActor {
  name?: string
}

export interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
}
