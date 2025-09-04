import { nativeImage } from "electron"
import { createCanvas } from '@napi-rs/canvas'

export function createTrayImage(text: string = "ZS") {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext("2d")

  canvas.width = 16
  canvas.height = 16

  ctx.font = "bold 14px monospace"
  ctx.fillStyle = "#6464ff"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const metrics = ctx.measureText(text)
  const textWidth = metrics.width

  canvas.width = textWidth > 17 ? textWidth : canvas.width

  ctx.font = "bold 14px Arial"
  ctx.fillStyle = "#6464ff"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const dataUrl = canvas.toDataURL("image/png")
  const icon = nativeImage.createFromDataURL(dataUrl)

  return icon
}
