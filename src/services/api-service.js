import rp from 'request-promise';

const METHOD_GET = 'get';
const METHOD_POST = 'post';
const METHOD_PUT = 'put';
const METHOD_DELETE = 'delete';

class ApiService {

  constructor(options) {
    this.basePath = options.basePath;
  }

  request(method, options) {
    if (typeof options === 'string') {
      options = {
        url: `${this.basePath}/${options}`,
        method: method,
        json: true
      };
    } else {
      options = {
        ...options,
        method: method,
        json: true,
        url: `${this.basePath}/${options.url}`,
      };
    }

    return rp(options).catch(err => {
      console.log(err);
      throw err;
    });
  }

  get(options) {
    return this.request(METHOD_GET, options);
  }

  post(options) {
    return this.request(METHOD_POST, options);
  }

  put(options) {
    return this.request(METHOD_PUT, options);
  }

  delete(options) {
    return this.request(METHOD_DELETE, options);
  }
}

export default ApiService;
