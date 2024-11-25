import type { Commit } from '../dataService/getRepositoryCommitDataService/request'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const commitLimits = Number.parseInt(process.env.COMMIT_LIMITS ?? '3')

export async function getRecentCommits(listOfRepoCommits: Commit[]) {
  const sortedCommitsDesc = listOfRepoCommits.sort((a, b) => {
    return dayjs(b.committedDate) - dayjs(a.committedDate)
  })
  // if (isDebugMode) console.log('sortedCommitsDesc', sortedCommitsDesc)
  const commit_info = sortedCommitsDesc.flatMap(
    v =>
      `\n- **${v.repository.name} - [${v.message.replaceAll('[\n\r]', ' ')}](${v.commitUrl})**\n   - Additions: ${v.additions} - Deletions: ${v.deletions} - Total Changes: ${v.additions + v.deletions}\n`
  )

  // if (isDebugMode) console.log('commit_info', commit_info)
  if (isDebugMode)
    console.log('commit_info', commit_info.splice(0, commitLimits))
  return commit_info.splice(0, commitLimits)
}
