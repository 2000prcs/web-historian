var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) { //should return an array of url's
  var result = [];
  var context = this;
  fs.readfile(path.join(__dirname, '../archives/sites.txt'), (err, data) => {
    if (err) {throw err;}
    var array = data.toString().split("\n");
    array.forEach((data)=>{
      result.push(data);
    });
    console.log(array);
    // callback(data);
    // if(!this.paths.list.includes(data)){
    //   callback(data);
    // }
    // response.write(data);
    // response.end();
  })
  console.log(result);
  return result;
  //split string (newline ) into array?
};

exports.isUrlInList = function(url, callback) {
  //use readlist of urls to check
    //if this.readlistofURLs includes url 
      //return true
  // this.readListOfUrls
  if(!this.paths.list.includes(url)){
    callback(url);
  }
};

exports.addUrlToList = function(url, callback) {
  //use fs append to file

  //if this.isUrlinList(url), then appendfile
  fs.appendFile(list, url, (err) => {
    if (err) throw err;
    console.log('Saved!');
  })
};

exports.isUrlArchived = function(url, callback) {
};

exports.downloadUrls = function(urls) {
};
