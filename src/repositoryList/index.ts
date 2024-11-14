import { useGetRepos } from '../dataService/getRepositoryDataService'
import type { Repository } from '../dataService/getRepositoryDataService/request'

export async function getRepositoryList() {
  const repository: Repository[] = (await useGetRepos()) ?? []
  const exludedRepository: string[] =
    process.env.EXCLUDED_REPOS?.toLowerCase().split(',') ?? []
  const filteredRepository = repository
    .map(v => v.name)
    .filter(v => exludedRepository.indexOf(v) < 0)

  return filteredRepository
}
