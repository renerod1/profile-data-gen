import { githubClient } from '../../client'
import {
  type GetRepositoriesQueryVariables,
  type GetRepositoriesQuery,
  GetRepositories,
} from '../../../types'
import type { Repository } from './request'
import type { RepositoryResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const isIncludePrivateRepos = process.env.INCLUDE_PRIVATE_REPOS == 'true'

export const useGetRepos = async () => {
  async function getData() {
    let hasNextPage: boolean = true
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string = ''
    let variables: GetRepositoriesQueryVariables = {
      first: first,
      after: after,
    }
    let allRepositories: Repository[] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result: RepositoryResponse =
        await githubClient().query<GetRepositoriesQuery>({
          query: GetRepositories,
          variables: variables,
        })

      allRepositories = [
        ...allRepositories,
        ...result.data.viewer.repositories.nodes,
      ]

      hasNextPage = result.data.viewer.repositories.pageInfo.hasNextPage
      after = result.data.viewer.repositories.pageInfo.endCursor
      variables = { first: first, after: after }
    }

    return allRepositories
  }

  async function getRepositories() {
    if (isIncludePrivateRepos) return await getData()
    else return (await getData()).filter(v => v.isPrivate == false)
  }

  return getRepositories().catch(e => console.error(e))
}

export default useGetRepos
