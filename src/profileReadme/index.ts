import useGetProfileReadme from '../dataService/getProfileReadmeDataService'

import dotenv from 'dotenv'

dotenv.config()

export async function getProfileReadme() {
  const profileReadme: string[] = (await useGetProfileReadme()) ?? []

  return profileReadme
}
