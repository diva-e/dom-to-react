import React from 'react';
import Dom2react from '.';
import renderer from 'react-test-renderer';

const consoleWarnSpy = jest.spyOn(global.console, 'warn');

beforeEach(() => {
  jest.clearAllMocks();
});

// Setup of test-DOM
document.body.innerHTML = `
<div class="simple-p">
  <p>A simple p-tag</p>
</div>
<div class="ul-li">
  <ul>
    <li>List Item</li>
    <li>List Item</li>
  </ul>
</div>
<div class="ul-li-warn">
  <ul>
    This text is illegal
    <li>This is okay</li>
  </ul>
</div>
<div class="comment">
  <!-- the comment -->
</div>
<div class="add-a-class">
  <div>Div</div>
  <p>Paragraph</p>
  <div>Div</div>
  <p>Paragraph</p>
</div>
<div class="delete-one">
  <div class="delete-me"></div>
  <div class="dont-delete-me"></div>
</div>
<div class="init-component">
  <!-- {
    "key": "value"
  }-->
</div>
`;


test('d2r renders a simple p-tag without error', () => {
  const d2r = new Dom2react();
  const rootNode = document.querySelector('.simple-p');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});

test('d2r renders a list and removes whitespace', () => {
  const d2r = new Dom2react();
  const rootNode = document.querySelector('.ul-li');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});


test('d2r emits a whitespace warning', () => {
  const d2r = new Dom2react();
  const rootNode = document.querySelector('.ul-li-warn');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(1);
});


test('d2r ignores a html comment', () => {
  const d2r = new Dom2react();
  const rootNode = document.querySelector('.comment');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});

test('d2r adds \'a-class-added\' to all divs', () => {
  const d2r = new Dom2react([
    {
      condition: node => (
        node.nodeName.toLowerCase() === 'div'
      ),
      modify: (node) => {
        node.classList.add('a-class-added');
        return node;
      },
    }
  ]);
  const rootNode = document.querySelector('.add-a-class');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});

test('d2r removes a div with a special classname', () => {
  const d2r = new Dom2react([
    {
      condition: node =>(
        node.classList &&
        node.classList.contains('delete-me')
      ),
      action: () => (null),
    }
  ]);
  const rootNode = document.querySelector('.delete-one');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});

test('d2r changes a ul to a ol', () => {
  const d2r = new Dom2react([
    {
      condition: node => (
        node.nodeName.toLowerCase() === 'ul'
      ),
      modify: node => {
        const ol = document.createElement('ol');
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          ol.appendChild(node.childNodes[i]);
        }
        return ol;
      }
    }
  ]);
  const rootNode = document.querySelector('.ul-li');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});

test('d2r initializes a react component', () => {
  const SimpleComponent = (props) => (
    <pre>
      { JSON.stringify(props.text, null, 2) }
    </pre>
  );
  const d2r = new Dom2react([
    {
      condition: node => (
        node.nodeType === 8
      ),
      action: (node, key) => {
        return (
          <SimpleComponent key={key} text={node.nodeValue} />
        );
      }
    }
  ]);
  const rootNode = document.querySelector('.init-component');
  const component = renderer.create(d2r.prepareNode(rootNode));
  expect(component.toJSON()).toMatchSnapshot();
  expect(consoleWarnSpy).toBeCalledTimes(0);
});
