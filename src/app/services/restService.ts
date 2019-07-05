import { HttpClient } from '@angular/common/http';
import { ConfigService } from './../../config/configService';
import { AbstractWS } from './abstractService';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestWS extends AbstractWS {
  path = '';

  constructor(
    private config: ConfigService,
    http: HttpClient,
    private cookieService: CookieService
  ) {
    super(http);
    this.path = this.config.config().restUrlPrefixLocalhost;
  }
  // Methods
  public turnOnServer() {
    this.makeGetRequest(this.path + 'api/turnOnServer/', null);
  }

  public login(credentials) {
    const fd = new FormData();
    fd.append('username', credentials.username);
    fd.append('password', credentials.password);
    return this.makePostRequest(this.path + 'api/auth/login/', fd)
      .then(res => {
        console.log('Logged successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public getUserLogged(token) {
    return this.makeGetRequest(this.path + 'api/getUserLogged/', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public register(
    username: string,
    password: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    firstName: string,
    lastName: string,
    description: string,
    country: string,
    city: string,
    profilePic
  ) {
    const fd = new FormData();
    fd.append('username', username);
    fd.append('password', password);
    fd.append('email', email);
    fd.append('phoneNumber', phoneNumber);
    fd.append('birthDate', birthDate);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('description', description);
    fd.append('country', country);
    fd.append('city', city);
    if (profilePic !== null) {
      console.log(profilePic);
      fd.append('image', profilePic);
    }

    return this.makePostRequest(this.path + 'api/auth/signup/', fd)
      .then(res => {
        console.log('Sign up successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public validationUsername(username) {
    return this.makeGetRequest(
      this.path + 'api/auth/signup/validationUsername/' + username,
      null
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public validationEmail(email) {
    return this.makeGetRequest(
      this.path + 'api/auth/signup/validationEmail/' + email,
      null
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public existEmail(email) {
    return this.makeGetRequest(
      this.path + 'api/auth/login/existEmail/' + email,
      null
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public forgot(email) {
    const fd = new FormData();
    fd.append('email', email);
    return this.makePostRequest(this.path + 'api/auth/forgot/', fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationPhoneNumber(phoneNumber) {
    return this.makeGetRequest(
      this.path + 'api/auth/signup/validationPhoneNumber/' + phoneNumber,
      null
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public captchaVerify(captchaResponse) {
    const fd = new FormData();
    fd.append('captchaResponse', captchaResponse);
    return this.makePostRequest(this.path + 'api/captchaVerify/', fd)
      .then(res => {
        console.log('Captcha verify success');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }
}
