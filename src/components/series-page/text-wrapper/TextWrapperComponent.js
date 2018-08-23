import './TextWrapperComponent.scss';
import React, { Component } from 'react';

class TextWrapperComponent extends Component {

  state = {
    visible: false
  }

  onClickToggleText() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const toggleButtonModifiers = [];
    const text = this.props.text;
    let displayText;
    let toggleButtonText;

    if (this.state.open) {
      toggleButtonModifiers.push('text-wrapper__toggle-button--visible');
    } else {
      toggleButtonModifiers.push('text-wrapper__toggle-button--hidden');
    }

    if (!text) {
      toggleButtonText = '';
      displayText = this.props.noText || 'No text';
    } else if (text.length > 100 && !this.state.visible) {
      toggleButtonText = 'show more';
      displayText = `${text.substr(0, 100)}...`;
    } else {
      toggleButtonText = 'show less';
      displayText = text;
    }

    return (
      <div className="text-wrapper">
        <span className="text-wrapper__text">{displayText}</span>
        <span>&nbsp;</span>
        <span className={`text-wrapper__toggle-button ${toggleButtonModifiers}`} onClick={(e) => this.onClickToggleText(e)}>
          <i>{toggleButtonText}</i>
        </span>
      </div>
    );
  }
}

export default TextWrapperComponent;
