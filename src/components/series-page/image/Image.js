import './Image.scss';
import React, { Component } from 'react';

class Image extends Component {

  render() {

    if (this.props.src) {
      return <img className={this.props.className} src={this.props.src} alt={this.props.alt} draggable="false" />
    } else {
      return (
        <div className="backup">
          <img className={`backup__img ${this.props.className}`} src="/not-found.png" alt={this.props.alt} draggable="false" />
          <h3 className="backup__title">
            {this.props.alt}
          </h3>
        </div>
      );
    }
  }
}

export default Image;
