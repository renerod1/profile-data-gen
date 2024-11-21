import { githubClient } from '../../client'
import {
  type GetRepositoriesQueryVariables,
  type GetRepositoriesQuery,
  GetRepositories,
} from '../../types'
import type { Repository } from './request'
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
      after: null,
    }
    let allRepositories: Repository[] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<GetRepositoriesQuery>({
          query: GetRepositories,
          variables: variables,
        })
        .then(response => response.data)

      allRepositories = [
        ...allRepositories,
        ...(result.viewer.repositories.nodes as Repository[]),
      ]

      hasNextPage = result.viewer.repositories.pageInfo.hasNextPage
      after = result.viewer.repositories.pageInfo.endCursor ?? ''
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
