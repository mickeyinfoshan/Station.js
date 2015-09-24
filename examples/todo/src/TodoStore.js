var TodoAction = require("./TodoAction.js");

var DataStationBase = require("../../../src/DataStation/DataStationBase");

var TodoStore = new DataStationBase();

TodoStore.addSource(TodoAction);

TodoStore.todos = [];

TodoStore.dispatchAllTodos = function() {
	this.dispatch({
		$type : "Todo.list",
		todos : this.todos
	});
};

TodoStore.addHandler("Todo.list", function() {
	this.dispatchAllTodos();
}.bind(TodoStore));

TodoStore.addHandler("Todo.create", function(todoData) {
	var todo = {
		content : todoData.content,
		complete: false
	};
	this.todos.push(todo);
	this.dispatchAllTodos();
}.bind(TodoStore));

TodoStore.addHandler("Todo.destroy", function(todoData) {
	var todo = todoData.todo;
	var index = this.todos.indexOf(todo);
	this.todos.splice(index, 1);
	this.dispatchAllTodos();
}.bind(TodoStore));

TodoStore.addHandler("Todo.toggleComplete", function(todoData){
	var todo = todoData.todo;
	var index = this.todos.indexOf(todo);
	this.todos[index].complete = !this.todos[index].complete;
	this.dispatchAllTodos();
}.bind(TodoStore));

module.exports = TodoStore;