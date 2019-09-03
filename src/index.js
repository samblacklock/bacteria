import { createInterface } from 'readline'
import { formatOutput, sendPrompt, unique } from './utils'
import Grid from './lib/Grid'

/**
 * Handle initial user input
 */
const getInput = () => {
  const input = []

  const rl = createInterface({
    input: process.stdin
  })

  rl.on('line', line => {
    input.push(line)
    if (line === 'end') rl.close()
  })

  rl.on('close', () => {
    processInput(input)
  })
}

/**
 * Perform transform on inputted values
 * @param {string[]} input - provided input
 */
const processInput = async input => {
  const grid = new Grid(unique(input))
  const nextGeneration = grid.performGeneration()
  const file = formatOutput(nextGeneration)

  process.stdout.write(`\n${file}\n`)

  const { repeat } = await sendPrompt('Repeat?', 'confirm', 'repeat')

  if (repeat) {
    processInput(nextGeneration.map(el => el.coords))
  } else {
    process.exit(0)
  }
}

/**
 * Main entry point to program - handle file import and generation
 */

getInput()
