import { getHeatmapData } from './commitHeatMap'
import { getWordCloudData } from './wordCloud'
import { getRepoCommitsList } from './repositoryCommitList'
import { getRepositoryList } from './repositoryList'
import { vegaCommitHeatmap } from './commitHeatMap/util/vegaCommitHeatMap'
import { vegaWordCloud } from './wordCloud/util/vegaWordCloud'
import { generateAnimatedGif } from './animateImages'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const enableWordCloud = process.env.GENERATE_WORD_CLOUD == 'true'
const enableCommitHeatmap = process.env.GENERATE_COMMIT_HEATMAP == 'true'

//Get list of Repos
const listOfRepos = await getRepositoryList()
console.log('Get list of Repos - Complete')

if (isDebugMode)
  listOfRepos.map(v => console.log('listOfRepos:', v.toLowerCase()))

//Get all commits per Repos
const listOfRepoCommits = await getRepoCommitsList(listOfRepos)
console.log('Get all commits per Repos - Complete')

if (enableWordCloud) {
  // Get Word Cloud Data
  const wordCloudWords = getWordCloudData(listOfRepoCommits)

  // Create Word Cloud Image
  await vegaWordCloud(wordCloudWords)
  console.log('Create Word Cloud - Complete')
}

if (enableCommitHeatmap) {
  // Get Commit Heatmap Data
  const heatMapDict = getHeatmapData(listOfRepoCommits)

  // Create Commit Heatmap Image
  await vegaCommitHeatmap(heatMapDict)
  console.log('Create Commit Heatmap - Complete')
}

// Create Animated Image
await generateAnimatedGif()
console.log('Create Animated Image - Complete')

// Clean up temp directory
fs.rmSync('DataVisuals/temp', { recursive: true, force: true })
