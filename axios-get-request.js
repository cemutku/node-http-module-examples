const axios = require('axios');

axios
  .get('http://google.com')
  .then((response) => {
    console.log(response);
    console.log('response.data \n');
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
