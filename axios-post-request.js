const axios = require('axios');

axios({
  method: 'post',
  url: 'http://localhost:8080/users',
  data: {
    userNames: ['danny001', 'freddy12'],
  },
  transformRequest: (data, request) => {
    const newData = data.userNames.map((userName) => {
      return userName + '!';
    });
    return JSON.stringify(newData);
  },
  //   transformResponse: (data) => {}
})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });
