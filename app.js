const OMDB_API_KEY = '85c342da';

const nReadlines = require('n-readlines');
const axios = require('axios');
const fs = require('fs');

const broadbandLines = new nReadlines('ratings.csv');

let line;
let lineNumber = 1;

while ((line = broadbandLines.next())) {
  // console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
  let arr = line.toString().split(',');
  let movieTitle = arr[1];
  let moviesData = [];

  console.log('Searching for ' + movieTitle);

  axios
    .get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${movieTitle}`)
    .then(function (response) {
      console.log(response.data);
      moviesData.push(response.data);
      fs.appendFile(
        'movies.json',
        JSON.stringify(moviesData, null, 2),
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
  lineNumber++;

  if (lineNumber == 2) break;
}

// console.log('end of file.');
// const used = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
