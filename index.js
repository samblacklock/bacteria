const fs = require('fs')
const parse = require('csv-parse')
const prompts = require('prompts')

const Cell = require('./Cell')

const parser = parse({
  relax_column_count: true
})

const importFile = filename => fs.createReadStream(filename).pipe(parser)
const sendPrompt = (message, type = 'confirm', name = 'value', rest = []) =>
  prompts({
    message,
    name,
    type,
    ...rest
  })

const calculateFate = (neighbours, currentlyDead) => {
  const length = neighbours.length

  if (currentlyDead) {
    if (length === 3) return true
    return false
  }

  if (length < 2 || length > 3) return false
  if (length === 2 || length === 3) return true
}

const performGeneration = grid => {
  const nextGeneration = []

  // First, decide which cells live on
  const fullGrid = grid.map(el => el.coords)

  grid.forEach(cell => {
    const actualNeighbours = cell
      .potentialNeighbours()
      .filter(el => fullGrid.includes(el))

    const lives = calculateFate(actualNeighbours)

    if (lives) nextGeneration.push(cell)
  })

  // Next, decide which cells come to life
  const allPotentialNeighbors = [].concat(
    ...grid.map(cell => cell.potentialNeighbours())
  )
  const allUniquePotentialNeighbours = [...new Set(allPotentialNeighbors)].map(
    el => new Cell(el)
  )

  allUniquePotentialNeighbours.forEach(cell => {
    const actualNeighbours = cell
      .potentialNeighbours()
      .filter(el => fullGrid.includes(el))

    const lives = calculateFate(actualNeighbours, true)

    if (lives) nextGeneration.push(cell)
  })

  return nextGeneration
}

const formatString = arr => {
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

const wrapUp = async nextGeneration => {
  const file = formatString(nextGeneration)
  const { value } = await sendPrompt(
    `Complete! The output is:\n\n${file}\n\nWrite this to a file?`
  )

  if (value) {
    const { path } = await sendPrompt('Enter filename', 'text', 'path')

    fs.writeFile(path, file, function(err) {
      if (err) {
        return console.error(err)
      }

      console.log('The file was saved!')
    })
  }
}

;(async () => {
  const grid = []
  const { filename } = await sendPrompt(
    'Enter filename of input data',
    'text',
    'filename'
  )

  importFile(filename)
    .on('data', row => {
      // Ignore "end" statement
      if (row[0] === 'end') return
      grid.push(new Cell(row.toString()))
    })
    .on('end', async () => {
      const { value } = await sendPrompt(
        'CSV imported. Perform one generation?'
      )

      if (value) {
        const nextGeneration = performGeneration(grid)
        if (nextGeneration) wrapUp(nextGeneration)
      }
    })
})()
