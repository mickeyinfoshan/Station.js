var DataStationBase = require("../../../src/DataStation/DataStationBase");

var TodoAction = new DataStationBase();

TodoAction.list = function() {
	this.dispatch({
		$type : "Todo.list"
	});
};

TodoAction.create = function(content) {
	this.dispatch({
		$type : "Todo.create",
		content : content
	});
};

TodoAction.destroy = function(todo) {
	this.dispatch({
		$type : "Todo.destroy",
		todo : todo
	});
};

TodoAction.complete = function(todo) {
	this.dispatch({
		$type : "Todo.complete",
		todo : todo
	});
};

module.exports = TodoAction;