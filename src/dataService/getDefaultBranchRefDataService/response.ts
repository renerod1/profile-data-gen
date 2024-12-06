export interface Query {
  repository?: Repository | null
}

export interface Repository {
  defaultBranchRef?: Ref | null
}

export interface Ref {
  name: string
}

export interface DefaultBranchRefsResponse {
  repository: {
    defaultBranchRef: {
      name: string
    }
  }
}
