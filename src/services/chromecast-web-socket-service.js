import EventEmitter from 'event-emitter';
import environmentVariables from '../environment-variables';

class ChromecastWebSocketService extends EventEmitter {

  constructor() {
    super();

    this.socket = new WebSocket(`ws://${environmentVariables.URL_API_CHROMECAST}`);
    this.socket.addEventListener('open', (event) => {
      console.log(`Connected to ${event.currentTarget.url}`);
    });

    this.socket.addEventListener('message', (event) => {
      console.log(`Received message from ${event.currentTarget.url}: ${event.data}`);
      const splitPoint = event.data.indexOf(':');
      let chromecastEvent;
      let payload;

      if (splitPoint > 0) {
        chromecastEvent = event.data.substr(0, splitPoint);
        payload = event.data.substr(splitPoint + 1, event.data.length);
      } else {
        chromecastEvent = event.data;
      }

      if (payload) {
        try {
          this.emit(chromecastEvent, JSON.parse(payload));
        } catch (err) {
          this.emit(chromecastEvent, payload);
        }
      } else {
        this.emit(chromecastEvent);
      }
    });

    this.socket.addEventListener('close', (event) => {
      console.log(`Closed connection with ${event.currentTarget.url}`);
    });
  }
}

export default new ChromecastWebSocketService();
