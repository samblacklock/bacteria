import Cell from './Cell'
import { unique } from '../utils'

/**
 * Apply live or die rules to a set of cells and return a boolean
 * that represents whether the cell will live in the next generation,
 * determined by its number of neighbours
 *
 * @param {Array} neighbours - neighbours of a given cell
 * @param {boolean} currentlyDead - is the cell currently dead
 * @return {boolean}
 */
const applyRules = (neighbours, currentlyDead) => {
  const length = neighbours.length

  if (currentlyDead) {
    if (length === 3) return true
    return false
  }

  if (length < 2 || length > 3) return false
  if (length === 2 || length === 3) return true
}

/**
 * Class to track the locations of all cells and generate new 'generations'
 */
class Grid {
  constructor(data) {
    this.data = data.map(cell => new Cell(cell))
  }

  /**
   * Return an array of the coordinates of all bacteria currently on the grid, as strings
   * @return {string[]}
   */
  get values() {
    return this.data.map(el => el.coords)
  }

  /**
   * Helper func to iterate over dataset and determine fate of a cell.
   * Calculates neighbouring cells to each cell and applies appropriate rules
   * @param {Cell[]} dataSet - array of cells to iterate over
   * @param {boolean} currentlyDead - is the cell not currently alive
   */
  calculateCellFate(dataSet, currentlyDead) {
    dataSet.forEach(cell => {
      const actualNeighbours = cell
        .potentialNeighbours()
        .filter(el => this.values.includes(el))

      const lives = applyRules(actualNeighbours, currentlyDead)

      if (lives) this.nextGeneration.push(cell)
    })
  }

  /**
   * Generate a new 'generation' by calculating the fate of each current cell,
   * and determining the fate of every potential cell
   *
   * @return {Cell[]}
   */
  performGeneration() {
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

    this.calculateCellFate(allPotentialNeighbours, true)

    return this.nextGeneration
  }
}

export default Grid
