import { githubClient } from '../../client'
import { GetRepositoryCommits } from '../../types'
import type { RepositoryCommitRequest } from './request'
import type { RepositoryCommitResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetRepoCommits = async (
  owner: string,
  repo: string
): Promise<
  RepositoryCommitResponse['repository']['defaultBranchRef']['target']['history']['nodes']
> => {
  async function getData(): Promise<
    RepositoryCommitResponse['repository']['defaultBranchRef']['target']['history']['nodes']
  > {
    let hasNextPage: boolean = true
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string | null = null
    let variables: RepositoryCommitRequest = {
      owner: owner,
      repo: repo,
      first: first,
      after: after,
    }
    let allRepositoryCommits: RepositoryCommitResponse['repository']['defaultBranchRef']['target']['history']['nodes'] =
      []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `owner: ${owner}, name: ${repo}, first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<RepositoryCommitResponse>({
          query: GetRepositoryCommits,
          variables: variables,
        })
        .then(response => response.data)

      allRepositoryCommits = [
        ...allRepositoryCommits,
        ...(result.repository?.defaultBranchRef?.target?.history.nodes ?? []),
      ]

      hasNextPage =
        result.repository?.defaultBranchRef?.target?.history.pageInfo
          .hasNextPage ?? false
      after =
        result.repository?.defaultBranchRef?.target?.history.pageInfo
          .endCursor ?? null
      variables = {
        owner: owner,
        repo: repo,
        first: first,
        after: after,
      }
    }

    return allRepositoryCommits
  }

  return await getData()
}

export default useGetRepoCommits
