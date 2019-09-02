import Cell from './Cell'
import { unique } from '../utils'

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

class Grid {
  constructor(data) {
    this.data = data.map(cell => new Cell(cell))
  }

  get values() {
    // Return an array of the coordinates of all bacteria currently on the grid, as strings
    return this.data.map(el => el.coords)
  }

  // Helper func to iterate over dataset and determine fate of a cell
  calculateCellFate(dataSet, currentlyDead) {
    dataSet.forEach(cell => {
      // Calculate neighbouring cells to each cell and applies appropriate rules
      const actualNeighbours = cell
        .potentialNeighbours()
        .filter(el => this.values.includes(el))

      const lives = applyRules(actualNeighbours, currentlyDead)

      if (lives) this.nextGeneration.push(cell)
    })
  }

  performGeneration() {
    // Start with empty array to represent the next generation
    this.nextGeneration = []

    // Decide which cells live on:
    // Get the actual neighbours of all current bacteria and decide their fate
    this.calculateCellFate(this.data)

    // Decide which cells come to life:
    // Build an array of all cells that could potentially come live (and dedupe)
    const allPotentialNeighbours = unique(
      this.data
        .map(cell => {
          return cell.potentialNeighbours()
        })
        .flat()
    ).map(el => new Cell(el))

    // Apply rules to all potential cells to determine fate
    this.calculateCellFate(allPotentialNeighbours, true)

    return this.nextGeneration
  }
}

export default Grid
