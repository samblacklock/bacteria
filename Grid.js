const pull = require("lodash.pull");

const Bacterium = require("./Bacterium");

const calculateNeighbours = (bacterium, plots) => {
  // remove current bacterium from the selection
  const filteredPlots = plots
    .map(el => el.toString())
    .filter(el => el !== bacterium.coords);
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
    return "death";
  }

  if (
    (count >= 2 && count <= 3) ||
    (bacterium.status === "dead" && count === 3)
  ) {
    return "life";
  }
};

class Grid extends Array {
  constructor(plots) {
    super();
    this.buildGrid(plots);
  }

  buildGrid(plots) {
    plots.forEach(([x, y]) => {
      const bacterium = new Bacterium(x, y);
      bacterium.fate = calculateFate(calculateNeighbours(bacterium, plots));
      this.push(bacterium);
    });

    console.log(this);
  }

  // perform/advance one 'generation'
  advance() {
    // Step 1 is to 'grow' anything new
    const neighbours = [];

    this.forEach(bacterium => {
      neighbours.push(...bacterium.getPotentialNeighbours());
    });

    this.forEach(bacterium => {
      pull(neighbours, bacterium.coords);
    });

    const potentials = Array.from(new Set(neighbours)).map(
      ([x, _, y]) => new Bacterium(x, y, null)
    );

    potentials.forEach(p => {
      console.log(p.coords, calculateNeighbours(p, p.getPotentialNeighbours()));
    });

    console.log(potentials);

    // Step 2 is to 'kill' bacterium with a fate of 'death'
    // this.forEach(bacterium => {
    //   if (bacterium.fate === "death") bacterium.status = "dead";
    // });

    // console.log(this);
  }
}

module.exports = Grid;
