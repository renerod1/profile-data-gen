import { animatedGIF } from './util/animatedGIF'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const frameOrder = process.env.GIF_FRAME_ORDER ?? ''

export async function generateAnimatedGif() {
  const images = frameOrder.split(',').map(v => 'DataVisuals/' + v)
  if (isDebugMode) console.log('images:', images)

  let inputImages: string[] = []
  const outputImage = 'DataVisuals/' + 'data.gif'

  for (const image of images) {
    if (!fs.existsSync(image)) {
      continue
    }
    console.log('image:', image)
    inputImages.push(image)
  }

  console.log('inputImages:', inputImages)
  console.log('outputImage:', outputImage)

  await animatedGIF(inputImages, outputImage)

  return
}
