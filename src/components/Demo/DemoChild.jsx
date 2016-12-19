import React, { Component } from 'react';
import Html2React from '../../html-to-react';

class DemoChild extends Component {
  render() {
    return (
      <div>
      	&lt;DemoChild&gt;-Component
        <h1 title={this.props.headline}>{this.props.headline}</h1>
        {this.props.text}
      </div>
    );
  }
}

export default DemoChild;
