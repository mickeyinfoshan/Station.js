var TodoStore = require("../TodoStore");
var TodoAction = require("../TodoAction");
var React = require('react');
var DataStationBase = require("../../../../src/DataStation/DataStationBase");
var TodoItem = require("./TodoItem.react")
var TodoInput = require("./TodoInput.react")

var TodoApp = React.createClass({
	getInitialState: function() {
		return {
			todos : []
		};
	},
	componentDidMount: function() {
		this.initStation();	
		TodoAction.list();
	},
	initStation : function() {
		var _this = this;
		var station = new DataStationBase();
		station.addSource(TodoStore,"Todo.list");
		station.addHandler("Todo.list", function(todosData){
			this.setState({
				todos : todosData.todos 
			});
		}.bind(_this));
		this.station = station;
	},
	componentWillUnmount: function() {
		this.station.removeSource(TodoStore);
	},
	render: function() {
		var todoItems = this.state.todos.map(function(todo){
			return <TodoItem todo={todo} />
		});
		return ( 
			<div>
				<ul>
					{todoItems}
				</ul>
				<TodoInput />
			</div>
		);
	}

});

module.exports = TodoApp;