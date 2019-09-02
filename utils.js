const fs = require('fs')
const parse = require('csv-parse')
const prompts = require('prompts')

const parser = parse({
  relax_column_count: true
})

const importFile = filename => fs.createReadStream(filename).pipe(parser)

const writeFile = (path, file) =>
  fs.writeFile(path, file, err => {
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

module.exports = { importFile, writeFile, sendPrompt }
