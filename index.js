import { importFile, buildFile, writeFile, sendPrompt } from './utils'

import Cell from './Cell'

const applyRules = (neighbours, currentlyDead) => {
  // Apply live/die rules
  const length = neighbours.length

  if (currentlyDead) {
    if (length === 3) return true
    return false
  }

  if (length < 2 || length > 3) return false
  if (length === 2 || length === 3) return true
}

const performGeneration = grid => {
  // Start with empty array to represent the next generation
  const nextGeneration = []
  // Get an array of the coordinates of all bacteria currently on the grid
  const fullGrid = grid.map(el => el.coords)

  // Helper func to iterate over dataset and determine fate of a cell
  const calculateFate = (dataSet, currentlyDead) =>
    dataSet.forEach(cell => {
      // Calculate neighbouring cells to each cell and applies appropriate rules
      const actualNeighbours = cell
        .potentialNeighbours()
        .filter(el => fullGrid.includes(el))

      const lives = applyRules(actualNeighbours, currentlyDead)

      if (lives) nextGeneration.push(cell)
    })

  // First, decide which cells live on
  // Get the actual neighbours of all current bacteria and decide their fate
  calculateFate(grid)

  // Next, decide which cells come to life
  // Build an array of all cells that could potentially come live and dedupe
  const allPotentialNeighbours = []
  grid.forEach(cell => {
    allPotentialNeighbours.push(...cell.potentialNeighbours())
  })
  const allUniquePotentialNeighbours = [...new Set(allPotentialNeighbours)].map(
    el => new Cell(el)
  )

  // Apply rules to all potential cells to determine fate
  calculateFate(allUniquePotentialNeighbours, true)

  return nextGeneration
}

const wrapUp = async nextGeneration => {
  const file = buildFile(nextGeneration)
  const { value } = await sendPrompt(
    `Complete! The output is:\n\n${file}\n\nWrite this to a file?`
  )

  if (value) {
    const { path } = await sendPrompt('Enter filename', 'text', 'path')

    writeFile(path, file)
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
