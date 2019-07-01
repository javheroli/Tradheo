import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'http://192.168.1.135:5000/';
    let urlPrefixLocalhost = 'http://localhost:5000/';
    let urlAPI = '';
    if (environment.production) {
      urlPrefix = 'https://tradheo.herokuapp.com/';
      urlPrefixLocalhost = 'https://tradheo.herokuapp.com/';
      urlAPI = '';
    }

    return {
      restUrlPrefix: urlPrefix + urlAPI,
      restUrlPrefixLocalhost: urlPrefixLocalhost + urlAPI
    };
  }
}
