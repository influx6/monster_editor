#!/usr/bin/env node

var fs = require('fs');

var compile = function(file_in,file_out_name,output){
        var rs = fs.createReadStream(file_in);  
        var output_file,output_dir;
        
        
        if(!output){
           throw new Error("Building directory was not specified");
   	}else{
   	   output_dir = output;
   	};
   	
   	output_file=output_dir+"/"+file_out_name;
   	
        fs.readdir(output_dir, function(err,data){
   	 if(err){
   	   fs.mkdir(output_dir);
   	  }else{
   	   for(var i=0; i < data.length; i++){
   	     path = output_dir+"/"+data[i];
   	     fs.unlink(path);
   	   };
   	  }
   	});
   	
   	rs.on('data', function(data){
          fs.createWriteStream(output_file,{flags:'a'}).write(data);	
  	 });
   	   
};

     
var require_js={};
require_js.desc;
require_js.output_dir;
require_js.look_dir="";
require_js.build_name;

require_js.use = function(file){
   var name = require_js.build_name;
   var dir = require_js.output_dir;
   var __file;
   if(typeof require_js.look_dir == "string"){
       __file=require_js.look_dir + file;
   };
   
   if(!name){
      throw new Error("Please set output file name first"+
	   " using the setBuildName method supplied with"+
	   " the file name to use before calling require_js");
   };

   if(require_js.desc && typeof require_js.desc == "string"){
     	console.log(require_js.desc + " : " + file);
    };
	
   compile(__file,require_js.build_name,require_js.output_dir);
  
};
     
module.exports.require_js = require_js;

