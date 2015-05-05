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

  var ContactForm = React.createClass({

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
        <div>
          <p><span className='contact-bold'>{contactConfig.landMark1}</span>{contactConfig.landMark1b}</p>
          <div className='contact-bold'>{contactConfig.inTouch}</div>
          <ul>
            <li>{contactConfig.step1}<a href='mailto:admin@landmarkmap.org?subject=LandMark'>{contactConfig.step1b}</a></li>
            <li>{contactConfig.step2}
              <label>Name:</label>
              <input id='Name' type="text" placeholder={this.state.namePlaceholder} onChange={this.handleChange} value={this.state.Name}/>
              <label>Your E-Mail Address:</label>
              <input id='Email' type="text" placeholder={this.state.emailPlaceholder} onChange={this.handleChange} value={this.state.Email} />
              <label>Subject:</label>
              <input id='Subject' type="text" placeholder={this.state.subjectPlaceholder} onChange={this.handleChange} value={this.state.Subject} />
              <label>Message:</label>
              <input id='Message' type="text" placeholder={this.state.messagePlaceholder} onChange={this.handleChange} value={this.state.Message} />
              <button onClick={this.handleSubmit} >{contactConfig.submit}</button>
            </li>
            <li>{contactConfig.step3}<a href='http://www.twitter.com'>{contactConfig.step3b}</a>{contactConfig.step3c}<a href='http://www.facebook.com'>{contactConfig.step3d}</a></li>
          </ul>
          
        </div>

      );
    }

  });

  return function (data, node) {
    return React.render(<ContactForm />, document.getElementById(node));
  }

  /* jshint ignore:end */

});