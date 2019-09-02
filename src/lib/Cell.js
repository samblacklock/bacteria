class Cell {
  constructor(coords) {
    const [x, y] = coords.split(',')
    this.x = parseInt(x)
    this.y = parseInt(y)
  }

  get coords() {
    return `${this.x},${this.y}`
  }

  potentialNeighbours() {
    const { x, y } = this

    const buildColumn = x => {
      return [`${x},${y - 1}`, `${x},${y}`, `${x},${y + 1}`]
    }

    return [
      ...buildColumn(x - 1),
      ...buildColumn(x),
      ...buildColumn(x + 1)
    ].filter(el => el !== this.coords)
  }
}

export default Cell
