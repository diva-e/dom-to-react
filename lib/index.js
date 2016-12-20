'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dom2React = function () {
  function Dom2React(tests) {
    _classCallCheck(this, Dom2React);

    this.tests = tests || [];
  }

  _createClass(Dom2React, [{
    key: 'prepareChildren',
    value: function prepareChildren(childNodeList, level) {
      var _this = this;

      var children = Array.prototype.slice.call(childNodeList).map(function (node, index) {
        return _this.prepareNode(node, level + 1, index);
      }).filter(Boolean);
      if (!children.length) return null;
      return children;
    }
  }, {
    key: 'prepareAttributes',
    value: function prepareAttributes(node, reactKey) {
      var attributes = {
        key: reactKey
      };
      if (node.className) attributes.className = node.className;

      Array.prototype.slice.call(node.attributes).map(function (att) {
        switch (att.name) {
          case 'class':
          case 'style':
            break;
          case 'checked':
          case 'selected':
          case 'disabled':
          case 'autoplay':
          case 'controls':
            attributes[att.name] = att.name;
            break;
          default:
            attributes[att.name] = att.value;
        }
        return null;
      });
      return attributes;
    }
  }, {
    key: 'prepareNode',
    value: function prepareNode(_node, level, index) {
      if (!_node) return null;
      var node = _node;
      var key = level + '-' + index;
      var result = [];

      this.tests.forEach(function (test) {
        if (test.condition(node, key)) {
          if (typeof test.modify === 'function') {
            node = test.modify(node, key, level);
            if (!(node instanceof Node)) {
              node = _node;
              console.warn('The `modify`-method always must return a valid DomNode (instanceof Node) - your modification will be ignored (Hint: if you want to render a React-component, use the `action`-method instead)');
            }
          }
          if (typeof test.action === 'function') {
            result.push(test.action(node, key, level));
          }
        }
      });

      if (result.length) return result;

      switch (node.nodeType) {
        case 1:
          // regular dom-node
          return _react2.default.createElement(node.nodeName, this.prepareAttributes(node, key), this.prepareChildren(node.childNodes, level));

        case 3:
          // textnode
          if (!node.parentNode) return node.nodeValue.toString();
          switch (node.parentNode.nodeName.toLowerCase()) {
            case 'table':
            case 'thead':
            case 'tbody':
            case 'tfoot':
            case 'tr':
              return null;
            default:
              return node.nodeValue.toString();
          }

        case 8:
          // html-comment
          // console.info(node.nodeValue.toString());
          return null;

        default:
          // console.warn(`unhandled nodetype ${node.nodeType}`);
          return null;
      }
    }
  }]);

  return Dom2React;
}();

exports.default = Dom2React;