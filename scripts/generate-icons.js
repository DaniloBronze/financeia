import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

const sizes = [192, 512]

if (!existsSync('public')) {
  mkdirSync('public')
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fundo indigo
  ctx.fillStyle = '#4f46e5'
  // ctx.roundRect doesn't exist in old canvas versions, using simple rect
  ctx.fillRect(0, 0, size, size)

  // Emoji no centro
  ctx.font = `${size * 0.5}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('💰', size / 2, size / 2)

  writeFileSync(`public/pwa-${size}x${size}.png`, canvas.toBuffer('image/png'))
  console.log(`✅ pwa-${size}x${size}.png criado`)
})
