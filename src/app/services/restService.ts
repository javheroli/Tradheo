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

  private calculateAge(birthday) {
    // birthday is a date
    var birthdayDate = new Date(birthday);
    var ageDifMs = Date.now() - birthdayDate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
        res.age = this.calculateAge(res.birthDate);
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

  public verifyReset(token) {
    return this.makeGetRequest(this.path + 'api/auth/reset/' + token, null)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public reset(password, token) {
    const fd = new FormData();
    fd.append('password', password);
    return this.makePostRequest(this.path + 'api/auth/reset/' + token, fd)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public marketLiveData(country) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/market/live/' + country,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public getChartData(company, interval) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/chart/getData/' + company + '/' + interval,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public getUserBy(username, token) {
    return this.makeGetRequest(
      this.path + 'api/getUser/' + username,
      null,
      token
    )
      .then(res => {
        res.age = this.calculateAge(res.birthDate);
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public getUserByUsernameWithoutLogging(username) {
    return this.makeGetRequest(
      this.path + 'api/getUserWithoutLogging/' + username,
      null
    )
      .then(res => {
        res.age = this.calculateAge(res.birthDate);
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public deleteUser() {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(this.path + 'api/deleteUser', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public validationUsernameForEdit(username) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/editUser/validationUsername/' + username,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public validationEmailForEdit(email) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/editUser/validationEmail/' + email,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public validationPhoneNumberForEdit(phoneNumber) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/editUser/validationPhoneNumber/' + phoneNumber,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  public editUser(
    username: string,
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
    const token = this.cookieService.get('token');

    const fd = new FormData();
    fd.append('username', username);
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

    return this.makePostRequest(this.path + 'api/editUser/', fd, token)
      .then(res => {
        console.log('Sign up successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public listUsers(keyword: string) {
    const token = this.cookieService.get('token');
    let url = '';
    if (keyword == null) {
      url = 'api/users/';
    } else {
      url = 'api/users/search?keyword=' + keyword;
    }

    return this.makeGetRequest(this.path + url, null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public blockUser(username: string) {
    const token = this.cookieService.get('token');

    return this.makeGetRequest(
      this.path + 'api/blockUser/' + username,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public unblockUser(username: string) {
    const token = this.cookieService.get('token');

    return this.makeGetRequest(
      this.path + 'api/unblockUser/' + username,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public getMessages(sender: string, receiver: string) {
    let token: string;
    token = this.cookieService.get('token');

    return this.makeGetRequest(
      this.path + 'api/messages/' + sender + '/' + receiver + '/',
      false,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public sendMessage(sender: string, receiver: string, message: string) {
    const fd = new FormData();
    let token: string;
    token = this.cookieService.get('token');
    fd.append('sender', sender);
    fd.append('receiver', receiver);
    fd.append('message', message);

    return this.makePostRequest(this.path + 'api/messages/', fd, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public deleteMessages(messageId) {
    let token: string;
    token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/deleteMessages/' + messageId,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public editMessages(message) {
    const fd = new FormData();
    let token: string;
    token = this.cookieService.get('token');
    fd.append('message', message.message);
    return this.makePostRequest(
      this.path + 'api/editMessages/' + message._id,
      fd,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public getChatNotifications() {
    let token: string;
    token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/chatNotifications/',
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public resetChatNotifications(username) {
    let token: string;
    token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/resetChatNotifications/' + username,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public paid(username, plan) {
    return this.makeGetRequest(
      this.path + 'api/updateLicence/' + username + '/' + plan,
      null
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public purchaseByUser(company: string, number, stockValue) {
    const token = this.cookieService.get('token');

    const fd = new FormData();
    fd.append('company', company);
    fd.append('number', number);
    fd.append('purchaseValue', stockValue);

    return this.makePostRequest(
      this.path + 'api/simulator/purchaseByUser',
      fd,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  public getAllSimulations() {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(this.path + 'api/simulator/getAll', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public deleteSimulation(_id) {
    const token = this.cookieService.get('token');
    return this.makeDeleteRequest(
      this.path + 'api/simulator/delete/' + _id,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public sellSimulation(_id, currentValue) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/simulator/sell/' + _id + '/' + currentValue,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public getAdminSettings() {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(this.path + 'api/getAdminSettings', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public setAdminSettings(company) {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/setAdminSettings/' + company,
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public getAutomaticOperation() {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(
      this.path + 'api/simulator/getAutomaticOperation/',
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }
}
