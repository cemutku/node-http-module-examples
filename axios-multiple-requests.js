const axios = require('axios');

const getMetadata = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};

const getMetadataAgain = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};

axios.all([getMetadata(), getMetadataAgain()]).then((responseArray) => {
  console.log(responseArray[0].data.description);
  console.log(responseArray[1].data.description);
});
