import { createReadStream, writeFile as _writeFile } from 'fs'
import parse from 'csv-parse'
import prompts from 'prompts'

const parser = parse({
  relax_column_count: true
})

// File operations

const importFile = filename => createReadStream(filename).pipe(parser)

const writeFile = (path, file) =>
  _writeFile(path, file, err => {
    if (err) console.error(err)

    console.log('The file was saved!')
  })

const buildFile = arr => {
  const formatted = arr.map(cell => `${cell.coords}\n`)

  formatted.sort((a, b) => {
    const parse = val => BigInt(val.replace(',', ''))

    const valA = parse(a)
    const valB = parse(b)

    if (valA < valB) return -1

    return 1
  })

  formatted.push('end')

  return formatted.join('')
}

// Handle user prompts

const sendPrompt = (message, type = 'confirm', name = 'value', rest = []) =>
  prompts({
    message,
    name,
    type,
    ...rest
  })

export { importFile, buildFile, writeFile, sendPrompt }
