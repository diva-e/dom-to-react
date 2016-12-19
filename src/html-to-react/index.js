import React from 'react';

class Html2React {

  tests = [];

  constructor(tests) {
    this.tests = tests || [];
  }

  prepareChildren(childNodeList, level) {
    const children = Array.prototype.slice.call(childNodeList).map((node, index) =>
      this.prepareNode(node, level + 1, index)
    ).filter(Boolean);
    if (!children.length) return null;
    return children;
  }


  prepareAttributes(node, reactKey) {
    const attributes = {
      key: reactKey,
    };
    if (node.className) attributes.className = node.className;

    Array.prototype.slice.call(node.attributes).map((att) => {
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

  prepareNode(_node, level, index) {
    if (!_node) return null;
    let node = _node;
    const key = `${level}-${index}`;
    const result = [];

    this.tests.forEach((test) => {
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
      case 1: // regular dom-node
        return React.createElement(
          node.nodeName,
          this.prepareAttributes(node, key),
          this.prepareChildren(node.childNodes, level)
        );

      case 3: // textnode
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

      case 8: // html-comment
        // console.info(node.nodeValue.toString());
        return null;

      default:
        // console.warn(`unhandled nodetype ${node.nodeType}`);
        return null;
    }
  }

}

export default Html2React;
