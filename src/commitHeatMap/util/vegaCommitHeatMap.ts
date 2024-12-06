import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

const execAsync = promisify(exec)

export interface HeatMapDict {
  [dayOfWeek: string]: {
    [hourOfDay: string]: number
  }
}

export async function vegaCommitHeatmap(
  heatMapDict: HeatMapDict
): Promise<void> {
  const width = Number.parseInt(process.env.IMAGE_WIDTH ?? '1200')
  const height = Number.parseInt(process.env.IMAGE_HEIGHT ?? '800')

  if (isDebugMode) console.log('\rheatMapDict:', heatMapDict)

  const csvDayHourCountOutput = createDayHourCountCSV(heatMapDict)
  if (isDebugMode)
    console.log('\rcsvDayHourCountOutput:', csvDayHourCountOutput)

  fs.mkdirSync('DataVisuals/temp', { recursive: true })
  fs.writeFileSync('DataVisuals/temp/commit-heatmap.csv', csvDayHourCountOutput)

  const vgJSON = `
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Heatmap of Commit Frequency by Hour of Day and Day of Week",
  "width": ${width},
  "height": ${height},
  "padding": 0,
  "background": "#22272e",

  "title": {
    "text": "Heatmap of Commit Frequency by Hour of Day and Day of Week",
    "encode": {
      "title": {
        "enter": {
          "fill": {"value": "white"},
          "fontSize": {"value": 24}
        }
      }
    }
  },  

  "signals": [
    {
      "name": "palette", "value": "Turbo",
      "bind": {
        "input": "select",
        "options": [
          "Turbo",
          "Viridis",
          "Magma",
          "Inferno",
          "Plasma",
          "Cividis",
          "DarkBlue",
          "DarkGold",
          "DarkGreen",
          "DarkMulti",
          "DarkRed",
          "LightGreyRed",
          "LightGreyTeal",
          "LightMulti",
          "LightOrange",
          "LightTealBlue",
          "Blues",
          "Browns",
          "Greens",
          "Greys",
          "Oranges",
          "Purples",
          "Reds",
          "TealBlues",
          "Teals",
          "WarmGreys",
          "BlueOrange",
          "BrownBlueGreen",
          "PurpleGreen",
          "PinkYellowGreen",
          "PurpleOrange",
          "RedBlue",
          "RedGrey",
          "RedYellowBlue",
          "RedYellowGreen",
          "BlueGreen",
          "BluePurple",
          "GoldGreen",
          "GoldOrange",
          "GoldRed",
          "GreenBlue",
          "OrangeRed",
          "PurpleBlueGreen",
          "PurpleBlue",
          "PurpleRed",
          "RedPurple",
          "YellowGreenBlue",
          "YellowGreen",
          "YellowOrangeBrown",
          "YellowOrangeRed"
        ]
      }
    },
    {
      "name": "reverse", "value": false, "bind": {"input": "checkbox"}
    }
  ],

  "data": [
    {
      "name": "table",
      "url": "commit-heatmap.csv",
      "format": {"type": "csv"}
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "hour_ampm"},
      "range": "width"
    },
    {
      "name": "yscale",
      "type": "band",
      "domain": {"data": "table", "field": "day"},
      "range": "height"
    },
    {
      "name": "color",
      "type": "linear",
      "domain": {"data": "table", "field": "count"},
      "range": {"scheme": {"signal": "palette"}}
    }
  ],

  "axes": [
    {
      "orient": "bottom",
      "scale": "xscale",
      "title": "Hour of Day",
	  "titleColor": "white",
      "titleFontSize": 24,
      "labelAngle": 0,
	  "labelColor": "white",
      "labelFontSize": 24
    },
    {
      "orient": "left",
      "scale": "yscale",
      "title": "Day of Week",
	  "titleColor": "white",
      "titleFontSize": 24,
	  "labelColor": "white",
      "labelFontSize": 24
    }
  ],

  "legends": [
    {
      "fill": "color",
      "type": "gradient",
      "title": "Commit Counts",
	  "titleColor": "white",
      "titleFontSize": 18,
      "titlePadding": 4,
	  "labelColor": "white",
      "labelFontSize": 18,
      "gradientLength": {"signal": "height - 16"}
    }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "hour_ampm"},
          "y": {"scale": "yscale", "field": "day"},
          "width": {"scale": "xscale", "band": 1},
          "height": {"scale": "yscale", "band": 1}
        },
        "update": {
          "fill": {"scale": "color", "field": "count"},
          "tooltip": {"signal": "datum.day + ' ' + datum.hour_ampm + ': ' + datum.count"}
        }
      }
    }
  ]
}

`

  fs.mkdirSync('DataVisuals/temp', { recursive: true })
  fs.writeFileSync('DataVisuals/temp/commit-heatmap.vg.json', vgJSON)

  const output = await execAsync(
    `vg2png DataVisuals/temp/commit-heatmap.vg.json DataVisuals/commit_heatmap.png`
  )

  if (isDebugMode) console.log('output:', output)
}

function createDayHourCountCSV(heatMapDict: HeatMapDict) {
  const csvRows = [`"day","hour","hour_ampm","count"`]

  for (const day in heatMapDict) {
    if (heatMapDict.hasOwnProperty(day)) {
      for (let hour = 0; hour < 24; hour++) {
        const count = heatMapDict[day][hour.toString()] ?? 0
        csvRows.push(
          `"${day}","${hour}","${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}",${count}`
        )
      }
    }
  }

  return csvRows.join('\n')
}
