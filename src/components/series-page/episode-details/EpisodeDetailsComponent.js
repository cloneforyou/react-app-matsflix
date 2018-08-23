import './EpisodeDetailsComponent.scss';
import path from 'path';
import React, { Component } from 'react';
import seriesService from '../../../services/series-service';
import chromecastService from '../../../services/chromecast-service';
import environmentVariables from '../../../environment-variables';

class EpisodeDetailsComponent extends Component {

  state = {
    episode: undefined
  }

  componentDidMount() {
    const params = this.props.match.params;

    this.props.appState.loadStart();
    seriesService.getEpisodeInSeasonInSeries(params.series, params.season, params.episode).then(episode => {
      this.props.appState.loadStop();
      this.setState({
        episode
      });
    }).catch(() => {
      this.props.appState.loadStop();
    });
  }

  onCickAddQueueButton() {
    const media = {
      url: this.getVideoLink(),
      title: this.state.episode.fileName
    };

    let promise;
    if (this.props.playerStatus) {
      promise = chromecastService.queueInsert('Stue', [media]).then();
    } else {
      promise = chromecastService.load('Stue', media).then(this.props.onNewPlayerStatus);
    }

    this.props.appState.loadStart();

    promise.then((playerStatus) => {
      this.props.onNewPlayerStatus(playerStatus);
      this.props.appState.loadStop();
    }).catch(() => {
      this.props.appState.loadStop();
    });
  }

  getVideoLink() {
    return `${environmentVariables.URL_MEDIA_API}${window.location.pathname}/${this.state.episode.fileName}`;
  }

  render() {
    if (!this.state.episode) {
      return <div>Loading</div>
    }

    // const contentType = `video/${path.extname(this.state.episode.fileName).substr(1)}`; // Todo: Find out if this can solve the audio issue

    return (
      <div className="episode-details">
        <div className="episode-details__side-bar">
          <h2>{this.state.episode.id}</h2>
          <div>{this.state.episode.fileName}</div>

          <div className="episode-details__queue-button" title="Add to TV queue" onClick={(e) => this.onCickAddQueueButton(e)}>
            <div className="episode-details__queue-button__plus">
              <i className="fa fa-plus" />
            </div>
            <div className="episode-details__queue-button__tv">
              <i className="fa fa-tv" />
            </div>
          </div>
        </div>
        <video id="videoPlayer" className="episode-details__video-player" controls width="100%">
          <source src={this.getVideoLink()} />
        </video>

        {/* <div className="episode-details__media-player">
          <MediaPlayerComponent />
        </div> */}
      </div>
    );
  }
}

export default EpisodeDetailsComponent;
