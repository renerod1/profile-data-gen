import type { PageInfo, Commit } from './request'

export interface RepositoryCommitResponse {
  viewer: {
    repository: {
      ref: {
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
}
