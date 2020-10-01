const axios = require('axios');
const fs = require('fs');

axios({
  method: 'get',
  url: 'http://www.google.com',
  responseType: 'stream',
})
  .then((response) => {
    response.data.pipe(fs.createWriteStream('google.html'));
  })
  .catch((err) => {
    console.log(err);
  });
