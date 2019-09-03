import prompts from 'prompts'

/**
 * Transform new generation into correct format for output
 * @param {Cell[]} arr - array of cells
 */
const formatOutput = arr => {
  const formatted = arr.map(cell => `${cell.coords}\n`)

  formatted.sort((a, b) => {
    const parse = val => BigInt(val.replace(',', ''))

    if (parse(a) < parse(b)) return -1

    return 1
  })

  formatted.push('end')

  return unique(formatted).join('')
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

export { formatOutput, sendPrompt, unique }
