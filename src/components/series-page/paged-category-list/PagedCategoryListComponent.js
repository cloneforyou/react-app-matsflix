import React, { Component } from 'react';
import PagedCategoryListItemComponent from './PagedCategoryListItemComponent';

class PagedCategoryListComponent extends Component {

  render() {

    const pagedCategoryListItemComponents = this.props.categories.map((category) =>
      <PagedCategoryListItemComponent key={category} category={category} options={this.props.options} />
    );

    return (
      <div className="videos">
        {pagedCategoryListItemComponents}
      </div>
    );
  }
}

export default PagedCategoryListComponent;