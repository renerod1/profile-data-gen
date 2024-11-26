import type { PageInfo, Commit } from './request'

export interface RepositoryCommitResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number
          nodes: Commit[]
          pageInfo: PageInfo
        }
      }
    }
  }
}
