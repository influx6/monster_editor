var MonsterQuery = MonsterQuery || {};

//sub-spacing
MonsterQuery.core = MonsterQuery.core || {};



MonsterQuery.core.Elements = Stub.create("MonsterQuery.Elements",{
	initialize: function(node){
		this.node = node;
		this.map = this.mapNode();
	},
	
	mapNode: function(){
	 	this.onEach(this.node.children,function(o,b){
			console.log(o);
		},this);
	}
});//query class
MonsterQuery.core.Query= Stub.create("MonsterQuery.Query",{

initialize : function(global){
		this.module = MonsterQuery.core;
		this.cache = {};
		this.object_cache = {};
		this.dom = global;
		this.new_properties= this.chkDOMProperties();
},

_sorter : function(obj,reg,result){	
	if(!obj){ return; }	
	var o = obj.match(reg),self=this;
	result.push(o[1]);
	
	if(o[2] != undefined){
		self._sorter(o[2],reg,result);
	}
},

_checker : {
	
	tests:{
		'class':/(^\.[a-zA-Z0-9-_]+)/,
		'id':/(^#[a-zA-Z0-9-_]+)/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
		'tag_class':/([a-zA-z]+\.[-_A-Za-z0-9]+)/
	},
	
	selectors:{
		'tag':/^[^\W][a-zA-Z]+/,
		'id':/(^#[a-zA-Z0-9-_]+)[^\S]?([\w\W]+)?/,
		'class':/(^\.[a-zA-Z0-9-_]+)[^\S]?([\w\W]+)?/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)[^\S]?([\W\w]+)?/,
		'tag_class':/([a-zA-z]+\.[-_A-Za-z0-9]+)[^\S]?([\W\w]+)?/,
		'pseudo_class':''
	}
},

_query_sanitize: function(word,token,rtoken){
	word = word.replace(token,rtoken);
	return word;
},

findHandler:{
	'tag': function(root,selector){
		return root.getElementsByTagName(selector);
	},
	'id': function(root,selector){
		return [root.getElementById(selector)];
	},
	
	'class': function(root,selector){
		var result=[],i,nodes = root.getElementsByTagName('*');
		for(i = 0;i < nodes.length;i++){
			if(nodes[i].className.match(selector)){
				result.push(nodes[i]);
			}
		}
		
		return result;
	},
	'tag_id': function(root,tag,selector){
		var result,i,nodes = root.getElementsByTagName(tag);
		for(i=0; i < nodes.length; i++){
			if(nodes[i].getAttribute('id') == selector){
				result.push(nodes[i]);
			}
		}
		return result;
	},
	'tag_class': function(root,tag,selector){
		var result,i,nodes = root.getElementsByTagName(tag);
		for(i=0; i < nodes.length; i++){
			if(nodes[i].getAttribute('class') == selector){
				result.push(nodes[i]);
			}
		}
		return result;
	}
},

mapHandler: function(selector){
	var tests = this._checker.test;
	
	if(tests.id.test(selector)){
		return this.findHandler['id'];
	}else if(tests.class.test(selector)){
		return this.findHandler['class'];
	}else if(tests.tag_id.test(selector)){
		return this.findHandler['tag_id'];
	}else if(test.tag_class.test(selector)){
		return this.findHandler['tag_class'];
	}else{
		return this.findHandler['tag'];
	}
},

chkDOMProperties : function(){
	var new_properties={
		'querySelector': false,
		'querySelectorAll': false,
		'getElementByClassName': false
	};
	
	if('querySelector' in this.dom){
		new_properties['querySelector']=true;
	}
	if('querySelectorAll' in this.dom){
		new_properties['querySelectorAll']=true;
	}
	if('getElementByClassName' in this.dom){
		new_properties['getElementByClassName']=true;
	}
	
	return new_properties;
},

mapBreaker: function(selector){
	var self=this,result=[],tests = this._checker.tests,checks=this._checker.selectors;

	if(tests.id.test(selector)){
		this._sorter(selector,checks.id,result);
	}else if(tests.class.test(selector)){
		this._sorter(selector,checks.class,result);
	}else if(tests.tag_id.test(selector)){
		this._sorter(selector,checks.tag_id,result);
	}else if(tests.tag_class.test(selector)){
		this._sorter(selector,checks.tag_class,result);	
	}
	
	return result;
},

mapQuery : function(selector){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
	var reg = this._checker;
    
	selector = this._query_sanitize(selector,/(^\s+)?/,'');
    selector = this._query_sanitize(selector,' > ',' ');
    selector = this._query_sanitize(selector,' + ',' ');

	var handler = this.mapHandler(selector);
	
	
	
	return handler;
},


get : function(selector){
	var handler;
	
	if(this.new_properties['querySelector']){
		handler = this.dom.querySelectorAll;
	}else{
		handler = this.mapQuery(selector);
	}
	

},

getAll: function(selector){
	var handler;
	
	if(this.new_properties['querySelectorAll']){
		handler = this.dom.querySelector;
	}else{
		handler = this.mapQuery(selector);
	}
	
}

});

//event system
MonsterQuery.core.Event = Stub.create("MonsterQuery.Event",{});//aliases

var MQ = {
	Query: MonsterQuery.core.Query,
	Event: MonsterQuery.core.Event
}