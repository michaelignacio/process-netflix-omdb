const OMDB_API_KEY = '85c342da';

const nReadlines = require('n-readlines');
const axios = require('axios');
const fs = require('fs');
const slugify = require('slugify');

const broadbandLines = new nReadlines('ratings.csv');

let line;
let lineNumber = 1;
let moviesData = [];

while ((line = broadbandLines.next())) {
  // console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
  let arr = line.toString().split(',');
  let movieTitle = arr[1];

  console.log('Searching for ' + movieTitle);

  axios
    .get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${movieTitle}`)
    .then(function (response) {
      // console.log(response.data);
      let currentMovie = response.data;
      if (arr[4] == 1) {
        currentMovie['jalThumbs'] = 'down';
      } else if (arr[4] == 2) {
        currentMovie['jalThumbs'] = 'up';
      }
      currentMovie['jalRatedAt'] = arr[6];
      currentMovie['slug'] = slugify(arr[1].toLowerCase(), {
        remove: /[*+~.()'"!:@]/g,
      });
      // moviesData.push(response.data);
      moviesData.push(currentMovie);
      fs.writeFile(
        'movies.json',
        JSON.stringify(moviesData, null, 2),
        // moviesData,
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
}

// console.log('end of file.');
// const used = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
