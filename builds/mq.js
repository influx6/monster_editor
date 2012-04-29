var MonsterQuery = MonsterQuery || {};

//sub-spacing
MonsterQuery.version = "0.0.1";
MonsterQuery.core = MonsterQuery.core || {};



MonsterQuery.core.Element = Stub.create("MonsterQuery.Element",{
	
	initialize: function(root,dom){
		this.dom = dom;
		this.current = this._getElement(this.dom,root);
	},

	_query_sanitize: function(word,token,rtoken){
		word = word.replace(token,rtoken);
		return word;
	},
	
	_querinize_string: function(selector){
		selector = this._query_sanitize(selector,/^[\s]+/ig,'');
		selector = this._query_sanitize(selector,/>+|\++/ig,'');
		selector = this._query_sanitize(selector,/\s+/ig,' ');
		selector = this._query_sanitize(selector,/(\s+)$/ig,'');

		return selector;
	},
	
	_checker : {
			'class':/(^\.[a-zA-Z0-9-_]+)/,
			'id':/(^#[a-zA-Z0-9-_]+)/,
			'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
			'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
	},
	
	_search: function(m,selector,attribute,value){
		var search = m,result=[];
		this.map(search,function(o){
			if(!attribute && !value){
				var c = this._getElement(o,selector);
			}else{
				var c = this._getElementWithAttribute(o,selector,attribute,value)
			}
			if(c && c.length > 0){
				this.onEach(c,function(o){ result.push(o);},this);
			}
		},this);
		
		return result;
	},

	_getElementWithAttribute: function(root,selector,attribute,value){
		return this._getMapSelector(root,selector,attribute,value);
	},
	
	_getElement: function(root,selector){
		var s = selector;
		var tests = this._checker;
		
		
		if(tests.id.test(selector)){
			return this._getMapSelector(root,'*','id',selector.split('#')[1]);
		}else if(tests.class.test(selector)){
			return this._getMapSelector(root,'*','class',selector.split('.')[1]);
		}else if(tests.tag_id.test(selector)){
			var v=selector.split('#');
			return this._getMapSelector(root,v[0],'id',v[1]);
		}else if(tests.tag_class.test(selector)){
			var v=selector.split('.')
			return this._getMapSelector(root,v[0],'class',v[1]);
		}else{
			return this._getTag(root,selector);
		}
	}, 

	_getTag: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
			return root.getElementsByTagName(selector);
	},

	_getMapSelector: function(root,tag,attribute,selector){
		if(!root || !selector || !tag || !attribute){
			 throw new Error("Arguments giving is Incorrect")
		};

			var result=[],i,nodes = root.getElementsByTagName(tag);
			for(i=0; i < nodes.length; i++){
				if(nodes[i].getAttribute(attribute) == selector){
					result.push(nodes[i]);
				}
			}
			return result;
	},

	useResult: function(callback){
		this.onEach(this.current, function(o,b,i){
			callback.call(this,o,b,i);
		}); 
	},
	
	has: function(obj,property){
		var state = false;
		this.onEach(obj,function(o,b,i){
			if(o == property){
				state = true;
			}
		},this);
		
		return state;
	},
	
	grab: function(pos){	
		if(pos){return this.current[pos];}
		return this.current;
	},
	
	first: function(){
		if(this.current){
			return this.current[0];
	  	}
	},
	
	last: function(){
		if(this.current && this.current.length > 1){
			return this.current[this.current.length - 1];
		}else{
			return this.first();
		}
	},
	
	nth: function(){},
	
	size: function(){
		return this.current.length;
	},
	
	addClass: function(c){
	  this.onEach(this.current, function(o){
		if(o.className && !this.has(o.className.split(/\s+/),c) ){
				o.className += " "+ c;
		 }
		},this);
		return this;
	},
	
	removeClass: function(c){
		this.onEach(this.current, function(o){
			var p = o.className.split(/\s+/);
			if(o.className && this.has(p,c)){
				o.className = this.map(p,function(o){
					if(o != c){
						return o;
					}
				}).join(' ');
			 }
		},this);
			return this;
	},
	
	css: function(prop){
		this.map(this.current,function(o){
			this.onEach(prop, function(e,b){
				o.style[e]=b[e];
			});
		},this);
		return this;
	},
	
	get: function(selector,callback){
		this.current = this._search(this.current,selector);
		
		if(callback){ this.useResult(callback); }
		
		return this;
	},
	
	getAttr: function(selector,attr,value,callback){
		this.current = this._search(m,selector,attr,value);
		
		if(callback){ this.useResult(callback); }
		return this;
	},
	
	getSelector: function(selector,callback){
		
		if(this.isObjectType(selector,"string")){
			var map = this._querinize_string(selector).split(' ');
		}else{
			var map = selector;
		}
		
		while(map.length > 0){
			this.get(map[0]);
			map = map.splice(1,map.length);
		}
	
		if(callback){ this.useResult(callback); }
		
		return this;
	},
	
	toString: function(){
		return this.className;
	}
});//query class
MonsterQuery.core.Query = Stub.create("MonsterQuery.Query",{

initialize : function(global){
		this.module = MonsterQuery.core;
		this.map_cache = {};
		this.dom = global;
		if(!global){ throw new Error("No Argument error!");}
},

_checker : {
		'class':/(^\.[a-zA-Z0-9-_]+)/,
		'id':/(^#[a-zA-Z0-9-_]+)/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
		'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
},

_query_sanitize: function(word,token,rtoken){
	word = word.replace(token,rtoken);
	return word;
},

_querinize_string: function(selector){
	selector = this._query_sanitize(selector,/^[\s]+/ig,'');
	selector = this._query_sanitize(selector,/>+|\++/ig,'');
	selector = this._query_sanitize(selector,/\s+/ig,' ');
	selector = this._query_sanitize(selector,/(\s+)$/ig,'');
	
	return selector;
},

get : function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
		
	selector = this._querinize_string(selector).split(' ')[0];
	var element = new this.module.Element(selector,this.dom);
	
	if(callback){ element.useResult(callback); }
	
	return element;
},

getSelector: function(selector,callback){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
	
	var s = this._querinize_string(selector).split(' ');
	var root = s[0];
	var map = s.splice(1,selector.length);
		
	var element = new this.module.Element(root,this.dom);
	element.getSelector(map);
	
	if(callback){ element.useResult(callback); }
	
	return element;
}



});

