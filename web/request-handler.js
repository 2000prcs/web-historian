var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

// original helper function

// var sendFileContent = function (response, filename, contentType) {
//   fs.readFile(filename, function (err, data) {
//     if (err) {
//       console.log(err);
//       response.writeHead(404);
//       response.write('Not Found!');
//     } else {
//       response.writeHead(200, {
//         'Content-Type': contentType
//       });
//       response.write(data);
//     }
//     response.end();
//   });
// };

var actions = {
  // Handle GET request when user types a url in a browser search bar 
  'GET': function (request, response) {
    var urlPath = url.parse(request.url).pathname;

    // '/' redirects to index.html
    if (urlPath === '/') {
      urlPath = '/index.html';
    }
    if (urlPath === '/index.html') {
      fs.readFile(path.join(__dirname, '../web/public/index.html'), function (err, data) {
        if (err) {
          console.log(err);
        }
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
      });
    }
    // handle directing to static files (html, css, js...)
    helpers.serveAssets(response, urlPath, () => {

      // trim leading slash if present
      if (urlPath[0] === '/') {
        urlPath = urlPath.slice(1);
      }

      // check if the url is in sites.text
      archive.isUrlInList(urlPath, (found) => {
        if (found) {
          // if found in the list, redirect user to loading page
          helpers.sendRedirect(response, '/loading.html');
        } else {
          // if not, send 404 
          helpers.send404(response);
        }
      });
    });
  },

  'POST': function (request, response) {
    helpers.collectData(request, (data) => {
      // data will look '=www.google.com'
      console.log('data', data);
      // replace method -> it replaces the first argument with the second argument
      var url = data.split('=')[1].replace('http://', '');
      console.log('url', url);
      // check sites.txt for the website
      archive.isUrlInList(url, (found) => {
        if (found) { // found
          // check if site is archived in sites directory
          archive.isUrlArchived(url, (exists) => {
            if (exists) {
              // redirect to site page (/www.google.com)
              helpers.sendRedirect(response, '/' + url);
            } else {
              // redirect to loading.html
              helpers.sendRedirect(response, '/loading.html');
            }
          });
        } else { // not found 
          archive.addUrlToList(url, function () {
            // redirect to loading html
            helpers.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  // check if the request method is existing in actions object (if it's OPTIONS / DELETE -> false)
  var handler = actions[req.method];
  // check request method and call the method from actions object 
  if (handler) {
    handler(req, res);
  } else {
    helpers.send404(response);
  }
};


// original code 

// exports.handleRequest = function (req, res) {
//   const { method, url } = req;
//   const headers = helpers.headers;
//   console.log('method:', method, 'url:', url);
//   var statusCode;

//   if (method === 'GET') {
//     if (url === '/' || url === '/index.html') {
//       sendFileContent(res, path.join(__dirname, '../web/public/index.html'), 'text/html');
//     } else if (url === '/styles.css') {
//       sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'styles.css'), 'text/css');
//     } else {
//       sendFileContent(res, archive.paths.archivedSites + url, 'text/html');
//     }
//   } else if (method === 'POST') {
//     req.on('data', (chunk) => {
//       // node devides data to chunks in order to handle lots of requests at the same time
//       // node handles different chunks at the same time to handle requests
//       // this is how node works asyncronosouly 
//       chunk = chunk.slice(4);
//       chunk = chunk + '\n';
//       // if (!archive.isUrlInList(chunk, (data) => {
//       //   return data;
//       // })) {
//       //   console.log('working');
//       //   sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'loading.html'), 'text/html');
//       // }

//       // on -> end : as soon as 'end' starts, data sending is over
//       archive.addUrlToList(chunk, (err, data) => {
//         if (err) {
//           statusCode = 404;
//           res.writeHead(statusCode, headers);
//           res.end();
//         } else {
//           statusCode = 302;
//           res.writeHead(statusCode, headers);
//           res.end(data);
//         }
//       });
//     });
//   }

//   //res.end(archive.paths.list);
// };