import type { Commit } from '../dataService/getRepositoryCommitDataService/request'
import dotenv from 'dotenv'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export function getWordCloudData(listOfRepoCommits: Commit[]) {
  const listOfRepoCommitsFlat = listOfRepoCommits.flat()

  if (isDebugMode)
    console.log('listOfRepoCommitsFlat:', JSON.stringify(listOfRepoCommitsFlat))
  const commitMessages = listOfRepoCommitsFlat.map(v => v.message)

  if (isDebugMode) console.log('\ncommitMessages:', commitMessages)
  const wordCloudWords = JSON.stringify(commitMessages)
    .replaceAll('"', '')
    .replaceAll("'", '')
    .replaceAll('`', '')
    .replaceAll(',', ' ')

  if (isDebugMode) console.log('\nwordCloudWords:', wordCloudWords)

  return wordCloudWords
}
