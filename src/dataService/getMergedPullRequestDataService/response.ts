import type { PageInfo, PullRequest } from './request'

export interface RepositoryCommitResponse {
  search: {
    issueCount: number
    edges: {
      node: PullRequest
    }
    pageInfo: PageInfo
  }
}
