var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');



exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(response, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var encoding = {encoding: 'utf8'};
  fs.readFile( archive.paths.archivedSites + asset, encoding, (err, data)=> {
    if (err) {
      // file doesn't exist in public!
      fs.readFile( archive.paths.archivedSites + asset, encoding, (err, data)=> {
        if (err) {
          // file doesn't exist in archive!
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(response, data);
        }
      });
    } else {
      exports.sendResponse(response, data);
    }
  });
};


// As you progress, keep thinking about what helper functions you can put here!

// For GET request - redirecting to specific page 
exports.sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

// For GET request 
exports.sendResponse = function(response, obj, status) {
  status = status || 200;
  response.writeHead(status, exports.headers);
  response.end(obj);
};

// For POST method 
exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', (chunk) => {
    // since we are not using JSON object as response, (we are using url as itself), we don't need to parse / stringify
    data += chunk;
  });
  request.on('end', ()=>{
    callback(data);
  });
};

// For 404 response
exports.send404 = function(response) {
  exports.sendResponse(response, '404: Page not found', 404);
};