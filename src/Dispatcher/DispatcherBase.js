var assign = require('object-assign');
var Promise = require('es6-promise');
var Set = require('es6-set');

var DispatcherBase = function() {
	this.registered = [] ;
	this.prioritySet = new Set();
};

DispatcherBase.prototype = assign({},DispatcherBase.prototype,{
	//处理注册请求
	register : function(registerRequest) {
		var priority = registerRequest.priority || 0;
		this.prioritySet.add(priority);
		this.registered[priority] = this.registered[priority] || [];
		this.registered[priority].push(registerRequest);	
	},
	dispatch : function(message) {
		var prioritySetIterator = this.prioritySet[Symbol.iterator]();
		this.dispatchWithPrority(message,prioritySetIterator);
	},
	dispatchWithPrority	: function(message,prioritySetIterator) {
		var priority = this.prioritySetIterator.value;
		if(!priority){
			return true;
		}
		var registerRequests = this.registered[priority];
		var promises = registerRequests.map(function(reg,i){
			return Promise.resolve(reg.handler(message));
		});
		Promise.all(promises)
		.then(function(){
			return this.dispatchWithPrority(message,prioritySetIterator.next());
		}.bind(this),function(err){
			new Error("Error during dispatching");
		});
	}
});
module.exports = DispatcherBase;