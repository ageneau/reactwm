'use strict';

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var WindowModel = require('../models/window');
var ManagerModel = require('../models/manager');
var Window = require('./window');

var Manager = React.createClass({

  statics: {
    Manager: ManagerModel,
    Window: WindowModel
  },

  propTypes: {
    manager: React.PropTypes.instanceOf(ManagerModel).isRequired
  },

  componentDidMount: function () {
    this.manager = this.props.manager;
    this.manager.on('change', this.forceUpdate, this);

    var el = $(ReactDOM.findDOMNode(this));
    this.setState({ offset: el.offset() });
  },

  componentWillUnmount: function () {
    this.manager.off('change', this.forceUpdate);
  },

  getInitialState: function () {
    return {
      offset: {
        top: 0,
        left: 0
      }
    };
  },

  render: function () {

    var windows = this.props.manager.openWindows().map( window =>
      <Window key={window.id} offset={this.state.offset} window={window} />,
      this);

    return (
      /* jshint ignore: start */
      <div className='window-manager'>
        <div className='windows'>{windows}</div>
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Manager;
