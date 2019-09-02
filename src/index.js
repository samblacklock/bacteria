import { importFile, buildFile, writeFile, sendPrompt } from './utils'
import Grid from './lib/Grid'

// Main entry point
;(async () => {
  const { filename } = await sendPrompt(
    'Enter filename of input data',
    'text',
    'filename'
  )

  try {
    const data = await importFile(filename)
    const grid = new Grid(data)

    const { value } = await sendPrompt('CSV imported. Perform one generation?')

    if (value) {
      const nextGeneration = grid.performGeneration()
      if (nextGeneration) complete(nextGeneration)
    }
  } catch ({ path }) {
    console.error(`Could not import '${path}'`)
  }
})()

const complete = async nextGeneration => {
  const file = buildFile(nextGeneration)
  const { value } = await sendPrompt(
    `Complete! The output is:\n\n${file}\n\nWrite this to a file?`
  )

  if (value) {
    const { path } = await sendPrompt('Enter filename', 'text', 'path')

    try {
      writeFile(path, file)
    } catch {
      console.error('There was a problem saving the file')
    }
  }
}
