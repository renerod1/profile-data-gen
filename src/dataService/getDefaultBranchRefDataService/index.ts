import { githubClient } from '../../client'
import { GetDefaultBranchRefs } from '../../types'
import type { DefaultBranchRefsRequest } from './request'
import type { DefaultBranchRefsResponse } from './response'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetDefaultBranchRefs = async (
  owner: string,
  repo: string
): Promise<string> => {
  async function getData(): Promise<string> {
    let variables: DefaultBranchRefsRequest = {
      owner: owner,
      repo: repo,
    }
    let defaultBranch: string = ''

    if (isDebugMode) console.log(`owner: ${owner}, repo: ${repo}`)
    const result = await githubClient()
      .query<DefaultBranchRefsResponse>({
        query: GetDefaultBranchRefs,
        variables: variables,
      })
      .then(response => response.data)

    defaultBranch = result.repository.defaultBranchRef.name ?? ''

    if (isDebugMode) console.log('defaultBranch', defaultBranch)

    return defaultBranch
  }

  return await getData()
}

export default useGetDefaultBranchRefs
