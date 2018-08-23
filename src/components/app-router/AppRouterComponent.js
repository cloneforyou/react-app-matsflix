import './AppRouterComponent.scss';

import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import ChromecastDetailsComponent from '../chromecast-page/chromecast-details/ChromecastDetailsComponent';
import SeriesComponent from '../series-page/series/SeriesComponent';
import SeriesDetailsComponent from '../series-page/series-details/SeriesDetailsComponent';
import EpisodeDetailsComponent from '../series-page/episode-details/EpisodeDetailsComponent';

class AppRouterComponent extends Component {

  render() {
    return (
      <div className="media-component">
        <div className="media-component__router-outlet">
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/media/series" />} />
            <Route path="/media" exact render={() => <Redirect to="/media/series" />} />
            <Route path="/media/series" exact render={(props) => <SeriesComponent {...props} appState={this.props.appState} />} />
            <Route path="/media/series/:series" exact render={(props) => <SeriesDetailsComponent {...props} appState={this.props.appState} />} />
            <Route path="/media/series/:series/seasons/:season/episodes/:episode" exact render={(props) =>
              <EpisodeDetailsComponent {...this.props} {...props} appState={this.props.appState} />} />

            <Route path="/media/chromecasts/:chromecastName" exact
              render={() => <ChromecastDetailsComponent {...this.props} appState={this.props.appState} />} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default AppRouterComponent;
