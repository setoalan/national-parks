'use strict';

const fs = require('fs');

if (!fs.existsSync('./.env')) {
  fs.createReadStream('.sample-env')
    .pipe(fs.createWriteStream('./.env'));
}
