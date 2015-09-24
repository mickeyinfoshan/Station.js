var TodoAction = require("../TodoAction");
var React = require('react');

var TodoItem = React.createClass({
	toggleComplete : function() {
		TodoAction.toggleComplete(this.props.todo);
	},
	destroy : function() {
		TodoAction.destroy(this.props.todo);
	},
	render : function() {
		var completeText = "complete it";
		if(this.props.todo.complete) {
			completeText = "completed";
		}
		var completeBtn = <button onClick={this.toggleComplete}>{completeText}</button>
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