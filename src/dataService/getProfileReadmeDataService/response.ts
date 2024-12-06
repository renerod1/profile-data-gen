export interface Query {
  repository?: Repository | null
}

export interface Repository {
  object?: Blob | null
}

export interface Blob {
  text?: string | null
}

export interface ProfileReadmeResponse {
  repository?: {
    object?: {
      text?: string | null
    }
  }
}
