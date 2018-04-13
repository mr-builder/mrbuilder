const React = require('react-internal');
const PropTypes = require('prop-types');

React.PropTypes = PropTypes;
if (!React.createClass) {
    React.createClass = require('create-react-class');
}
module.exports = React;
