import './App.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.css';
import '../../services/chromecast-web-socket-service';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import AppRouter from '../app-router/AppRouterComponent';
import ChromecastSelectorComponent from '../chromecast-selector/ChromecastSelectorComponent';
import chromecastWebSocketService from '../../services/chromecast-web-socket-service';
import chromecastService from '../../services/chromecast-service'

const DEFAULT_TITLE = 'MM-Cent';

class App extends Component {

  state = {
    loading: false,
    chromecast: undefined,
    clientStatus: undefined,
    playerStatus: undefined,
    title: DEFAULT_TITLE
  }

  onVolumeUpdate = debounce(2000, (volume) => {
    if (this.state.clientStatus) {
      this.setState({
        ...this.state,
        clientStatus: {
          ...this.state.clientStatus,
          volume
        }
      });
    } else {
      this.setState({
        ...this.state,
        clientStatus: {
          volume
        }
      });
    }
  })

  onNewClientStatus = (clientStatus) => {
    this.setState({
      ...this.state,
      clientStatus
    });
  }

  carefulMergePlayerStatus(playerStatus) {
    console.log('Careful merge, we dont want to overwrite items now');
    const newItems = playerStatus.items;
    const prevItems = this.state.playerStatus.items;
    const items = prevItems
      .filter(prevItem => newItems.find(newItem => newItem.itemId === prevItem.itemId))
      .map(prevItem => {
        return {
          ...prevItem,
          ...newItems.find(newItem => newItem.itemId === prevItem.itemId)
        };
      });

    this.setState({
      ...this.state,
      playerStatus: {
        ...this.state.playerStatus,
        ...playerStatus,
        items
      }
    });
  }

  mergePlayerStatus(playerStatus) {
    console.log('Merging new player state with previous state');

    this.setState({
      ...this.state,
      playerStatus: {
        ...this.state.playerStatus,
        ...playerStatus
      }
    });
  }

  overwritePlayerStatus(playerStatus) {
    console.log('Overwriting whole player state');
    this.setState({
      ...this.state,
      playerStatus
    });
  }

  onNewPlayerStatus = (playerStatus) => {
    const newItems = playerStatus.items;
    if (newItems) {
      if (newItems.find(item => !item.media)) {
        this.carefulMergePlayerStatus(playerStatus);
      } else {
        this.overwritePlayerStatus(playerStatus);
      }
    } else if (playerStatus.playerState === 'IDLE') {
      this.overwritePlayerStatus(playerStatus);
    } else {
      this.mergePlayerStatus(playerStatus);
    }
  }

  onNewPlayerStatusMerge = (playerStatus) => {
    this.onNewPlayerStatus(playerStatus);
  }

  componentWillMount() {
    const chromecastName = 'Stue'; // Todo <-- fix

    chromecastService.getChromecast(chromecastName).then((chromecast) => {
      this.setState({
        ...this.state,
        chromecast
      });

      return Promise.all([
        chromecastService.getClientStatus(chromecastName).then(clientStatus => {
          this.setState({
            ...this.state,
            clientStatus
          });

          chromecastWebSocketService.on('STATUS_CLIENT', this.onNewClientStatus);
        }),

        chromecastService.getPlayerStatus(chromecastName).then(playerStatus => {
          this.setState({
            ...this.state,
            playerStatus
          });

          chromecastWebSocketService.on('STATUS_PLAYER', this.onNewPlayerStatusMerge);
        }).catch(err => {
          console.log(err);
        })
      ]);
    });
  }

  componentWillUnmount() {
    chromecastWebSocketService.off('STATUS_CLIENT', this.onNewClientStatus);
    chromecastWebSocketService.off('STATUS_PLAYER', this.onNewPlayerStatusMerge);
  }

  onChangeChromecast(chromecastName) {
    chromecastService.getChromecast(chromecastName).then((chromecast) => {
      this.setState({
        ...this.state,
        chromecast
      });
    });
  }

  appState = {
    loadStart: () => {
      this.setState({
        ...this.state,
        loading: true
      })
    },

    loadStop: () => {
      this.setState({
        ...this.state,
        loading: false
      })
    },

    setTitle: (title) => {
      this.setState({
        ...this.state,
        title: title
      });

      document.title = title;
    },

    resetTitle: () => this.appState.setTitle(DEFAULT_TITLE)
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__header__title"><Link to="/">{this.state.title}</Link></h1>
          <div className="app__header__chromecast-info">
            <ChromecastSelectorComponent {...this.state} onChangeChromecast={this.onChangeChromecast} />
          </div>
        </header>
        <div className="app__media-component">
          <AppRouter {...this.state} onNewPlayerStatus={this.onNewPlayerStatus} appState={this.appState} />
        </div>
      </div>
    );
  }
}

export default App;
