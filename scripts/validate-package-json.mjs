import { readFileSync } from 'node:fs'

function getPositionFromMessage(message) {
  const match = message.match(/position\s+(\d+)/i)
  return match ? Number(match[1]) : null
}

function getLineColumn(text, position) {
  const safePos = Math.max(0, Math.min(position, text.length))
  const before = text.slice(0, safePos)
  const lines = before.split('\n')
  const line = lines.length
  const column = lines.at(-1).length + 1
  return { line, column }
}

function getContextSnippet(text, position, radius = 40) {
  const start = Math.max(0, position - radius)
  const end = Math.min(text.length, position + radius)
  return text.slice(start, end)
}

try {
  const raw = readFileSync(new URL('../package.json', import.meta.url), 'utf8')
  JSON.parse(raw)
  console.log('package.json is valid JSON')
} catch (error) {
  console.error('Invalid package.json JSON syntax')
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)

  const position = getPositionFromMessage(message)
  if (position !== null) {
    const raw = readFileSync(new URL('../package.json', import.meta.url), 'utf8')
    const { line, column } = getLineColumn(raw, position)
    const context = getContextSnippet(raw, position)
    console.error(`Approximate location: line ${line}, column ${column}`)
    console.error('Context around error position:')
    console.error(context)
  }

  process.exit(1)
}
