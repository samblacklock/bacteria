// Class to represent an individual bacterium

class Bacterium {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get status() {
    return this.status;
  }

  get row() {
    return this.y;
  }

  get column() {
    return this.x;
  }

  get fate() {
    return this._fate;
  }

  set fate(fate) {
    this._fate = fate;
  }

  // Returns a array of the coordinates of the 8 possible neighbours to this bacterium
  getPotentialNeighbours() {
    const { x, y } = this;
    const row1 = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1]];
    const row2 = [[x - 1, y], [x + 1, y]];
    const row3 = [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]];

    return [...row1, ...row2, ...row3].map(el => el.toString());
  }
}

// console.log(Bacterium._potentialNeighbours());

module.exports = Bacterium;
