var LessWatcher = (function(fs,path,less,node){
//setup variables
var node = node.Node,
less = less,
fs = fs,
path = path,
parser = new less.Parser,
settings = {};


var check_build_file = function(){
   var a = path.normalize(path.resolve(process.cwd(),"build-less")),
   b = path.normalize(path.resolve(process.cwd(),"build_less")),
   c = path.normalize(path.resolve(process.cwd(),"buildless"));
   var real;
   
   if(path.existsSync(a)){
     real = a;
   }
   else if(path.existsSync(b)){
    real = b;
   }
   else if(path.existsSync(c)){
      real = c;
   }else{
     console.log("build-less or build_less or buildless file not found!");
     return;
   };
   
  settings = readBuild(real);
   console.log(real);
};


var readBuild = function(file){
  try{
     var struct = fs.readFileSync(file,'utf8');
     return JSON.parse(struct);
     return struct;
   }
   catch(e){
       throw e;
       return false;
    }
};

var check_folder_state = function(less_dir,css_dir){
  
  var less_state = path.existsSync(path.normalize(less_dir));
  var css_state = path.existsSync(path.normalize(css_dir));
  
  if(less_state){
    if(!css_state){ fs.mkdir(path.normalize(css_dir)); return true;}
    	return true }else{
  	throw new Error("No directory name less was found!"); 
  }
  	return false;
}

var init_nodes = function(dir){
   var tmp = fs.readdirSync(dir);
   var tmplist = new node.List;
   for(var i = 0; i < tmp.length; i++){
     var c = path.resolve(dir,tmp[i]);
     var stat = fs.statSync(c);
     tmplist.add(tmp[i],c,stat['mtime']);
   };
    return tmplist;
};

var check_stat = function(list,css_dir){
  list.each(function(o){
    var stat = fs.statSync(o.data);
    if(stat['mtime'] > o.modtime){
      update(o,css_dir);
      o.modtime = stat['mtime']
    }
  });
};

var save = function(filename,data){
  fs.writeFile(filename,data, function(err){
   if(err){ 
     console.log(err);
     throw err;
    }
  });
};

var update = function(o,css_dir){
   var data = fs.readFileSync(o.data).toString();
   var css,opath;
   parser.parse(data, function(err,tree){
     if(err){
         throw new Error(err);
      }
      css = tree.toCSS({compress:true});
      opath = path.resolve(css_dir,o.name.toString().replace(/less/,'css'));
      save(opath, css);
      console.log(o.name + " Updated!");
   });
   
};


function init(less_dir,css_dir,time){
	var list = init_nodes(less_dir);
	
        var timeout = time;

	console.log('Updating every '+ timeout +"ms");
	list.each(function(o){ console.log("Watching:",o.name) });
	console.log("------------------------------------");

	timer = setInterval(function(){ 
	    if(!check_folder_state(less_dir,css_dir)){
	    	console.log('checking');
	    	check_stat(list,css_dir);
	    }else{
	      	check_stat(list,css_dir);
	    }
	 }, timeout);
};

check_build_file();
readBuild(path.normalize(path.resolve(process.cwd(),"build-less")));


return {
	init: init,
	settings:settings
}


})(require("fs"),require("path"),require("less"),require("./nodelib.js"));


//var folder = path.normalize(path.resolve(process.argv[2])),
//laps = process.argv[3] || 3,
//less_directory = folder+"/less",
//css_directory = folder+"/css";

//init(less_directory,css_directory, laps);

console.log(LessWatcher);
module.exports.LessWatcher = LessWatcher;
