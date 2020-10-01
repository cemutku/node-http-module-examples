const http = require('http');
const url = require('url');
const jsonBody = require('body/json');
const fs = require('fs');
const formidable = require('formidable');

const server = http.createServer();

server.on('request', (request, response) => {
  console.log('incoming request');
  console.log(request.method, request.url);
  const parsedUrl = url.parse(request.url, true);

  if (request.method === 'GET' && parsedUrl.pathname === '/metadata') {
    const { id } = parsedUrl.query;
    const sampleData = getData(id);
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200;
    const seralizedJSON = JSON.stringify(sampleData);
    response.write(seralizedJSON);
    response.end();
  } else if (request.method === 'POST' && parsedUrl.pathname === '/users') {
    jsonBody(request, response, (err, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        console.log(body['userName']);
      }
    });
    response.statusCode = 200;
    response.end();
  } else if (request.method === 'POST' && parsedUrl.pathname === '/upload') {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
      encoding: 'utf-8',
      maxFields: 20,
    });

    // Handle file uploads using callback

    // form.parse(request, (err, fields, files) => {
    //     // fields -> contains key-value pairs representing the name and value of each of the forms fields.
    //     // files -> representing the files that we've uploaded

    //     if (err) {
    //       console.log(err);
    //       response.statusCode = 500;
    //       response.end('Error!');
    //     }

    //     response.statusCode = 200;
    //     response.end('success!');
    //   });

    // Handle file uploads in an asynchronous, event-driven way
    form
      .parse(request)
      .on('fileBegin', (name, file) => {
        console.log('Our upload has started!');
      })
      .on('file', (name, file) => {
        console.log('Field + file pair has been receivec');
      })
      .on('field', (name, value) => {
        console.log('Field received:');
        console.log(name, value);
      })
      .on('progress', (bytesReceived, bytesExpected) => {
        console.log(bytesReceived + ' / ' + bytesExpected);
      })
      .on('error', (err) => {
        console.log(err);
        request.resume(); // for continue the life cycle of formidable
      })
      .on('aborted', () => {
        console.error('Request aborted by the user');
      })
      .on('end', () => {
        console.log('Done - request fully received');
        response.end('Success!');
      });
  } else {
    // response.writeHead(404, {
    //   'X-Powered-By': 'Node',
    //   'Content-Type': 'application/json',
    // });
    // response.end();
    fs.createReadStream('./index.html').pipe(response);
  }
});

server.listen(8080);

function getData(id) {
  return {
    id: id,
    title: 'Sunset',
    description: 'Taken in Mexico - may be useful in an advertisement',
    creator: 'Steven A. Brown',
    date: new Date(),
  };
}

/* http

    * http.Server
        Like container for our logic and what will be the means of serving requests to clients.
        When source server receives a request, the Server class creates an incoming message and a server response and passes them to a request handler.
            * http.IncomingMessage  -> extends the readable stream interface
            * http.ServerResponse   -> extends the writable stream interface      
              
                (request, response) => {}
        
        * http.Agent            
            It is used for managing connection persistence and reused for HTTP clients.

        * http.ClientRequest -> extends the writable stream interface
            To make API calls - acting as a client in client-server model
            It is created internally whenever we make an API call and represents an InProgress request

        * http.ClientRequest -> extends the writable stream interface
        
        * Server, IncomingMessage, ServerResponse,  ->  extends the EventEmitter interface, we can work with them using events.
*/

// post request -> & 'C:\Program Files\Git\mingw64\bin\curl' -i -X POST -H "Content-Type:application/json" -d "@mockdata.json" http://localhost:8080/users
// EvantEmitter -> ReadableStream -> IncomingMessage
// The request object makes use of two interfaces
// - ReadableStream
// - EventEmitter

/** Benefits of streams
 * Memory efficiency
 * Time efficiency
 *
 * We can operate on our data one piece at a time. This results in not having to load the entire contents of what we are working with into memory,
 * there by using less resources at a single given moment.
 * We start streaming a file to our client as soon as we have our first chunk of data avaiable.
 * */

/**  without json body
 *  const body = [];
    request
      .on('data', (chunk) => {
        // console.log('this is a chunk \n');
        // console.log(chunk.toString());
        body.push(chunk);
      })
      .on('end', () => {
        const parsedJSON = JSON.parse(Buffer.concat(body));
        const userName = parsedJSON[0]['userName'];
        console.log(userName);
      })
      .on('error', (err) => {
          consoloe.log(err);
      });
 */
