export interface Query {
  repository?: Repository
}

export interface Repository {
  object?: Blob
}

export interface Blob {
  text?: string
}
