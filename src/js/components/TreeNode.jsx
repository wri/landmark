/** @jsx React.DOM */
define([
	'react', 'map/WidgetsController'
], function (React, WidgetsController) {
	'use strict';

	var TreeNode = React.createClass({
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
	  // 	debugger;
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
	          <ul key={[node.id, index].join('/')}>
	            <TreeNode
	              key={node.id}
	              node={child}
	              handleChange={this.props.handleChange}
	            />
	          </ul>
	        );       
	      }, this);
	    }

	    return (
	      <li hidden={disabled} className={containerClass}>
	      	<section className='tree-row-content'>
		        <span className='tree-toggle-symbol' onClick={this.handleClick} >
		          { node.children === undefined ? 
		            '' :
		            (this.state.collapsed ? String.fromCharCode(43) : String.fromCharCode(8722))
		          }
		        </span>
		        {
		        	node.noCheckbox ? null : 
		        	<input 
			          type='checkbox' 
			          checked={node.checked || false}
			          onChange={this.props.handleChange}
			          data-key={node.id}
		         	/>
		        }
		         <span className='tree-node-label' onClick={this.handleClick}>{node.label}</span>
					{ node.info ? 
						<span id='indigenous-lands-help' onClick={this.showHelp} className='help-marker'></span>: null
					}		        
		        
		      </section>
	        {childNodes}
	      </li>
	    );

	    
	  }
		/* jshint ignore:end */
	});

	return TreeNode;

});