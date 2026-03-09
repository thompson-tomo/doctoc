"use strict";

function writeContent(processedContent, content) {
    if (content == "document"){
        console.log(processedContent.data);
    }
    else if(content == "section"){
        console.log(processedContent.wrappedToc);
    }
    else {
        console.log(processedContent.toc);
    }
    if (processedContent.transformed && content === undefined){
        console.log('==================\n\n"%s" should be updated', processedContent.path);
    }
    else if(!processedContent.transformed && content === undefined){
        console.log('==================\n\n"%s" is up to date', processedContent.path);
    }
    return processedContent.transformed ? "transformed" : "up-to-date";
}

function canHandle(files) {
    if (files.length > 1) {
        console.error('--stdout cannot be used to process multiple files/directories. Use --dryrun instead.');
        return false;
    }
    return true;
}

module.exports = {
  writeContent,
  canHandle
};
