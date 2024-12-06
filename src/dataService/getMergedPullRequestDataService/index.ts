import { githubClient } from '../../client'
import { GetMergedPullRequests } from '../../types'
import type { MergedPullRequestRequest } from './request'
import type { MergedPullRequestResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const prLimits = Number.parseInt(process.env.PR_LIMITS ?? '3')

export const useGetMergedPullRequests = async (): Promise<
  MergedPullRequestResponse['search']['edges']
> => {
  async function getData(): Promise<
    MergedPullRequestResponse['search']['edges']
  > {
    let hasNextPage: boolean = true
    let name: string = process.env.GITHUB_USER ?? ''
    let query: string = `is:merged state:closed author:${name} type:pr`
    let first: number = Number.parseInt(process.env.RECORD_LIMITS ?? '100')
    let after: string | null = null
    let variables: MergedPullRequestRequest = {
      query: query,
      first: first,
      after: after,
    }
    let allMergedPullRequests: MergedPullRequestResponse['search']['edges'] = []

    while (hasNextPage) {
      if (isDebugMode)
        console.log(
          `query: ${query}, first: ${first}, after: ${after}, hasNextPage: ${hasNextPage}`
        )
      const result = await githubClient()
        .query<MergedPullRequestResponse>({
          query: GetMergedPullRequests,
          variables: variables,
        })
        .then(response => response.data)

      allMergedPullRequests = [...allMergedPullRequests, ...result.search.edges]

      hasNextPage = result.search.pageInfo.hasNextPage ?? false
      after = result.search.pageInfo.endCursor ?? null
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

    return allMergedPullRequests.slice(0, prLimits)
  }

  return await getData()
}

export default useGetMergedPullRequests
