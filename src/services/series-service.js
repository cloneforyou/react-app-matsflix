import ApiService from './api-service';
import environmentVariables from '../environment-variables';
import qs from 'qs';

const mediaApi = new ApiService({ basePath: environmentVariables.URL_API_MEDIA });

class SeriesService {

  searchForSeries(query) {
    return mediaApi.get(`series?${qs.stringify(query)}`);
  }

  getTop5SeriesByGenre(genre) {
    return mediaApi.get(`series?genre=${genre}&top=5`);
  }

  getSeriesByGenre(genre) {
    return mediaApi.get(`series?genre=${genre}`);
  }

  getAllSeries() {
    return mediaApi.get('series');
  }

  getSeries(seriesFileName) {
    return mediaApi.get(`series/${seriesFileName}`)
  }

  getSeasonsInSeries(seriesFileName) {
    return mediaApi.get(`series/${seriesFileName}/seasons`);
  }

  getEpisodesInSeason(seriesFileName, season) {
    return mediaApi.get(`series/${seriesFileName}/seasons/${season}/episodes`);
  }

  getEpisodeInSeasonInSeries(seriesFileName, season, episode) {
    return mediaApi.get(`series/${seriesFileName}/seasons/${season}/episodes/${episode}`);
  }

  getStreamPath(episode) {
    return ``;
  }
}

export default new SeriesService();
