import useGetMergedPullRequests from '../dataService/getMergedPullRequestDataService'
import type { SearchResultItemEdge } from '../dataService/getMergedPullRequestDataService/request'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export async function getMergedPullRequests() {
  const mergedPullRequest: SearchResultItemEdge[] =
    (await useGetMergedPullRequests()) ?? []

  const pr_info = mergedPullRequest.flatMap(
    v =>
      `\n- **[${v.node?.title}](${v.node?.url})**\n   - Repository: [${v.node?.repository.name}](${v.node?.repository.url})\n   - Stars: ${v.node?.repository.stargazerCount}\n`
  )

  if (isDebugMode) console.log('pr_info', pr_info)
  return pr_info
}
