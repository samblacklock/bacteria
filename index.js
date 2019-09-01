const fs = require("fs");
const parse = require("csv-parse");

const Grid = require("./Grid");

const parser = parse({
  relax_column_count: true
});

const plots = [];

fs.createReadStream("./test.csv")
  .pipe(parser)
  .on("data", row => {
    // Ignore "end" statement
    if (row[0] === "end") return;
    plots.push(row.map(i => parseInt(i)));
  })
  .on("end", () => {
    console.log("CSV file successfully processed");

    const grid = new Grid(plots);

    setTimeout(() => {
      grid.advance();
    }, 1000);
  });
