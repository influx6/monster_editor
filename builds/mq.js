var MonsterQuery = MonsterQuery || {};

//sub-spacing
MonsterQuery.core = MonsterQuery.core || {};



MonsterQuery.core.Element = Stub.create("MonsterQuery.Element",{
	
	initialize: function(root){
		this.root = root;
		this.current = this.root;
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
		return this._getSelector(root,selector,attribute,value);
	},
	
	_getElement: function(root,selector){
		var s = selector;
		var tests = this._checker;
		
		
		if(tests.id.test(selector)){
			return this._getSelector(root,'*','id',selector.split('#')[1]);
		}else if(tests.class.test(selector)){
			return this._getSelector(root,'*','class',selector.split('.')[1]);
		}else if(tests.tag_id.test(selector)){
			var v=selector.split('#');
			return this._getSelector(root,v[0],'id',v[1]);
		}else if(tests.tag_class.test(selector)){
			var v=selector.split('.')
			return this._getSelector(root,v[0],'class',v[1]);
		}else{
			return this._getTag(root,selector);
		}
	}, 

	_getTag: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
			return root.getElementsByTagName(selector);
	},

	_getId: function(root,selector){
			if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};

			if(selector.match(/^#\w/)){
				selector = selector.split('#')[1];
			}
			return [root.getElementById(selector)];
	},

	_getClass: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
			var result=[],i,nodes = root.getElementsByTagName('*');
			for(i = 0;i < nodes.length;i++){
				if(nodes[i].className === selector){
					result.push(nodes[i]);
				}
			}

			return result;
	},

	_getSelector: function(root,tag,attribute,selector){
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

	useResult: function(callback){ callback.call(this,this.current); },
	
	grab: function(){	return this.current; },
	
	get: function(selector,callback){
		var m = this.current;
		var g = this._search(m,selector);
		this.current = g;
		
		if(callback){ this.useResult(callback); }
		
		return this;
	},
	
	getAttr: function(selector,attr,value,callback){
		var m = this.current;
		var g = this._search(m,selector,attr,value);
		this.current = g;
		
		if(callback){ this.useResult(callback); }
		return this;
	},
	
});//query class
MonsterQuery.core.Query= Stub.create("MonsterQuery.Query",{

initialize : function(global){
		if(!global){ throw new Error("No Argument error!");}
		this.module = MonsterQuery.core;
		this.cache = {};
		this.dom = global;
},

_checker : {
		'class':/(^\.[a-zA-Z0-9-_]+)/,
		'id':/(^#[a-zA-Z0-9-_]+)/,
		'tag_id':/(^[a-zA-z]+#[-_A-Za-z0-9]+)/,
		'tag_class':/(^[a-zA-z]+\.[-_A-Za-z0-9]+)/
},
	
getElement: function(selector,root){
	var s = selector;
	if(!root){ root = this.dom; }
	var tests = this._checker;

	if(tests.id.test(selector)){
		return this.getId(root,selector.split('#')[1]);
	}else if(tests.class.test(selector)){
		return this.getclass(root,selector.split('.')[1]);
	}else if(tests.tag_id.test(selector)){
		var v=selector.split('#');
		return this.getSelector(root,v[0],'id',v[1]);
	}else if(tests.tag_class.test(selector)){
		var v=selector.split('.')
		return this.getSelector(root,v[0],'class',v[1]);
	}else{
		return this.getTag(root,selector);
	}
}, 

getTag: function(root,selector){
	if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
		return root.getElementsByTagName(selector);
},

getId: function(root,selector){
		if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};

		if(selector.match(/^#\w/)){
			selector = selector.split('#')[1];
		}
		return [root.getElementById(selector)];
},

getClass: function(root,selector){
	if(!root || !selector){ throw new Error("Arguments giving is Incorrect")};
		var result=[],i,nodes = root.getElementsByTagName('*');
		for(i = 0;i < nodes.length;i++){
			if(nodes[i].className === selector){
				result.push(nodes[i]);
			}
		}

		return result;
},

getSelector: function(root,tag,attribute,selector){
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
		

	selector = this._querinize_string(selector).split(' ');
	var element = new this.module.Element(this.getElement(selector));
	
	if(callback){ element.useResult(callback); }
	
	return element;
},

getSelector: function(selector){
	if(typeof selector != "string"){ throw new Error("selector is not a string") }
		
	var s = this._querinize_string(selector).split(' ');
	var root = s[0];
	var map = s.splice(1,selector.length);
		
	var element = new this.module.Element(this.getElement(root));
	
	while(map.length > 0){
		element.get(map[0]);
		map = map.splice(1,map.length);
	}
	
	return element.grab();
}

});

//event system
MonsterQuery.core.Event = Stub.create("MonsterQuery.Event",{});//aliases

var MQ = {
	Query: MonsterQuery.core.Query,
	Event: MonsterQuery.core.Event,
	Elements: MonsterQuery.core.Elements,
}