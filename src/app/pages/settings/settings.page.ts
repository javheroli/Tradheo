import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { DataManagement } from 'src/app/services/dataManagement';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  lang: any;
  enableNotifications: any;
  paymentMethod: any;
  currency: any;
  enablePromo: any;
  enableHistory: any;

  languages: any = ['English', 'Spanish'];
  paymentMethods: any = ['Paypal', 'Credit Card'];
  currencies: any = ['USD', 'BRL', 'EUR'];
  public userLogged;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private cookieService: CookieService,
    public dm: DataManagement,
    private translateService: TranslateService,
    private translate: TranslateService,
    public loadingCtrl: LoadingController
  ) {
    const token = this.cookieService.get('token');
    this.dm.getUserLogged(token).then(res => {
      this.userLogged = res;
    });
  }

  ngOnInit() {}

  logout() {
    this.cookieService.delete('token');
    this.navCtrl.navigateRoot('/');
  }

  goTo(destination: string) {
    this.navCtrl.navigateForward(destination);
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translateService.use(selectedValue.detail.value);
  }

  exportData() {
    let translationExport: string = this.translate.instant('SETTINGS.EXPORT');
    let translationExplication: string = this.translate.instant(
      'SETTINGS.EXPLICATION_EXPORT'
    );
    let translationConfirm: string = this.translate.instant(
      'SETTINGS.CONFIRM_QUESTION'
    );
    let translationYes: string = this.translate.instant('SETTINGS.YES');

    setTimeout(() => {
      this.alertCtrl
        .create({
          header: translationExport,
          subHeader: translationExplication,
          message: '<br ><br ><strong>' + translationConfirm + '</strong>',
          buttons: [
            {
              text: translationYes,
              role: 'yes',
              handler: () => {
                this.exportDataUser();
              }
            },
            {
              text: 'NO'
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
    }, 100);
  }

  exportDataUser() {
    /*this.dm
      .exportData(this.userLogged.user.id)
      .then(data => {
        this.isExported(true);
      })
      .catch(error => {
        this.isExported(false);
      });*/
  }

  isExported(bool: boolean) {
    let translationError1: string = this.translate.instant(
      'SETTINGS.EXPORT_ERROR_1'
    );
    let translationError2: string = this.translate.instant(
      'SETTINGS.EXPORT_ERROR_2'
    );
    let translationOk1: string = this.translate.instant('SETTINGS.EXPORT_OK_1');
    let translationOk2: string = this.translate.instant('SETTINGS.EXPORT_OK_2');
    this.showLoading();
    if (bool) {
      setTimeout(() => {
        this.alertCtrl
          .create({
            header: translationOk1,
            message: translationOk2,
            buttons: [
              {
                text: 'Ok',
                role: 'ok'
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
      }, 1500);
    } else {
      setTimeout(() => {
        this.alertCtrl
          .create({
            header: 'Error',
            message: translationError1 + '<br ><br >' + translationError2,
            buttons: [
              {
                text: 'Ok',
                role: 'ok'
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
      }, 1500);
    }
  }

  showLoading() {
    let translation2: string = this.translate.instant('LOGIN.WAIT');
    this.loadingCtrl
      .create({
        message: translation2,
        showBackdrop: true,
        duration: 1000
      })
      .then(loadingEl => {
        loadingEl.present();
      });
  }
}
