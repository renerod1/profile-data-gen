import { githubClient } from '../../client'
import {
  type GetRepositoryCommitsQueryVariables,
  type GetRepositoryCommitsQuery,
  GetRepositoryCommits,
} from '../../../types'
import type { Commit } from './request'
import type { RepositoryCommitResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetRepoCommits = async (repo: string, branch: string) => {
  async function getData() {
    let hasNextPage: boolean = true
    let name: string = repo
    let qualifiedName: string = branch
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string = null
    let variables: GetRepositoryCommitsQueryVariables = {
      name: name,
      qualifiedName: branch,
      first: first,
      after: after,
    }
    let allRepositoryCommits: Commit[] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `name: ${name}, qualifiedName: ${qualifiedName}, first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result: RepositoryCommitResponse =
        await githubClient().query<GetRepositoryCommitsQuery>({
          query: GetRepositoryCommits,
          variables: variables,
        })

      allRepositoryCommits = [
        ...allRepositoryCommits,
        ...result.data.viewer.repository.ref.target.history.nodes,
      ]

      hasNextPage = (result.data.viewer.repository?.ref?.target as Commit)
        .history.pageInfo.hasNextPage
      after = (result.data.viewer.repository?.ref?.target as Commit).history
        .pageInfo.endCursor
      variables = {
        name: name,
        qualifiedName: branch,
        first: first,
        after: after,
      }
    }

    return allRepositoryCommits
  }

  async function getRepositoryCommits() {
    return await getData()
  }

  return getRepositoryCommits().catch(e => console.error(e))
}

export default useGetRepoCommits
