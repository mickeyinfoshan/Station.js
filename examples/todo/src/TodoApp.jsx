var TodoStore = require("./TodoStore.js");

var React = require('react');

var TodoApp = React.createClass({
	getInitialState: function() {
		return {
			todos : []
		};
	},
	componentDidMount: function() {
		this.initStation();	
		TodoStore.dispatchAllTodos();
		
	},
	createTodo : function() {

	},
	initStation : function() {
		var station = new DataStationBase();
		station.addSource(TodoStore,"Todo.list");
		station.addHandler(function(todosData){
			this.setState({
				todos : todosData.todos 
			});
		}.bind(this),"Todo.list");
		TodoStore.addSource(station,"Todo.create");
		TodoStore.addSource(station,"Todo.destroy");
		this.station = station;
	},
	render: function() {
		return ( 
			<div></div>
		);
	}

});

module.exports = TodoApp;