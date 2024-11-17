import type { Commit } from '../dataService/getRepositoryCommitDataService/request'
import type { HeatMapDict } from './util/vegaCommitHeatMap'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dotenv from 'dotenv'

dotenv.config()
dayjs.extend(utc)
dayjs.extend(timezone)
const isDebugMode = process.env.DEBUG_MODE == 'true'
const timeZone = process.env.TIMEZONE ?? 'America/Danmarkshavn' //GMT is used when missing

export function getHeatmapData(listOfRepoCommits: Commit[]) {
  const listOfRepoCommitsFlat = listOfRepoCommits.flat()
  const recentCommitDates = listOfRepoCommitsFlat.map(
    v =>
      `\"${dayjs.utc(v.committedDate).tz(timeZone).format('dddd')}\",${dayjs.utc(v.committedDate).tz(timeZone).format('h')},1`
  )

  if (isDebugMode) console.log('\rrecentCommitDates:', recentCommitDates)
  if (isDebugMode) console.log('\rtimeZone:', timeZone)

  //Pre-populating Dictionary in preferred sort order
  const heatMapDict: HeatMapDict = {}
  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  const hourOrder = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ]

  dayOrder.forEach(day => {
    if (!heatMapDict[day]) {
      heatMapDict[day] = {}
    }
    hourOrder.forEach(hour => {
      if (!heatMapDict[day][hour]) {
        heatMapDict[day][hour] = 0
      }
    })
  })

  for (let index = 0; index < listOfRepoCommitsFlat.length; index++) {
    const dayOfWeek = dayjs(listOfRepoCommitsFlat[index].committedDate)
      .tz(timeZone)
      .format('dddd')
    const hourOfDay = dayjs(listOfRepoCommitsFlat[index].committedDate)
      .tz(timeZone)
      .format('h')

    if (!heatMapDict[dayOfWeek]) {
      heatMapDict[dayOfWeek] = {}
    }

    if (!heatMapDict[dayOfWeek][hourOfDay]) {
      heatMapDict[dayOfWeek][hourOfDay] = 0
    }

    heatMapDict[dayOfWeek][hourOfDay]++
  }
  return heatMapDict
}
