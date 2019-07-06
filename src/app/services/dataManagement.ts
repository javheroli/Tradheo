import { Injectable } from '@angular/core';
import { RestWS } from './restService';

@Injectable()
export class DataManagement {
  constructor(private restService: RestWS) {}

  public turnOnServer() {
    this.restService.turnOnServer();
  }

  public login(credentials): Promise<any> {
    return this.restService
      .login(credentials)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getUserLogged(token): Promise<any> {
    return this.restService
      .getUserLogged(token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
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
  ): Promise<any> {
    return this.restService
      .register(
        username,
        password,
        email,
        phoneNumber,
        birthDate,
        firstName,
        lastName,
        description,
        country,
        city,
        profilePic
      )
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationUsername(username): Promise<any> {
    return this.restService
      .validationUsername(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationEmail(email): Promise<any> {
    return this.restService
      .validationEmail(email)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public existEmail(email): Promise<any> {
    return this.restService
      .existEmail(email)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public forgot(email): Promise<any> {
    return this.restService
      .forgot(email)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationPhoneNumber(phoneNumber): Promise<any> {
    return this.restService
      .validationPhoneNumber(phoneNumber)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public captchaVerify(captchaResponse): Promise<any> {
    return this.restService
      .captchaVerify(captchaResponse)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public verifyReset(token): Promise<any> {
    return this.restService
      .verifyReset(token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public reset(password, token): Promise<any> {
    return this.restService
      .reset(password, token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
