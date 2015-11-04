/** @jsx React.DOM */
define([
	'react', 'map/WidgetsController'
], function (React, WidgetsController) {
	'use strict';

	var TreeNode = React.createClass({displayName: "TreeNode",
		/* jshint ignore:start */
		getInitialState: function () {
	    return {
	      collapsed: this.props.node.collapsed || false
	    };
	  },

	  /**
	  * Update the state of the component to hide or show the children
	  */
	  handleClick: function (evt) {

	  	if (this.props.node.disabled) {
	  		return;
	  	}

	    this.setState({
	      collapsed: !this.state.collapsed
	    });
	  },

	  showHelp: function(evt) {
	  	if (evt.target.dataset) {
	  		if (evt.target.dataset.reactid.indexOf("community") > 0) {
		  		evt.target.id = "community-lands-help";
		  	}
		} else {
			var reactid = evt.target.getAttribute("data-reactid");
		  	if (reactid.indexOf("community") > 0) {
		  		evt.target.id = "community-lands-help";
		  	}
		}

	  	WidgetsController.showHelp(evt);
      },

	  // handleInfo: function (evt) {
	  // 	<span visible={this.props.node.info || false} className='tree-node-info' onClick={this.handleInfo}>{node.info}</span>
	  // },

	  render: function() {
	    var containerClass = this.state.collapsed ? 'collapsed' : '';
	    var node = this.props.node;
	    var disabled = node.disabled || false;
	    var childNodes;

	    containerClass += (disabled ? 'layerToShow' : '');

	    if (node.children) {
	      childNodes = node.children.map(function (child, index) {
	      	child.disabled = child.disabled || disabled;
	        return (
	          React.createElement("ul", {key: [node.id, index].join('/')}, 
	            React.createElement(TreeNode, {
	              key: node.id, 
	              node: child, 
	              handleChange: this.props.handleChange}
	            )
	          )
	        );
	      }, this);
	    }

	    return (

	      React.createElement("li", {disabled: disabled, className: containerClass}, 

	      	React.createElement("section", {className: "tree-row-content"}, 
		        React.createElement("span", {className: "tree-toggle-symbol", onClick: this.handleClick}, 
		           node.children === undefined ?
		            '' :
		            (this.state.collapsed ? String.fromCharCode(43) : String.fromCharCode(8722))
		          
		        ), 
		        
		        	node.noCheckbox ? null :
		        	React.createElement("input", {
			          type: "checkbox", 
			          checked: node.checked || false, 
			          onChange: this.props.handleChange, 
			          "data-key": node.id}
		         	), 
		        
		         React.createElement("span", {className: node.disabled ? 'tree-node-label-disabled' : 'tree-node-label', onClick: this.handleClick}, node.label), 
					 node.info ?
						React.createElement("span", {id: "indigenous-lands-help", onClick: this.showHelp, className: "help-marker"}): null
					

		      ), 
	        childNodes
	      )
	    );


	  }
		/* jshint ignore:end */
	});

	return TreeNode;

});
