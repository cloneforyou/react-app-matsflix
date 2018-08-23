import './PagedCategoryListItemComponent.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Image from '../image/Image';

class PagedCategoryListItemComponent extends Component {

  state = {
    items: [],
    loading: false
  }

  dragging = false

  componentDidMount() {
    this.setState({
      loading: true,
      items: []
    });

    this.props.options.getCategoryItems(this.props.category).then(items => {
      this.setState({
        items,
        loading: false
      });
    });
  }

  render() {

    let content;
    const sliderSettings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      arrows: false,
      center: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        }
      ],
      beforeChange: () => this.dragging = true,
      afterChange: () => this.dragging = false
    }

    if (this.state.loading) {
      content = <div>Loading...</div>;
    } else {
      content = <Slider {...sliderSettings}>
        {this.state.items.map(item =>
          <div key={item}>
            <Link className="slider__link"
              to={this.props.options.getItemLink(this.props.category, item)}
              draggable="false"
              onClick={(e) => this.dragging && e.preventDefault()}>

              <Image className="slider__link__image" src={item.imageUrl} alt={item.title} />
            </Link>
          </div>
        )}
      </Slider>;
    }

    return (
      <div className="paged-category-list-item">
        <h2 className="paged-category-list-item__category">
          <Link to={this.props.options.getCategoryLink(this.props.category)}>
            {this.props.category}
          </Link>
        </h2>
        {content}
      </div>
    );
  }
}

export default PagedCategoryListItemComponent;
