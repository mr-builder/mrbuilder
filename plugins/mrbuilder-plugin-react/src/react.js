const React     = require('react-internal');
const PropTypes = require('prop-types');

React.PropTypes = PropTypes;
if (!React.createClass) {
    //make lazy to prevent cyclic dependency.
    React.createClass =
        (...v) => (React.createClass = require('create-react-class'))(...v);

}
module.exports = React;
