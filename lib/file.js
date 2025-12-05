var path  =  require('path')
 ,  fs    =  require('fs')
 ,  _     =  require('underscore')
  , log   = require('loglevel');

var markdownExts = ['.md', '.markdown'];
var ignoredDirs  = ['.', '..', '.git', 'node_modules'];

function separateFilesAndDirs(fileInfos) {
  return {
    directories :  _(fileInfos).filter(function (x) {
      return x.isDirectory() && !_(ignoredDirs).include(x.name);
    }),
    markdownFiles :  _(fileInfos).filter(function (x) { 
      return x.isFile() && _(markdownExts).include(path.extname(x.name)); 
    })
  };
}

function findRec(currentPath) {
  function getStat (entry) {
    var target = path.join(currentPath, entry),
      stat = fs.statSync(target);

    return  _(stat).extend({ 
      name: entry,
      path: target
    });
  }
  
  function process (fileInfos) {
    var res = separateFilesAndDirs(fileInfos);
    var tgts = _(res.directories).pluck('path');

    if (res.markdownFiles.length > 0) 
      log.debug('\nFound %s in "%s"', _(res.markdownFiles).pluck('name').join(', '), currentPath);
    else 
      log.trace('\nFound nothing in "%s"', currentPath);

    return { 
      markdownFiles :  res.markdownFiles,
      subdirs     :  tgts
    };
  }

  var stats                  =  _(fs.readdirSync(currentPath)).map(getStat)
    , res                    =  process(stats)
    , markdownsInSubdirs     =  _(res.subdirs).map(findRec)
    , allMarkdownsHereAndSub =  res.markdownFiles.concat(markdownsInSubdirs);

  return _(allMarkdownsHereAndSub).flatten();
}

// Finds all markdown files in given directory and its sub-directories
// @param {String  } dir - the absolute directory to search in 
exports.findMarkdownFiles = function(dir) {
  return findRec(dir);
};
