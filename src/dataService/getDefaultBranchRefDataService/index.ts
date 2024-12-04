import { githubClient } from '../../client'
import {
  type GetDefaultBranchRefsQueryVariables,
  type GetDefaultBranchRefsQuery,
  GetDefaultBranchRefs,
} from '../../types'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetDefaultBranchRefs = async (
  owner: string,
  repo: string
): Promise<string> => {
  async function getData(): Promise<string> {
    let variables: GetDefaultBranchRefsQueryVariables = {
      owner: owner,
      repo: repo,
    }
    let defaultBranch: string = ''

    if (isDebugMode) console.log(`owner: ${owner}, repo: ${repo}`)
    const result = await githubClient()
      .query<GetDefaultBranchRefsQuery>({
        query: GetDefaultBranchRefs,
        variables: variables,
      })
      .then(response => response.data)

    defaultBranch = result.repository?.defaultBranchRef?.name ?? ''

    if (isDebugMode) console.log('defaultBranch', defaultBranch)

    return defaultBranch
  }

  return await getData()
}

export default useGetDefaultBranchRefs
