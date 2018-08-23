import './ImdbInfoComponent.scss';

import moment from 'moment';
import React, { Component } from 'react';

import Image from '../image/Image';
import TextWrapperComponent from '../text-wrapper/TextWrapperComponent';

class ImdbInfoComponent extends Component {

  render() {
    console.log(this.props.info);
    const info = this.props.info;
    const formattedReleaseDate = moment(info.releaseDate).format('YYYY');

    return (
      <div className="imdb-info">

        <div className="imdb-info__content">
          <h2 className="imdb-info__title">
            <span>{info.title}</span>
            <span>&nbsp;</span>
            <span>({formattedReleaseDate})</span>
          </h2>
          <div className="imdb-info__stats">
            <div className="imdb-info__stats__generic">
              <span>{info.runtime}</span>
              <span>&nbsp;|&nbsp;</span>
              <span>{info.genres.join(', ')}</span>
            </div>
            <div className="imdb-info__stats__rating">
              <span><i className="fa fa-star" /></span>
              <span>{info.rating}</span>
              <span>/10</span>
              <span>&nbsp;</span>
              <span>({info.votes} votes)</span>
            </div>
          </div>
          <div className="imdb-info__plot">
            <TextWrapperComponent text={info.plot} noText="No plot description available" />
          </div>
        </div>
        <div className="imdb-info__image">
          <Image src={info.poster} alt={info.title} />
        </div>
      </div>
    );
  }
}

export default ImdbInfoComponent;
