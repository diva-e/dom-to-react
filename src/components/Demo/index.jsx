import React, { Component } from 'react';
import Dom2React from '../../dom-to-react';
import DemoChild from './DemoChild';

class Demo extends Component {

  render() {

    const d2r = new Dom2React([
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'div' && node.className.indexOf('root') >= 0),
        modify: (node, key, level) => {
          node.className = 'a-class-added';
          return node;
        },
      },
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'div' && node.className.indexOf('delete-me') >= 0),
        action: (node, key, level) => {
          console.info('`delete-me` removed');
          return null;
        },
      },
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'img'),
        modify: (node, key, level) => {
          return <DemoChild headline="this will" text="not work" />;
        },
      },
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'ul' && node.className.indexOf('wannabe-ol') >= 0),
        modify: (node, key, level) => {
          const ol = document.createElement('ol');
          const children = [...node.childNodes];
          children.map(child => (ol.appendChild(child)));
          return ol;
        }
      },
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'div' && node.className.indexOf('demo-child-json') >= 0),
        action: (node, key, level) => {

          const childNodes = [].slice.call(node.childNodes);
          let props = false;
          try {
            props = childNodes.map(childNode => ((childNode.nodeType === 8) ? JSON.parse(childNode.nodeValue) : false)).filter(Boolean).pop();
          } catch (er) {
            return <p key={key}>{er.toString()}</p>;
          }
          return <DemoChild key={key} text={props.text} headline={props.headline} />;
        }
      },
      {
        condition: (node, key) => (node.nodeName.toLowerCase() === 'div' && node.className.indexOf('demo-child-html') >= 0),
        action: (node, key, level) => {
          const texts = node.innerText.split('\n');
          const headline = node.querySelector('h2').innerText;
          const restText = node.querySelector('p').innerText;
          return <DemoChild key={key} text={restText} headline={headline} />;
        }
      }
    ]);

    return (
      <div>
        {d2r.prepareNode(this.props.dom, 0, 0)}
      </div>
    );
  }
}

export default Demo;
