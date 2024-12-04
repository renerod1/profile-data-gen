import { useGetDefaultBranchRefs } from '../dataService/getDefaultBranchRefDataService'
import { useGetRepos } from '../dataService/getRepositoryDataService'
import type { Repository } from '../dataService/getRepositoryDataService/request'

import dotenv from 'dotenv'

dotenv.config()
const includeProfileRepo = process.env.INCLUDE_PROFILE_REPO == 'true'
const profileRepo = process.env.GITHUB_USER ?? ''

export async function getRepositoryList() {
  const repository: Repository[] = (await useGetRepos()) ?? []
  const exludedRepository: string[] =
    process.env.EXCLUDED_REPOS?.toLowerCase().split(',') ?? []

  if (!includeProfileRepo) exludedRepository.push(profileRepo.toLowerCase())

  const filteredRepository = repository
    .map(v => v.name.toLowerCase())
    .filter(v => exludedRepository.indexOf(v) < 0)

  return filteredRepository
}

export async function getDefaultBranchRef(owner: string, repo: string) {
  const defaultBranchRef =
    (await useGetDefaultBranchRefs(owner, repo)) ?? 'main'
  return defaultBranchRef
}
