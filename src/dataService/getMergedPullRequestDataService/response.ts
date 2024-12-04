import type { PageInfo, PullRequest } from './request'

export interface MergedPullRequestResponse {
  search: {
    issueCount: number
    edges: {
      node: PullRequest
    }
    pageInfo: PageInfo
  }
}
