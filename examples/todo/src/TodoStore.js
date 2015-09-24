var TodoAction = require("./TodoAction.js");

var DataStationBase = require("../../../src/DataStation/DataStationBase");

var TodoStore = new DataStationBase();

TodoStore.addSource(TodoAction, "Todo.list");
TodoStore.addSource(TodoAction, "Todo.create");
TodoStore.addSource(TodoAction, "Todo.destroy");
TodoStore.addSource(TodoAction, "Todo.complete");

TodoStore.todos = [];

TodoStore.dispatchAllTodos = function() {
	this.dispatch({
		$type : "Todo.list",
		todos : this.todos
	});
};

TodoStore.addHandler(function() {
	this.dispatchAllTodos();
}.bind(TodoStore), "Todo.list");

TodoStore.addHandler(function(todoData) {
	var todo = {
		content : todoData.content,
		complete: false
	};
	this.todos.push(todo);
	this.dispatchAllTodos();
}.bind(TodoStore),"Todo.create");

TodoStore.addHandler(function(todoData) {
	var todo = todoData.todo;
	var index = this.todos.indexOf(todo);
	this.todos.splice(index, 1);
	this.dispatchAllTodos();
}.bind(TodoStore),"Todo.destroy");

TodoStore.addHandler(function(todoData){
	var todo = todoData.todo;
	var index = this.todos.indexOf(todo);
	this.todos[index].complete = true;
	this.dispatchAllTodos();
}.bind(TodoStore), "Todo.complete");

module.exports = TodoStore;