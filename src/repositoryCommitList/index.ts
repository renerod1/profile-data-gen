import { useGetRepoCommits } from '../dataService/getRepositoryCommitDataService'
import type { Commit } from '../dataService/getRepositoryCommitDataService/request'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export async function getRepoCommitsList(listOfRepos: string[]) {
  let allCommitData: Commit[] = []

  if (listOfRepos.length > 0) {
    for (let index = 0; index < listOfRepos.length; index++) {
      const commitData: Commit[] = await useGetRepoCommits(
        listOfRepos[index],
        process.env.GITHUB_MAIN_BRANCH ?? 'main'
      )

      if (isDebugMode) console.log('commit_data:', JSON.stringify(commitData))

      allCommitData = [...allCommitData, ...commitData]
    }
  }

  return allCommitData
}
