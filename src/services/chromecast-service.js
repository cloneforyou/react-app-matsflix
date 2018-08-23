import ApiService from './api-service';
import environmentVariables from '../environment-variables';

const chromecastApi = new ApiService({ basePath: environmentVariables.URL_API_CHROMECAST });

class ChromecastService {

  getChromecasts() {
    return chromecastApi.get('chromecasts');
  }

  getChromecast(chromecastName) {
    return chromecastApi.get(`chromecasts/${chromecastName}`);
  }

  getClientStatus(chromecastName) {
    return chromecastApi.get(`chromecasts/${chromecastName}/client-status`);
  }

  getPlayerStatus(chromecastName) {
    return chromecastApi.get(`chromecasts/${chromecastName}/player-status`);
  }

  load(chromecastName, media) {
    return chromecastApi.post({
      url: `chromecasts/${chromecastName}/load`,
      body: media
    });
  }

  seek(chromecastName, timeInSeconds) {
    return chromecastApi.post(`chromecasts/${chromecastName}/seek`, {
      timeInSeconds
    });
  }

  setVolume(chromecastName, level) {
    return chromecastApi.post(`chromecasts/${chromecastName}/volume`, {
      level
    });
  }

  mute(chromecastName) {
    return chromecastApi.post(`chromecasts/${chromecastName}/mute`);
  }

  unmute(chromecastName) {
    return chromecastApi.post(`chromecasts/${chromecastName}/unmute`);
  }

  play(chromecastName) {
    return chromecastApi.post(`chromecasts/${chromecastName}/play`);
  }

  pause(chromecastName) {
    return chromecastApi.post(`chromecasts/${chromecastName}/pause`);
  }

  stop(chromecastName) {
    return chromecastApi.post(`chromecasts/${chromecastName}/stop`);
  }

  queueGet(chromecastName) {
    return chromecastApi.get(`chromecasts/${chromecastName}/queue`);
  }

  queueInsert(chromecastName, mediaList) {
    return chromecastApi.post({
      url: `chromecasts/${chromecastName}/queue`,
      body: mediaList
    });
  }

  queueReorder(chromecastName, itemIds) {
    return chromecastApi.put({
      url: `chromecasts/${chromecastName}/queue`,
      body: itemIds,
      qs: {
        reorder: true
      }
    });
  }

  queueRemove(chromecastName, itemIds) {
    return chromecastApi.delete({
      url: `chromecasts/${chromecastName}/queue`,
      body: itemIds
    });
  }
}

export default new ChromecastService();
