import { createReadStream, writeFile as _writeFile } from 'fs'
import parse from 'csv-parse'
import prompts from 'prompts'

const parser = parse({
  relax_column_count: true
})

const importFile = filename => createReadStream(filename).pipe(parser)

const writeFile = (path, file) =>
  _writeFile(path, file, err => {
    if (err) console.error(err)

    console.log('The file was saved!')
  })

const sendPrompt = (message, type = 'confirm', name = 'value', rest = []) =>
  prompts({
    message,
    name,
    type,
    ...rest
  })

export { importFile, writeFile, sendPrompt }
