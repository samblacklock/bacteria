const Bacterium = require("./Bacterium");

const calculateNeighbours = (bacterium, plots) => {
  const bacteriumCoordinates = `${bacterium.column},${bacterium.row}`;

  // remove current bacterium from the selection
  const filteredPlots = plots
    .map(el => el.toString())
    .filter(el => el !== bacteriumCoordinates);
  const potentialNeighbours = bacterium.getPotentialNeighbours(plots);

  // find potential neighbours that actually exist
  const actualNeighbours = potentialNeighbours.filter(el =>
    filteredPlots.includes(el)
  );

  return { bacterium, actualNeighbours };
};

const calculateFate = ({ bacterium, actualNeighbours }) => {
  const count = actualNeighbours.length;

  if (count < 2 || count > 3) {
    return "die";
  }

  if (
    (count >= 2 && count <= 3) ||
    (bacterium.status === "dead" && count === 3)
  ) {
    return "live";
  }
};

class Grid extends Array {
  constructor(plots) {
    super();

    this.plots = plots;
    this.buildGrid(plots);
  }

  buildGrid(plots) {
    plots.forEach(([x, y]) => {
      // Create an empty row
      if (!this[y]) this[y] = [];

      const bacterium = new Bacterium(x, y);

      this[y][x] = bacterium;

      bacterium.fate = calculateFate(calculateNeighbours(bacterium, plots));
    });
  }

  // perform/advance one 'generation'
  advance() {}
}

module.exports = Grid;
