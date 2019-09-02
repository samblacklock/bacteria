import { createReadStream, writeFile as _writeFile } from 'fs'
import parse from 'csv-parse'
import prompts from 'prompts'

const parser = parse({
  relax_column_count: true
})

/**
 * Import .csv file and parse to readable format
 * @param {string} filename - filename as string
 */
const importFile = filename =>
  new Promise((resolve, reject) => {
    const data = []
    const stream = createReadStream(filename)
    stream
      .pipe(parser)
      .on('data', row => {
        // Ignore "end" statement
        if (row[0] === 'end') return
        data.push(row.toString())
      })
      .on('end', () => resolve(data))

    stream.on('error', err => reject(err))
  })

/**
 * Write file to a given path
 * @param {string} path - the provided file path
 * @param {string} file - the file data to write
 */
const writeFile = (path, file) =>
  new Promise((resolve, reject) => {
    _writeFile(path, file, err => {
      if (err) reject(err)
      resolve(console.log('The file was saved!'))
    })
  })

/**
 * Transform new generation into format for output file
 * @param {Cell[]} arr - array of cells
 */
const buildFile = arr => {
  const formatted = arr.map(cell => `${cell.coords}\n`)

  formatted.sort((a, b) => {
    const parse = val => BigInt(val.replace(',', ''))

    if (parse(a) < parse(b)) return -1

    return 1
  })

  formatted.push('end')

  return formatted.join('')
}

/**
 * Prompt for user input
 * @param {string} message - message to prompt
 * @param {string} type - type of prompt to show
 * @param {string} name - name of value returned from prompt
 */
const sendPrompt = (message, type = 'confirm', name = 'value') =>
  prompts({
    message,
    name,
    type
  })

// Misc

/**
 * Dedupe an array
 * @param {Array} data - an array to transform
 */
const unique = data => [...new Set(data)]

export { importFile, buildFile, writeFile, sendPrompt, unique }
