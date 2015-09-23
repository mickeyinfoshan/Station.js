var DataStationBase = require("../../src/DataStation/DataStationBase.js");
var TodoStore = new DataStationBase();
TodoStore.todos = [];

TodoStore.dispatchAllTodos = function() {
	this.dispatch({
		todos : this.todos,
		$type : 'Todo.list'
	});
};

TodoStore.addHandler(function(todoData) {
	var todo = {
		text : todoData.content,
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

module.exports = TodoStore;