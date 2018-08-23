import React, { Component } from 'react';
import qs from 'qs';

import seriesService from '../../../services/series-service';

class SeriesSearchResultComponent extends Component {

  state = {
    searchResult: undefined,
    searchQuery: undefined,
    genre: undefined
  }

  getQuery() {
    return qs.parse(window.location.search.substr(1));
  }

  updateSearchParameters(query) {
    this.setState({
      searchResult: this.state.searchResult,
      searchQuery: this.props.searchQuery,
      genre: query.genre
    });
  }

  searchParametersChanged(query) {
    return this.state.searchQuery !== this.props.searchQuery ||
      this.state.genre !== query.genre
  }

  componentDidMount() {
    const query = this.getQuery();

    this.updateSearchParameters(query);
    this.updateSearchResults(query);
  }

  componentDidUpdate() {
    const query = this.getQuery();

    if (this.searchParametersChanged(query)) {
      this.updateSearchParameters(query);
      this.updateSearchResults(query);
    }
  }

  updateSearchResults(query) {
    seriesService.searchForSeries({
      searchQuery: this.props.searchQuery,
      genre: query.genre
    }).then(searchResult => {
      this.setState({
        searchResult,
        searchQuery: this.state.searchQuery,
        genre: this.state.genre
      });
    });
  }

  render() {
    let content;

    if (this.state.searchResult) {
      content = this.state.searchResult.map(series =>
        <div key={series.metadata.imdb.title}>{series.metadata.imdb.title}</div>
      );
    } else {
      content = <div>Loading</div>
    }

    return (
      <div className="series-search-result">
        {content}
      </div>
    );
  }
}

export default SeriesSearchResultComponent;