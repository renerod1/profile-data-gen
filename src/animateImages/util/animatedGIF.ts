import { createCanvas, loadImage } from 'canvas'
import GIFEncoder from 'gifencoder'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const isDebugMode = process.env.DEBUG_MODE == 'true'
const frameDuration = Number.parseInt(process.env.GIF_FRAME_DURATION ?? '10000')
const width = Number.parseInt(process.env.IMAGE_WIDTH ?? '1200')
const height = Number.parseInt(process.env.IMAGE_HEIGHT ?? '800')

export async function animatedGIF(inputImages: string[], outputImage: string) {
  const encoder = new GIFEncoder(width, height)
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  const stream = encoder.createWriteStream({
    repeat: 0,
    delay: frameDuration,
    quality: 10,
  })
  stream.pipe(fs.createWriteStream(outputImage))

  encoder.start()
  encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
  encoder.setDelay(frameDuration) // frame delay in ms
  encoder.setQuality(10) // image quality (1 - 30)

  for (const image of inputImages) {
    const data = await loadImage(image)
    context.clearRect(0, 0, width, height)
    context.drawImage(data, 0, 0, width, height)
    encoder.addFrame(context)
  }

  encoder.finish()
}
