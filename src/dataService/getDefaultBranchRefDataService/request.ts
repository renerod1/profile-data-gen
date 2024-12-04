export interface Query {
  repository?: Repository
}

export interface Repository {
  defaultBranchRef?: Ref
}

export interface Ref {
  name: string
}
