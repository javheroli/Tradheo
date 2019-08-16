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
  languages: any = ['English', 'Spanish'];
  company;
  companies = [
    'Acciona',
    'Acerinox',
    'ACS',
    'Aena',
    'Amadeus',
    'ArcelorMittal',
    'B. Sabadell',
    'Bankia',
    'Bankinter',
    'BBVA',
    'Caixabank',
    'Cellnex Telecom',
    'Cie Automotive',
    'Enagas',
    'ENCE',
    'Endesa',
    'Ferrovial',
    'Gamesa',
    'Grifols',
    'IAG',
    'Iberdrola',
    'Inditex',
    'Indra A',
    'Inmobiliaria Colonial',
    'Mapfre',
    'Masmovil Ibercom',
    'Mediaset',
    'Melia Hotels',
    'Merlin Properties SA',
    'Naturgy Energy',
    'Red Electrica',
    'Repsol',
    'Santander',
    'Telefonica',
    'Viscofan',
    'Adidas',
    'Allianz',
    'BASF',
    'Bayer',
    'Beiersdorf AG',
    'BMW ST',
    'Continental AG',
    'Covestro',
    'Daimler',
    'Deutsche Bank AG',
    'Deutsche Boerse',
    'Deutsche Post',
    'Deutsche Telekom AG',
    'E.ON SE',
    'Fresenius SE',
    'Fresenius ST',
    'Heidelbergcement',
    'Henkel VZO',
    'Infineon',
    'Linde PLC',
    'Lufthansa',
    'Merck',
    'Muench. Rueckvers.',
    'RWE AG ST',
    'SAP',
    'Siemens AG',
    'Thyssenkrupp AG',
    'Volkswagen VZO',
    'Vonovia',
    'Wirecard AG'
  ];

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
      if (res.admin) {
        this.dm.getAdminSettings().then(res => {
          this.company = res.company;
        });
      }
    });
  }

  focusCompany() {
    let agreed: string = this.translate.instant('SETTINGS.AGREED');
    let care: string = this.translate.instant('SETTINGS.CARE');
    let changeCompany: string = this.translate.instant(
      'SETTINGS.CHANGE_COMPANY'
    );

    this.alertCtrl
      .create({
        header: care,
        message: changeCompany,

        buttons: [
          {
            text: agreed,
            role: 'cancel'
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  changeCompany() {
    this.dm
      .setAdminSettings(this.company)
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  }
  ngOnInit() {}

  logout() {
    this.cookieService.delete('token', '/');
    setTimeout(() => {
      this.navCtrl.navigateRoot('/');
    }, 1000);
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
