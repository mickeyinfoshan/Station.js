var TodoAction = require("../TodoAction");
var React = require('react');

var TodoItem = React.createClass({
	complete : function() {
		TodoAction.complete(this.props.todo);
	},
	destroy : function() {
		TodoAction.destroy(this.props.todo);
	},
	render : function() {
		var completeBtn = <button onClick={this.complete}>Complete</button>
		if(this.props.todo.complete){
			completeBtn = "Completed";
		}
		return (
			<li>
				{completeBtn}&nbsp;&nbsp;
				{this.props.todo.content}
				<span style={{float:"right"}} onClick={this.destroy}>X</span>
			</li>
		);
	}

});

module.exports = TodoItem;