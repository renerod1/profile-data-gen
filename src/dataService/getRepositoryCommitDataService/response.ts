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
  nodes?: Commit[] | null
  pageInfo: PageInfo
}

export interface Commit {
  commitUrl: string
  message: string
  committedDate: any
  additions: number
  deletions: number
  repository: Repository
  author?: GitActor | null
}

export interface Repository {
  name: string
}

export interface GitActor {
  name?: string | null
}

export interface PageInfo {
  endCursor?: string | null
  hasNextPage: boolean
}

export interface RepositoryCommitResponse {
  repository?: {
    defaultBranchRef?: {
      target?: {
        history: {
          totalCount: number
          nodes?: Commit[] | null
          pageInfo: PageInfo
        }
      } | null
    } | null
  } | null
}
