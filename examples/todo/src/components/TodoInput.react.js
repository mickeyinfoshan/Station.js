var TodoAction = require("../TodoAction");

var React = require('react');

var ENTER_KEY_CODE = 13;

var TodoInput = React.createClass({
	getInitialState: function() {
		return {
			value : ""
		};
	},
	_save : function() {
		if(!this.state.value) {
			React.findDOMNode(this.refs.inputBox).focus();
			return;
		}
		TodoAction.create(this.state.value);
		this.setState({
			value : "" 
		});
	},
	_onKeyDown : function(e) {
		if (e.keyCode === ENTER_KEY_CODE) {
      		this._save();
    	}
	},
	_onChange : function(e) {
		this.setState({
			value : e.target.value
		});
	},
	render : function() {
		return (
      <input
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
        ref="inputBox"
      />);
	}

});

module.exports = TodoInput;