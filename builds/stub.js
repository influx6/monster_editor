var Stub=function(){var a=function(a,b){for(var c in b)a[c]=b[c]},b=function(a,b){if(typeof a!="function"&&typeof a!="object")throw Error("first argument given is not an object or function!");if(typeof b!="function"&&typeof b!="object")throw Error("second argument given is not an object or function!");a.prototype=new b,a.prototype.constructor=a,a.parent=b.prototype,b.prototype.construtor=b},c={extend:function(a){if(typeof a!="object")throw Error("Argument passed is not an Object!");var b=this;for(var c in a)b[c]=a[c];return},include:function(a){if(typeof a!="object")throw Error("Argument passed is not an Object!");var b=this.prototype;for(var c in a)b[c]=a[c];return}},d={map:function(a,b){var c=[],d=this;return a.each?(a.each(function(){c.push(b.call(this,o))}),c):(d.onEach(a,function(a,d){c.push(b.call(this,a))}),c)},each:function(a){var b=this;for(var c in b)a.call(b,c,b)},onEach:function(a,b,c){var d=c;c||(d=this);if(this.isObjectType(a,"array")||this.isObjectType(a,"string")){for(var e=0;e<a.length;e++)b.call(d,a[e],a,e);return}if(this.isObjectType(a,"object")||typeof a=="object"){for(var f in a)b.call(d,f,a);return}},objectType:function(){var a=this;return{}.toString.call(a).match(/\s([\w]+)/)[1].toLowerCase()},isObjectType:function(a,b){var c={}.toString.call(a).match(/\s([\w]+)/)[1].toLowerCase();return b&&typeof b=="string"?c===b.toLowerCase():c},has:function(a,b){if(!a||typeof a!="string")throw Error("Argument being passed is not a string!");var c=!1;return this.each(function(b,d){a===b&&(c=!0,console.log(a,":",typeof d[a]))}),c},bindEvent:function(a,b,c){var d=this.events;if(!a||!b||!c)throw Error("Incorrect number of arguments were giving!");if(!!d.nameSpace[a])throw console.error("Namespace already being Used!"),Error("Namespace already being Used!");d.nameSpace[a]=c,d.eventSpace[b]||(d.eventSpace[b]=[]),d.eventSpace[b].push(a)},unbindEvent:function(a,b){var c=this.events;if(!c.nameSpace[b])throw Error("Namespace doesnt exists!");var d=c.eventSpace[a],e;this.onEach(d,function(a,f,g){a==b&&(e=d.splice(g,1),delete c.nameSpace[a],console.log("Event:",b,"removed!"))},d)},triggerEvent:function(a,b){var c=this.events;if(!c.eventSpace[a])return;var d=c.eventSpace[a];this.onEach(d,function(a,d){c.nameSpace[a].apply(this,b||[])},d)},flushEvents:function(a){var b=this.events,c=b.eventSpace[a];this.onEach(c,function(a,d,f){delete b.nameSpace[a],c.splice(f,1)},c)},flushAllEvents:function(){var a=this.events;a.nameSpace={},a.eventSpace={}},proxy:function(a){var b=this;return a.apply(b,arguments)},trigger:function(a){var b=this;b[a]&&b[a].apply(this,arguments)}};return{inherit:b,map:d.map,isObjectType:d.isObjectType,onEach:d.onEach,create:function(e,f,g){function h(){this.className=e,this.events={nameSpace:{},eventSpace:{}},h.parent&&(h.parent.constructor.apply(this,arguments),this._super=h.parent,this.className=e),this.initialize&&this.initialize.apply(this,arguments)}if(!e||typeof e!="string")throw Error("First argument must be the name of the class!");return g&&b(h,g),a(h,c),a(h.prototype,d),h.prototype.constructor=h,h.fn=h.prototype,h.fn.initialize=function(){},f&&(f.extend&&h.extend(f.extend),f.include&&h.include(f.include),!f.extend&&!f.include&&h.include(f)),h.proxy=h.fn.proxy,h}}}()