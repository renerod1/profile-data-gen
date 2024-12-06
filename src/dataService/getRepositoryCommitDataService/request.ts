export interface RepositoryCommitRequest {
  owner: string
  repo: string
  first?: number
  after?: string | null
}
