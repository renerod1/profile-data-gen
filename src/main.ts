import { getHeatmapData } from './commitHeatMap'
import { getWordCloudData } from './wordCloud'
import { getRepoCommitsList } from './repositoryCommitList'
import { getDefaultBranchRef, getRepositoryList } from './repositoryList'
import { vegaCommitHeatmap } from './commitHeatMap/util/vegaCommitHeatMap'
import { vegaWordCloud } from './wordCloud/util/vegaWordCloud'
import { generateAnimatedGif } from './animateImages'
import { getProfileReadme } from './profileReadme'
import { getMergedPullRequests } from './mergedPullRequest'
import { getRecentCommits } from './recentCommits'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const enableWordCloud = process.env.GENERATE_WORD_CLOUD == 'true'
const enableCommitHeatmap = process.env.GENERATE_COMMIT_HEATMAP == 'true'
const showRecentCommits = process.env.SHOW_RECENT_COMMITS == 'true'
const generateMergedPrs = process.env.GENERATE_MERGED_PRS == 'true'
const owner: string = process.env.GITHUB_OWNER ?? ''
const user: string = process.env.GITHUB_USER ?? ''
const runId = process.env.GITHUB_RUN_ID
const timestamp = dayjs().format('YYYY-MM-DD')

//Get list of Repos
const listOfRepos = await getRepositoryList()
console.log('Get list of Repos - Complete')

if (isDebugMode)
  listOfRepos.map(v => console.log('listOfRepos:', v.toLowerCase()))

if (isDebugMode)
  listOfRepos.map(async v =>
    console.log(
      'owner:',
      owner,
      'repo:',
      v.toLowerCase(),
      'branch:',
      await getDefaultBranchRef(owner, v.toLowerCase())
    )
  )

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

let recent_commit_section = ''
if (showRecentCommits) {
  // Get Recent Commits
  const rcs = await getRecentCommits(listOfRepoCommits)
  recent_commit_section = '\n## 🚀 Recent Commits\n' + rcs.join('')
  console.log('Create Recent Commits - Complete')
}

let recent_prs_section = ''
if (generateMergedPrs) {
  // Get Merged PR Data
  const prs = await getMergedPullRequests()
  recent_prs_section = '\n## 🔀 Recently Merged Pull Requests\n' + prs.join('')
  console.log('Create Merged PR - Complete')
}

// Clean up datavisuals temp directory
fs.rmSync('DataVisuals/temp', { recursive: true, force: true })

// Get Base Readme
const readme = await getProfileReadme()
console.log('Get Current Profile Readme - Complete')

readme.push('---\n\n')

// Add metrics
readme.push(
  `### Data last generated on: ${timestamp} via [GitHub Action ${runId}](https://github.com/${owner}/${user}/actions/runs/${runId})\n\n`
)
readme.push(recent_commit_section)
readme.push(recent_prs_section)
readme.push('\n![](DataVisuals/data.gif)\n\n')

fs.mkdirSync('Profile', { recursive: true })
fs.writeFileSync('Profile/README.md', readme.join(''))

console.log('Create Profile Readme - Complete')
