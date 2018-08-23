import './ChromecastQueueComponent.scss';
import React, { Component } from 'react';
import Sortable from 'sortablejs';
import chromecastService from '../../../services/chromecast-service';

class ChromecastQueueComponent extends Component {

  constructor() {
    super();
    this.ulRef = React.createRef();
  }

  onClickRemove(e, itemId) {
    chromecastService.queueRemove(this.props.chromecast.name, [itemId]).then((playerStatus) => {
      this.props.onNewPlayerStatus(playerStatus);
    });
  }

  componentDidMount() {
    new Sortable(this.ulRef.current, {
      onMove: () => false,
      onUpdate: (e) => {
        const itemId = parseInt(e.item.id, 10);
        const itemIds = this.props.playerStatus.items.map(i => i.itemId).filter(id => id !== itemId);
        itemIds.splice(e.newIndex, 0, itemId);

        chromecastService.queueReorder(this.props.chromecast.name, itemIds);
      }
    });
  }

  render() {

    const itemComponents = this.props.playerStatus.items.map((item, i) => {
      return (
        <li id={item.itemId} key={item.itemId} className="chromecast-queue__item">
          <span className="chromecast-queue__title">{item.media.metadata.title}</span>
          <span className="chromecast-queue__remove" onClick={e => this.onClickRemove(e, item.itemId)}><i className="fa fa-remove" /></span>
        </li>
      );
    });

    return (
      <ul className="chromecast-queue" ref={this.ulRef}>
        {itemComponents}
      </ul>
    );
  }
}

export default ChromecastQueueComponent;
