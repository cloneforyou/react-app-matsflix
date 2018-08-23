import ApiService from './api-service';
import environmentVariables from '../environment-variables';

const mediaApi = new ApiService({ basePath: environmentVariables.URL_API_MEDIA });

class GenresService {

  getGenresForSeries() {
    return mediaApi.get('genres/series');
  }
}

export default new GenresService();
