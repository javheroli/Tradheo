import { Component } from '@angular/core';

import { Platform, Events, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from './services/dataManagement';
import { Pages } from './interfaces/pages';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public userLogged;
  public appPages: Array<Pages>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public events: Events,
    private cookieService: CookieService,
    public navCtrl: NavController,
    private translateService: TranslateService,
    public dm: DataManagement
  ) {
    events.subscribe('user:logged', user => {
      this.userLogged = user;
    });

    if (!this.cookieService.check('token')) {
      this.userLogged = null;
    } else {
      const token = this.cookieService.get('token');
      this.dm.getUserLogged(token).then(res => {
        this.userLogged = res;
      });
    }

    this.appPages = [
      {
        title: 'Live Data',
        url: '/live-data',
        direct: 'forward',
        icon: 'pulse'
      },
      {
        title: 'Charts',
        url: '/charts',
        direct: 'forward',
        icon: 'stats'
      },
      {
        title: 'Simulator',
        url: '/simulator',
        direct: 'forward',
        icon: 'logo-usd'
      },
      {
        title: 'Licence',
        url: '/licence',
        direct: 'forward',
        icon: 'cart'
      },
      {
        title: 'App Settings',
        url: '/settings',
        direct: 'forward',
        icon: 'settings'
      },
      {
        title: 'Privacy Policy',
        url: '/gdpr',
        direct: 'forward',
        icon: 'document'
      }
    ];
    this.initializeApp();
  }
  logout() {
    this.cookieService.delete('token');
    this.navCtrl.navigateRoot('/');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.translateService.setDefaultLang('en');
    if (this.cookieService.check('lang')) {
      let language = this.cookieService.get('lang');
      this.translateService.use(language);
    } else {
      this.translateService.use('en');
    }
  }
}
