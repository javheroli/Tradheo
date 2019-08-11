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

  public marketLiveData(country): Promise<any> {
    return this.restService
      .marketLiveData(country)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getChartData(company, interval): Promise<any> {
    return this.restService
      .getChartData(company, interval)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getUserBy(username, token): Promise<any> {
    return this.restService
      .getUserBy(username, token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getUserByUsernameWithoutLogging(username): Promise<any> {
    return this.restService
      .getUserByUsernameWithoutLogging(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public deleteUser(): Promise<any> {
    return this.restService
      .deleteUser()
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationUsernameForEdit(username): Promise<any> {
    return this.restService
      .validationUsernameForEdit(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationEmailForEdit(email): Promise<any> {
    return this.restService
      .validationEmailForEdit(email)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public validationPhoneNumberForEdit(phoneNumber): Promise<any> {
    return this.restService
      .validationPhoneNumberForEdit(phoneNumber)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
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
  ): Promise<any> {
    return this.restService
      .editUser(
        username,
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

  public listUsers(keyword: string): Promise<any> {
    return this.restService
      .listUsers(keyword)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public blockUser(username: string): Promise<any> {
    return this.restService
      .blockUser(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public unblockUser(username: string): Promise<any> {
    return this.restService
      .unblockUser(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getMessages(sender: string, receiver: string): Promise<any> {
    return this.restService
      .getMessages(sender, receiver)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  public sendMessage(
    sender: string,
    receiver: string,
    message: string
  ): Promise<any> {
    return this.restService
      .sendMessage(sender, receiver, message)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  public deleteMessages(messageId): Promise<any> {
    return this.restService
      .deleteMessages(messageId)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public editMessages(message): Promise<any> {
    return this.restService
      .editMessages(message)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public getChatNotifications(): Promise<any> {
    return this.restService
      .getChatNotifications()
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public resetChatNotifications(username): Promise<any> {
    return this.restService
      .resetChatNotifications(username)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public paid(username, plan): Promise<any> {
    return this.restService
      .paid(username, plan)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
