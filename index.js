const fs = require("fs");
const parse = require("csv-parse");
const prompts = require("prompts");

const Cell = require("./Cell");

const parser = parse({
  relax_column_count: true
});

const dataPoints = [];

(async () => {
  const { filename } = await prompts({
    type: "text",
    name: "filename",
    message: "Enter filename:"
  });

  importFile(filename);
})();

const importFile = filename => {
  fs.createReadStream(filename)
    .pipe(parser)
    .on("data", row => {
      // Ignore "end" statement
      if (row[0] === "end") return;
      dataPoints.push(new Cell(row.toString()));
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
};
