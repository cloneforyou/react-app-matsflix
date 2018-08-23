import React, { Component } from 'react';
import { throttle } from 'throttle-debounce';

import chromecastService from '../../../services/chromecast-service';
import {MediaPlayerControlsComponent} from 'react-component-media-player-controls';
import ChromecastQueueComponent from './ChromecastQueueComponent';

class ChromecastDetailsComponent extends Component {

  mediaPlayerComponentOptions = {
    tickTimeForwardAutomatically: true,
    onMute: () => { chromecastService.mute(this.props.chromecast.name).then((volumeStatus) => this.props.onVolumeUpdate(volumeStatus)); },
    onUnmute: () => { chromecastService.unmute(this.props.chromecast.name).then((volumeStatus) => this.props.onVolumeUpdate(volumeStatus)); },
    onPlay: () => { chromecastService.play(this.props.chromecast.name).then((playerStatus) => this.props.onNewPlayerStatus(playerStatus)); },
    onPause: () => { chromecastService.pause(this.props.chromecast.name).then((playerStatus) => this.props.onNewPlayerStatus(playerStatus)); },
    onStepBackward: () => { },
    onStepForward: () => { },

    onSeek: throttle(500, (currentTime) => {
      chromecastService.seek(this.props.chromecast.name, currentTime)
        .then((playerStatus) => this.props.onNewPlayerStatus(playerStatus, true))
    }),

    onChangeVolume: throttle(300, (volume) => {
      chromecastService.setVolume(this.props.chromecast.name, volume / 100).then((volume) => this.props.onVolumeUpdate(volume));
    })
  }

  getMediaPlayerComponentProps = () => {
    const clientStatus = this.props.clientStatus;
    const playerStatus = this.props.playerStatus;

    return {
      volume: clientStatus ? Math.round(clientStatus.volume.level * 100) : 0,
      isMuted: clientStatus ? clientStatus.volume.muted : false,
      currentTime: playerStatus ? Math.round(playerStatus.currentTime) : 0,
      duration: playerStatus ? Math.round(playerStatus.media.duration) : 0,
      isPlaying: playerStatus ? playerStatus.playerState === 'PLAYING' : false,
      isPaused: playerStatus ? playerStatus.playerState === 'PAUSED' : false,
      isBuffering: playerStatus ? playerStatus.playerState === 'BUFFERING' : false,
      title: playerStatus ? playerStatus.media.metadata.title : ''
    };
  }

  render() {
    let mediaPlayerComponent;
    let chromecastQueueComponent;

    if (this.props.playerStatus && this.props.playerStatus.media) {
      console.log(JSON.stringify(this.getMediaPlayerComponentProps(), null, 4));

      mediaPlayerComponent = <MediaPlayerControlsComponent options={this.mediaPlayerComponentOptions} {...this.getMediaPlayerComponentProps()} />;
      chromecastQueueComponent = (
        <div>
          <h3>Playback Queue</h3>
          <ChromecastQueueComponent chromecast={this.props.chromecast} playerStatus={this.props.playerStatus} onNewPlayerStatus={this.props.onNewPlayerStatus} />
        </div>
      );
    }

    return (
      <div>
        <h1>{this.props.chromecast.name}@{this.props.chromecast.host}:{this.props.chromecast.port}</h1>
        {chromecastQueueComponent}
        {mediaPlayerComponent}
      </div>
    );
  }
}

export default ChromecastDetailsComponent;