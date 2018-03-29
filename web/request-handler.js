var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!



var sendFileContent = function(response, filename, contentType) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log(err);
      response.writeHead(404);
      response.write('Not Found!');
    } else {
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
    } 
    response.end();
  });
};


exports.handleRequest = function (req, res) {
  const {method, url} = req;
  console.log(method, url);
  
  if (method === 'GET') {
    if (url === '/') {
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'index.html'), 'text/html');
    } else if (url === '/styles.css') {
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'styles.css'), 'text/css');
    } else {
      res.writeHead(404, httpHelpers.headers);
      // archive.isUrlInList(url, data=>{
      //   console.log('works');
      //   return url === data;
      // });
      archive.readListOfUrls(data=>{
        console.log('works?');
        return data;
      });
      
    }
  } else if (method === 'POST') {
    var body = '';
    req.on('data', (chunk) => {
      var parsedChunk = JSON.parse(chunk);
      chunk = JSON.stringify(parsedChunk);
      body += chunk;
      //archive.addUrlToList(body, body=>{console.log('body'); return body;});
    }).on('end', () => { 
      // httpHelpers.headers['Content-Type'] = 'application/json';
      // response.writeHead(statusCode, httpHelpers.headers);
      // response.end({body});
      console.log(body);
      archive.isUrlInList();
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'loading.html'), 'text/html');
      //archive.addUrlToList(body, callback);
    });
  } else {
    response.writeHead(404, httpHelpers.headers);
    response.end();
  }
  //res.end(archive.paths.list);
};

