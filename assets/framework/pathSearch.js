var fs = require('fs'),
path = require('path');


var searchPath = function(current,wanted){
   var c = path.normalize(current);
   var w = path.normalize(wanted);
   
   if(c == w){
     return c;
   }
   
   console.log(c,w);
}

//searchPath(__dirname,path.resolve(""));

console.log(process.cwd());
