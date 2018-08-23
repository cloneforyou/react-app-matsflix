import './ChromecastSelectorComponent.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DropdownComponent } from 'react-component-dropdown';

import chromecastService from '../../services/chromecast-service';
import chromecastWebsocketService from '../../services/chromecast-web-socket-service';

class ChromecastSelectorComponent extends Component {

  state = {
    chromecasts: [],
    dropdownOpen: false
  }

  onNewChromecastEvent = (chromecasts) => {
    this.setState({
      ...this.state,
      chromecasts
    });
  }

  componentDidMount() {
    chromecastService.getChromecasts().then((chromecasts) => {
      this.setState({
        ...this.state,
        chromecasts,
      });
    }).catch(() => console.log('Not connected to chromecast yet'));

    chromecastWebsocketService.on('NEW_CHROMECAST', this.onNewChromecastEvent);
  }

  componentWillUnmount() {
    chromecastWebsocketService.off('NEW_CHROMECAST', this.onNewChromecastEvent);
  }

  onClickChromecastIcon(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      ...this.state,
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onClickManageButton(e) {
    this.setState({
      ...this.state,
      selectedChromecastName: e.target.value,
      dropdownOpen: false
    });
  }

  onOutsideClick() {
    this.setState({
      ...this.state,
      dropdownOpen: false
    });
  }

  render() {
    let dropdownContent;
    let iconModifiers = [];
    const options = this.state.chromecasts.map(chromecast => {
      return <option key={chromecast.name} value={chromecast.name}>{chromecast.name}</option>
    });

    if (this.props.loading) {
      iconModifiers.push('chromecast-info__icon--loading');
    } else {
      iconModifiers.push('chromecast-info__icon--connected');
    }

    if (this.state.dropdownOpen) {
      iconModifiers.push('chromecast-info__icon--open');
    } else {
      iconModifiers.push('chromecast-info__icon--closed');
    }

    if (this.props.chromecast) {
      dropdownContent = (
        <div>
          <select className="chromecast-info__chromecast-select" value={this.props.chromecast.name} onChange={(e) => this.props.onChangeChromecast(e.target.value)}>
            {options}
          </select>
          <dl className="chromecast-info__chromecast-configuration">
            <dt>ID</dt>
            <dd>{this.props.chromecast.id}</dd>
            <dt>Host</dt>
            <dd>{this.props.chromecast.host}</dd>
            <dt>Port</dt>
            <dd>{this.props.chromecast.port}</dd>
            <dt>Type</dt>
            <dd>{this.props.chromecast.type}</dd>
          </dl>

          <Link type="button"
            className="chromecast-info__queue-button"
            to={`/media/chromecasts/${this.props.chromecast.name}`}
            onClick={(e) => this.onClickManageButton(e)}>

            Manage
            </Link>
        </div>
      );
    } else {
      dropdownContent = (
        <div>Waiting for chromecasts...</div>
      );
    }

    return (
      <div className="chromecast-info">
        <div className={`chromecast-info__icon ${iconModifiers.join(' ')}`} onClick={(e) => this.onClickChromecastIcon(e)}>
          <i className="fa fa-chrome" />
        </div>
        <div className="chromecast-info__dropdown">
          <DropdownComponent dropdownOpen={this.state.dropdownOpen} onOutsideClick={() => this.onOutsideClick()}>
            {dropdownContent}
          </DropdownComponent>
        </div>
      </div>
    );
  }
}

export default ChromecastSelectorComponent;
