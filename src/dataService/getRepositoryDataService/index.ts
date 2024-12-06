import { githubClient } from '../../client'
import { GetRepositories } from '../../types'
import type { RepositoryRequest } from './request'
import type { RepositoryResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const isIncludePrivateRepos = process.env.INCLUDE_PRIVATE_REPOS == 'true'

export const useGetRepos = async (): Promise<
  RepositoryResponse['viewer']['repositories']['nodes']
> => {
  async function getData(): Promise<
    RepositoryResponse['viewer']['repositories']['nodes']
  > {
    let hasNextPage: boolean = true
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string | null = null
    let variables: RepositoryRequest = {
      first: first,
      after: after,
    }
    let allRepositories: RepositoryResponse['viewer']['repositories']['nodes'] =
      []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<RepositoryResponse>({
          query: GetRepositories,
          variables: variables,
        })
        .then(response => response.data)

      allRepositories = [
        ...allRepositories,
        ...(result.viewer.repositories.nodes ?? []),
      ]

      hasNextPage = result.viewer.repositories.pageInfo.hasNextPage ?? false
      after = result.viewer.repositories.pageInfo.endCursor ?? null
    }

    return allRepositories
  }

  if (isIncludePrivateRepos)
    return (await getData()).filter(
      v => v.isArchived == false && v.isFork == false
    )
  else
    return (await getData()).filter(
      v => v.isArchived == false && v.isFork == false && v.isPrivate == false
    )
}

export default useGetRepos
