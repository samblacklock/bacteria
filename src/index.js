import { importFile, buildFile, writeFile, sendPrompt } from './utils'
import Grid from './lib/Grid'

/**
 * Main entry point to program - handle file import and generation
 */
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

/**
 * Handle outputting new generation as .csv. Write to stdout and optionally to file
 * @param {Cell[]} nextGeneration - the next generation
 */
const complete = async nextGeneration => {
  const file = buildFile(nextGeneration)

  process.stdout.write(file)

  const { rerun } = await sendPrompt(
    `Rerun with this dataset?`,
    'confirm',
    'rerun'
  )

  if (rerun) {
  } else {
    const { write } = await sendPrompt(
      `Write output to a file?`,
      'confirm',
      'write'
    )

    if (write) {
      const { path } = await sendPrompt('Enter filename', 'text', 'path')

      try {
        writeFile(path, file)
      } catch {
        console.error('There was a problem saving the file')
      }
    }
  }
}
