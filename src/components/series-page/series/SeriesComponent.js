import './SeriesComponent.scss';

import React, { Component } from 'react';
import qs from 'qs';

import PagedCategoryListComponent from '../paged-category-list/PagedCategoryListComponent';
import SeriesSearchResultComponent from '../series-search-result/SeriesSearchResultComponent';
import genreService from '../../../services/genre-service';
import seriesService from '../../../services/series-service';
import searchFocusEmitter, { EVENT_BLUR, EVENT_FOCUS } from '../../../emitters/search-focus-emitter';

class SeriesComponent extends Component {

  state = {
    searchQuery: '',
    queriedGenre: undefined,
    series: [],
    genres: [],
  }

  pagedCategoryListOptions = {
    getCategoryItems: (category) => {
      return seriesService.getTop5SeriesByGenre(category).then(allSeries => {
        return allSeries.map(series => {
          return {
            fileName: series.fileName,
            title: series.metadata.imdb.title,
            imageUrl: series.metadata.imdb.poster
          };
        });
      });
    },

    getCategoryLink: (category) => {
      return `${window.location.pathname}?genre=${category}`
    },

    getItemLink: (category, item) => {
      return `${window.location.pathname}/${item.fileName}`;
    }
  }

  getQueriedGenre() {
    if (window.location.search) {
      return qs.parse(window.location.search.substr(1)).genre || undefined;
    }

    return null;
  }

  componentWillMount() {
    this.props.appState.setTitle('MATSFLIX');
  }

  componentDidMount() {
    this.onMountOrUpdate();
  }

  componentDidUpdate() {
    this.onMountOrUpdate();
  }

  onMountOrUpdate() {
    const queriedGenre = this.getQueriedGenre();

    if (queriedGenre !== this.state.queriedGenre) {
      this.updateQueriedGenre(queriedGenre);

      if (!queriedGenre) {
        this.loadAllGenres();
      }
    }
  }

  updateQueriedGenre(queriedGenre) {
    this.setState({
      searchQuery: this.state.searchQuery,
      queriedGenre,
      series: this.state.series,
      genres: this.state.genres,
    });
  }

  loadAllGenres() {
    genreService.getGenresForSeries().then(genres => {
      this.setState({
        searchQuery: this.state.searchQuery,
        queriedGenre: this.state.queriedGenre,
        series: [],
        genres
      });
    });
  }

  onTextSearchChanged(event) {
    this.setState({
      searchQuery: event.target.value,
      queriedGenre: this.state.queriedGenre,
      series: this.state.series,
      genres: this.state.genres
    });
  }

  onTextSearchFocus() {
    searchFocusEmitter.emit(EVENT_FOCUS);
  }

  onTextSearchBlur() {
    searchFocusEmitter.emit(EVENT_BLUR);
  }

  render() {
    let content;

    if (this.state.queriedGenre) {
      content = <div>
        <h2>{this.state.queriedGenre}</h2>
        <SeriesSearchResultComponent searchQuery={this.state.searchQuery} />
      </div>
    } else if (this.state.searchQuery) {
      content = <SeriesSearchResultComponent searchQuery={this.state.searchQuery} />
    } else {
      content = <PagedCategoryListComponent categories={this.state.genres} options={this.pagedCategoryListOptions} />;
    }

    return (
      <div className="matsflix">
        <input className="matsflix__search"
          type="text"
          placeholder="Search here :D"
          value={this.state.searchQuery}
          onChange={(e) => this.onTextSearchChanged(e)}
          onFocus={(e) => this.onTextSearchFocus(e)}
          onBlur={(e) => this.onTextSearchBlur(e)} />

        {content}
      </div>
    );
  }
}

export default SeriesComponent;
