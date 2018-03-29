var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!



var sendFileContent = function(response, filename, contentType){
  fs.readFile(filename, function(err, data){
    if(err){
      console.log(err);
      response.writeHead(404);
      response.write("Not Found!");
    } else {
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
    } 
    response.end();
  });
}


exports.handleRequest = function (req, res) {
  const {method, url} = req;
  console.log(method, url);
  
  if (method === 'GET') {
    if(url === '/'){
      //console.log(__dirname);
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'index.html'), 'text/html');
    } else if (url === '/styles.css'){
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'styles.css'), 'text/css');
    } else {
      res.writeHead(404, '')
      archive.readListOfUrls(data=>{
        
        // archive.isUrlInList(data, data=>{
        //   console.log('isUrlInList', data);
        // });

        console.log('data', data);

        archive.isUrlInList(data, data=>{
          //return data = 
        });
        return data;
      });
      
    }
  } else if (method === 'POST') {
    var body = '';
    req.on('data', (chunk) => {
      var parsedChunk = JSON.parse(chunk);
      chunk = JSON.stringify(parsedChunk);
      body += chunk;
      //archive.isUrlInList(url, archive.readListOfUrls)
    }).on('end', () => {
      httpHelpers.headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, httpHelpers.headers);
      response.end({body});
      archive.addUrlToList(body, callback);
    })
  } else {
      response.writeHead(404, httpHelpers.headers)
      response.end();
  }
  //res.end(archive.paths.list);
};