//event system
MonsterQuery.core.Event = Stub.create("MonsterQuery.Event",{
	
});//aliases
var _MQ = window.MQ;

var MQ = window.MQ = (function(){
	var self = this;
	var dom = self.document;
	var domReady=false
		
		
		var domContentLoaded = function(){
		  if(!domReady){
			if(dom.addEventListener){
				dom.addEventListener("DOMContentLoaded",function(){
					domReady = true;
				},false);
			}
		 }
		};
		
		var readyStateCheck = function(){
			if(!domReady){
				var timer = self.setInterval(function(){
					if("loaded|complete".indexOf(document.readyState) != -1){
						domReady = true;
					}
					if(domReady){
						self.clearInterval(timer);
					}
				},0);
			}			
		};
		
		var insertElementTest = function(){
			var span = dom.createElement('span');
			var ms = 0;
			if(!domReady){
			var timer = self.setInterval(function(){
				if(dom.body && !domReady){
					if(dom.body.appendChild(span) && dom.body.removeChild(span)){
						domReady = true;
					}
				};
				if(domReady){
					window.clearInterval(timer);
				}
			},ms);
		  }		
		};
		
		
		return {
			version: MonsterQuery.version,
			Query: new MonsterQuery.core.Query(document),
			Event: MonsterQuery.core.Event,
			Element: MonsterQuery.core.Element,
			
			onReady: function(fn){
				var empty = function(){};
				var self=this;
				
				domContentLoaded();
				readyStateCheck();
				insertElementTest();
				
				var poll = window.setTimeout(function(){
					if(domReady){
						window.clearTimeout(poll);
						fn.call(self);
					}
				},30);
				
			}
		};
		
})();


