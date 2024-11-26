import { githubClient } from '../../client'
import {
  type GetRepositoryCommitsQueryVariables,
  type GetRepositoryCommitsQuery,
  GetRepositoryCommits,
} from '../../types'
import type { Commit } from './request'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetRepoCommits = async (
  owner: string,
  repo: string
): Promise<Commit[]> => {
  async function getData(): Promise<Commit[]> {
    let hasNextPage: boolean = true
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string = ''
    let variables: GetRepositoryCommitsQueryVariables = {
      owner: owner,
      repo: repo,
      first: first,
      after: null,
    }
    let allRepositoryCommits: Commit[] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `owner: ${owner}, name: ${repo}, first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<GetRepositoryCommitsQuery>({
          query: GetRepositoryCommits,
          variables: variables,
        })
        .then(response => response.data)

      allRepositoryCommits = [
        ...allRepositoryCommits,
        ...((result.repository?.defaultBranchRef?.target as Commit).history
          .nodes as Commit[]),
      ]

      hasNextPage = (result.repository?.defaultBranchRef?.target as Commit)
        .history.pageInfo.hasNextPage
      after =
        (result.repository?.defaultBranchRef?.target as Commit).history.pageInfo
          .endCursor ?? ''
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
