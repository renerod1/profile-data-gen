import { githubClient } from '../../client'
import {
  type GetProfileReadmeQueryVariables,
  type GetProfileReadmeQuery,
  GetProfileReadme,
} from '../../types'
import type { Blob } from './request'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

export const useGetProfileReadme = async () => {
  async function getData() {
    let owner: string = process.env.OWNER ?? ''
    let name: string = process.env.USER ?? ''
    let variables: GetProfileReadmeQueryVariables = {
      owner: owner,
      name: name,
    }
    let readme: string[] = []

    if (isDebugMode) console.log(`owner: ${owner}, name: ${name}`)
    const result = await githubClient()
      .query<GetProfileReadmeQuery>({
        query: GetProfileReadme,
        variables: variables,
      })
      .then(response => response.data)

    const readmeText = (result.repository?.object as Blob).text

    if (isDebugMode) console.log('readmeText:\n', readmeText)

    if (isDebugMode) console.log('readme:\n', readme)

    readme.push(readmeText?.split('---')[0] ?? '')

    if (isDebugMode) console.log('readme', readme)

    return readme
  }

  async function getProfileReadme() {
    return await getData()
  }

  return getProfileReadme().catch(e => console.error(e))
}

export default useGetProfileReadme
