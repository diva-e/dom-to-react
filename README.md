# Dom to React 

`dom-to-react` is a replacement for React's own method `dangerouslySetInnerHTML`. 

It lets you build a React structure from a regular HTML-Dom.
Your React application is aware of all elements wthin the added DOM, and it even lets you initialize your own React components anywhere inside that structure.

dom-to-react is very lightweight. It does not use any further third party modules.


## How to install

Use npm (or your preferred package manager)
```shell-script
npm install --save-dev dom-to-react
```

## Simple usage

It takes a regular Dom-Node as entrypoint from which it creates the according React-elements (by calling `React.createElement()`) recursively. So the simplest way is:

```html
<main id="app">
  <div class="content-to-render">
    <p>A Paragraph</p>
  </div>
</main>
```
 
```javascript
import Dom2react from 'dom-to-react';
import React from 'react';
import { render } from 'react-dom';

const d2r = new Dom2react();
const rootNode = document.querySelector('.content-to-render');

render(d2r.prepareNode(rootNode), document.querySelector('#app'));
```
This will create the initial DOM structure, but now all elements are React elements.
Easy, isn't it?

## Advanced usage

when creating an instance of Dom2React, a configuration can be provided which allows to manipulate and handle the original DOM:

```javascript
const d2r = new Dom2react(options);
```

where `options` is an array with instruction objects with each 2-3 callback functions
all the functions are being passed the following params:

 * `@param {node}` the node being tested/manipulated
 * `@param {key}` the React-key which would be assigned when the node renders (always in the format `${level}-${index}`)
 * `@param {level}` the level how deep in the DOM the nod is nested (an integer)

```javascript
var options = [
  {
	 // If this function returns true, the two following functions are called as long as they are defined
	 // This function must always return true or false
  	'condition': function(node, key) { return node.nodeName.toLowerCase() === 'div'; },

	// This function can be used for easy manipulations to the node, e.g. for removing or adding attributes
	// This function must always return a DOM-Node (even if it's a new one created by document.createElement)
	'modify':  function(node, key, level) { return document.createElement('div'); },

	//This function is used to inject your own components into the parsed DOM
	// This function must return an object which can be rendered by React (a react element or null)
	'action':  function(node, key, level) { return React.createElement('div'); }
  }
];
```

## Example instructions

#### Add a class to all `div`'s:
```javascript
{
  condition: function(node, key, level) { return node.nodeName.toLowerCase() === 'div';} ),
  modify: function(node, key, level) {
    node.className += ' a-class-added';
    return node;
  }
}
```

#### Remove all `div`'s with a certain class:
```javascript
{
  condition: function(node, key, level) { return node.className.indexOf('delete-me') >= 0;} ),
  action: function(node, key, level) {
    return null;
  }
}
```

#### Initialize a react component for all nodes of a certain type (e.g. the [react-markdown](https://www.npmjs.com/package/react-markdown)-component):
```javascript
{
  condition: function(node, key, level) return {node.nodeName.toLowerCase() === 'pre'},
  action: function(node, key, level) {
    return <ReactMarkdown key={key} source={node.innerText} />;
  }
}
```

#### transform one node-type into another (e.g. ul=>ol) but preserve all childnodes:
```javascript
{
  condition: function(node, key, level) { return node.nodeName.toLowerCase() === 'ul'},
  modify: function(node, key, level) {
    var ol = document.createElement('ol');
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      ol.appendChild(node.childNodes[i]);
    }
    return ol;
  }
}
```

#### Initialize a more complex component with an object parsed from a JSON within a HTML comment. (That's actually what I used this for :+1:)

```html
<div class="complex-component">
<!-- { ...complex JSON-object } -->
</div>
```

```javascript
{
  condition: function(node, key, level) { return node.className.indexOf('complex-component') >= 0;},
  action: function(node, key, level) {
    var props = false;
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      if (childNode.nodeType === 8) {
      	props = JSON.parse(childNode.nodeValue);
      }
    }
    return <ComplexComponent {...props} />;
  }
}
```

## Demo
To see the included demo in action, clone/download this repo and

```shell-script
npm i
npm run start
```
and open
```
http://localhost:8080/
```
