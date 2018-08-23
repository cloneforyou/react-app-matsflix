import './SeriesDetailsComponent.scss';

import React, { Component } from 'react';

import PagedCategoryListComponent from '../paged-category-list/PagedCategoryListComponent';
import ImdbInfoComponent from '../imdb-info/ImdbInfoComponent';
import seriesService from '../../../services/series-service';

class SeriesDetailsComponent extends Component {

  state = {
    series: undefined,
    seasons: []
  }

  pagedCategoryListOptions = {

    getCategoryItems: (category) => {
      return seriesService.getEpisodesInSeason(this.props.match.params.series, category).then(episodes => {
        return episodes.map(episode => {
          return {
            fileName: episode.id,
            title: episode.id,
            imageUrl: ''
          };
        })
      });
    },

    getCategoryLink: (category) => {
      return `${window.location.pathname}/seasons/${category}`;
    },

    getItemLink(category, item) {
      return `${window.location.pathname}/seasons/${category}/episodes/${item.fileName}`;
    }
  }


  componentDidMount() {
    this.props.appState.loadStart();
    Promise.all([
      seriesService.getSeries(this.props.match.params.series).then(series => {
        this.setState({
          series,
          seasons: this.state.seasons
        });
      }),

      seriesService.getSeasonsInSeries(this.props.match.params.series).then(seasons => {
        this.setState({
          series: this.state.series,
          seasons
        });
      })
    ]).then(() => {
      this.props.appState.loadStop();
    }).catch(() => {
      this.props.appState.loadStop();
    });
  }

  render() {

    if (!this.state.seasons) {
      return <div>Loading</div>
    }

    let descriptionComponent;

    if (this.state.series && this.state.series.metadata.imdb) {
      descriptionComponent = <ImdbInfoComponent info={this.state.series.metadata.imdb} />
    } else if (this.state.series) {
      return (
        <div>
          <h2>{this.state.series.fileName}</h2>
        </div>
      );
    }
    else {
      descriptionComponent = (
        <div>
          <h2>Loading</h2>
        </div>
      );
    }

    return (
      <div className="series-details">
        {descriptionComponent}

        <PagedCategoryListComponent categories={this.state.seasons.map(season => season.name)} options={this.pagedCategoryListOptions} />
      </div>
    );
  }
}

export default SeriesDetailsComponent;
