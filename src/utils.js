import { createReadStream, writeFile as _writeFile } from 'fs'
import parse from 'csv-parse'
import prompts from 'prompts'

const parser = parse({
  relax_column_count: true
})

// File operations

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

const writeFile = (path, file) =>
  new Promise((resolve, reject) => {
    _writeFile(path, file, err => {
      if (err) reject(err)
      resolve(console.log('The file was saved!'))
    })
  })

const buildFile = arr => {
  // Format the output file
  const formatted = arr.map(cell => `${cell.coords}\n`)

  formatted.sort((a, b) => {
    const parse = val => BigInt(val.replace(',', ''))

    if (parse(a) < parse(b)) return -1

    return 1
  })

  formatted.push('end')

  return formatted.join('')
}

// Handle user prompts

const sendPrompt = (message, type = 'confirm', name = 'value') =>
  prompts({
    message,
    name,
    type
  })

// Misc

const unique = data => [...new Set(data)]

export { importFile, buildFile, writeFile, sendPrompt, unique }
