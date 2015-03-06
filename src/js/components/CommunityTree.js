/** @jsx React.DOM */
define([
  'react',
  'components/CommunityTreeNode',
  'map/LayerController'
], function (React, CommunityTreeNode, LayerController) {
  'use strict';

  /* jshint ignore:start */

  var CommunityTree = React.createClass({displayName: "CommunityTree",

    getInitialState: function () {
      return {
        data: this.props.data,
        active: ''
      };
    },
    
    /**
    * this.state.data is kind of like a book keeper of the state of the tree, it knows
    * the state of the whole tree and which nodes are checked, may add which nodes are collapsed
    * or not into this.state.data as well
    */
    handleChange: function (evt) {
      var key = evt.target.getAttribute('data-key');

      this.setState({active: key})

      var activeKeys = [];

      if (this.state.data[0].children) {
        for (var i = 0; i < this.state.data[0].children.length; i++) {
          if (this.state.data[0].children[i].id === key) {
            activeKeys.push(key); //TODO: or push i? --> See how layers are put together
          }
        }
        this.state.data = this.state.data[0].children;
      } else {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].id === key) {
            activeKeys.push(i);
          }
        }
      }

      var dataSource = Object.create(this.state.data);

      //dataSource.forEach(traverseNodes);
      // Update the Tree Component
      this.setState({ data: dataSource });
      // Update the Layer UI

      //TODO: Map the activeKey's name to the proper Attribute here, so I can use that variable in the layer's Pop-Up to show the correct attributes --> Require layercontroller in map controller? how to get the react state in the map controller when we are assigning the correct fields in the popup??
      //debugger;
      //Determine whether we are in the National Tree when updating data
      var nationalLayer = this.getDOMNode().dataset.reactid;
      brApp.currentLayer = evt.target['dataset'].key;
      if (nationalLayer === '.1' || nationalLayer === '.2') {
        switch (activeKeys[0]) {
                    case ".1": //Community Land Tenure
                      visibleLayers = [0];
                      break;
                    case ".2": //Indigenous Land Tenure
                      visibleLayers = [1];
                      break;
                    case ".3": //Percent of Community and Indigenous
                      keys[0] += 2; //--> To get around the two Land Tenure Security Layers
                      visibleLayers = keys;
                      break;
                }


      }
      LayerController.updateVisibleLayers(activeKeys, nationalLayer); //TODO When we get data
    },
    
    render: function () {
      return (
        React.createElement("ul", {className: "checkbox-tree"}, 
          this.state.data.map(function (node) {
            return (
              React.createElement(CommunityTreeNode, {
                key: node.id, 
                node: node, 
                handleChange: this.handleChange, 
                active: node.id==this.state.active}
              )
            );
          }, this)
        )
      );
    }

  });

  return function (data, node) {
    return React.render(React.createElement(CommunityTree, {data: data}), document.getElementById(node));
  }

  /* jshint ignore:end */

});