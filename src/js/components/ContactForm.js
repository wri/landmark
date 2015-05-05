/** @jsx React.DOM */
define([
  'react', 'contact/main/config'], function (React, contactConfig) {
  'use strict';

  /* jshint ignore:start */

  var getDefaultState = function() {

    return {
        namePlaceholder: 'Username',
        emailPlaceholder: 'Email',
        subjectPlaceholder: 'Subject',
        messagePlaceholder: 'Message',
        Name: '',
        Email: '',
        Subject: '',
        Message: ''


      };
  }

  var ContactForm = React.createClass({displayName: "ContactForm",

    getInitialState: function() {
      return getDefaultState();
    },

    handleChange: function(event) {
      var newId = event.target.id;
      var newValue = event.target.value;
      var newState = this.state

      newState[newId] = newValue;

      this.setState(newState);
    },

    handleSubmit: function () {
      var self = this;

      $.ajax({
          data: {
            name: this.state.Name,
            email: this.state.Email,
            subject: this.state.Subject,
            userMessage: this.state.Message,

          },
          url: 'js/components/sendEmail.php',
          method: 'POST',
          success: function(msg) {
            self.replaceState(self.getInitialState());
            alert(msg);

          },
          failure: function(err) {
              console.log(err);
          }
      });
        
    },
    
    render: function() {
      var value = this.state.value;
      return (
        React.createElement("div", null, 
          React.createElement("p", null, React.createElement("span", {className: "contact-bold"}, contactConfig.landMark1), contactConfig.landMark1b), 
          React.createElement("div", {className: "contact-bold"}, contactConfig.inTouch), 
          React.createElement("ul", null, 
            React.createElement("li", null, contactConfig.step1, React.createElement("a", {href: "mailto:admin@landmarkmap.org?subject=LandMark"}, contactConfig.step1b)), 
            React.createElement("li", null, contactConfig.step2, 
              React.createElement("label", null, "Name:"), 
              React.createElement("input", {id: "Name", type: "text", placeholder: this.state.namePlaceholder, onChange: this.handleChange, value: this.state.Name}), 
              React.createElement("label", null, "Your E-Mail Address:"), 
              React.createElement("input", {id: "Email", type: "text", placeholder: this.state.emailPlaceholder, onChange: this.handleChange, value: this.state.Email}), 
              React.createElement("label", null, "Subject:"), 
              React.createElement("input", {id: "Subject", type: "text", placeholder: this.state.subjectPlaceholder, onChange: this.handleChange, value: this.state.Subject}), 
              React.createElement("label", null, "Message:"), 
              React.createElement("input", {id: "Message", type: "text", placeholder: this.state.messagePlaceholder, onChange: this.handleChange, value: this.state.Message}), 
              React.createElement("button", {onClick: this.handleSubmit}, contactConfig.submit)
            ), 
            React.createElement("li", null, contactConfig.step3, React.createElement("a", {href: "http://www.twitter.com"}, contactConfig.step3b), contactConfig.step3c, React.createElement("a", {href: "http://www.facebook.com"}, contactConfig.step3d))
          )
          
        )

      );
    }

  });

  return function (data, node) {
    return React.render(React.createElement(ContactForm, null), document.getElementById(node));
  }

  /* jshint ignore:end */

});