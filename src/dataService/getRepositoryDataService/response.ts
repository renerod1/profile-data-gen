import type { PageInfo, Repository } from './request'

export interface RepositoryResponse {
  viewer: {
    repositories: {
      totalCount: number
      nodes: Repository[]
      pageInfo: PageInfo
    }
  }
}
