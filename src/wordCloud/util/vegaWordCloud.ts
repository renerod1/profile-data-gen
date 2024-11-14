import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'

const execAsync = promisify(exec)

export async function vegaWordCloud(words: string): Promise<void> {
  const width = 1200
  const height = 800
  const stopwords = process.env.IGNORED_WORDS?.replaceAll(',', '|') ?? ''

  const vgJSON = `
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "Commit Messages Word Cloud",
  "width": ${width},
  "height": ${height},
  "padding": 0,
  "background": "#22272e",

  "title": {
    "text": "Commit Messages Word Cloud",
    "encode": {
      "title": {
        "enter": {
          "fill": {"value": "white"},
          "fontSize": {"value": 14}
        }
      }
    }
  },
  
  "data": [
    {
      "name": "table",
      "values": [
        "${words}"
      ],
      "transform": [
        {
          "type": "countpattern",
          "field": "data",
          "case": "lower",
          "pattern": "[\\\\w']{3,}",
          "stopwords": "(${stopwords})"
        },
        {
          "type": "formula", "as": "angle",
          "expr": "[-90, -45, 0, 45, 90][~~(random() * 5)]"
        },
        {
          "type": "formula", "as": "weight",
          "expr": "if(datum.text.length > 6, ${width * 0.75}, ${height * 0.75})"
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "table", "field": "text"},
      "range": ["#f8d7da","#d4edda","#d1ecf1","#fff3cd","#f8d7da","#e2e0eb"]
    }
  ],

  "marks": [
    {
      "type": "text",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "text": {"field": "text"},
          "align": {"value": "center"},
          "baseline": {"value": "alphabetic"},
          "fill": {"scale": "color", "field": "text"}
        },
        "update": {
          "fillOpacity": {"value": 1}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      },
      "transform": [
        {
          "type": "wordcloud",
          "size": [${width}, ${height}],
          "text": {"field": "text"},
          "rotate": {"field": "datum.angle"},
          "font": "Impact, Helvetica Neue, Arial",
          "fontSize": {"field": "datum.count"},
          "fontWeight": {"field": "datum.weight"},
          "fontSizeRange": [12, 56],
          "padding": 2
        }
      ]
    }
  ]
}

`

  fs.mkdirSync('DataVisuals/temp', { recursive: true })
  fs.writeFileSync('DataVisuals/temp/word-cloud.vg.json', vgJSON)

  const output = await execAsync(
    `vg2png DataVisuals/temp/word-cloud.vg.json DataVisuals/wordcloud.png`
  )

  if (isDebugMode) console.log('output:', output)
}
