import { githubClient } from '../../client'
import {
  type GetMergedPullRequestsQueryVariables,
  type GetMergedPullRequestsQuery,
  GetMergedPullRequests,
} from '../../types'
import type { SearchResultItemEdge } from './request'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const prLimits = Number.parseInt(process.env.PR_LIMITS ?? '3')

export const useGetMergedPullRequests = async () => {
  async function getData() {
    let hasNextPage: boolean = true
    let name: string = process.env.GITHUB_USER ?? ''
    let query: string = `is:merged state:closed author:${name} type:pr`
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string = ''
    let variables: GetMergedPullRequestsQueryVariables = {
      query: query,
      first: first,
      after: null,
    }
    let allMergedPullRequests: SearchResultItemEdge[] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `query: ${query}, first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<GetMergedPullRequestsQuery>({
          query: GetMergedPullRequests,
          variables: variables,
        })
        .then(response => response.data)

      allMergedPullRequests = [
        ...allMergedPullRequests,
        ...(result.search.edges as SearchResultItemEdge[]),
      ]

      hasNextPage = result.search.pageInfo.hasNextPage
      after = result.search.pageInfo.endCursor ?? ''
      variables = {
        query: query,
        first: first,
        after: after,
      }
    }

    // if (isDebugMode) console.log('allMergedPullRequests', allMergedPullRequests)
    if (isDebugMode)
      console.log(
        'allMergedPullRequests',
        allMergedPullRequests.slice(0, prLimits)
      )

    // return allMergedPullRequests
    return allMergedPullRequests.slice(0, prLimits)
  }

  async function getMergedPullRequests() {
    return await getData()
  }

  return getMergedPullRequests().catch(e => console.error(e))
}

export default useGetMergedPullRequests
