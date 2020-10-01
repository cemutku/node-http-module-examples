const https = require('https');
const fs = require('fs');

const server = https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
});

server.on('request', (request, response) => {
  response.end('This was served with https!');
});

server.listen(443);

// on windows
// generate self-signed certificate -> & 'C:\Program Files\Git\usr\bin\openssl' req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -subj "/"
