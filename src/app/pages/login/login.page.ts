import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  SelectMultipleControlValueAccessor,
  EmailValidator
} from '@angular/forms';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  Events
} from '@ionic/angular';
import { DataManagement } from 'src/app/services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  registerCredentials = { username: '', password: '' };

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public dm: DataManagement,
    private cookieService: CookieService,
    private translate: TranslateService,
    public events: Events
  ) {
    this.turnOnServer();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/signup');
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      console.log(event);
    }
  }

  keypress($event) {
    if ($event.keyCode == 13) {
      this.login();
    }
  }
  async showErrorToast(data: any) {
    let toast = await this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top',
      cssClass: 'toast',
      color: 'warning'
    });

    toast.present();
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;

    let regexp = new RegExp(
      // tslint:disable-next-line: max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    serchfind = regexp.test(search);
    return serchfind;
  }

  forgotPassword() {
    let cancel: string = this.translate.instant('LOGIN.CANCEL');
    let reset: string = this.translate.instant('LOGIN.RESET');
    let forgotAlertMessage: string = this.translate.instant(
      'LOGIN.FORGOT_ALERT_MESSAGE'
    );
    let invalidEmail: string = this.translate.instant('LOGIN.INVALID_EMAIL');
    let emailDoesNotExist: string = this.translate.instant(
      'LOGIN.EMAIL_NOTFOUND'
    );
    this.alertCtrl
      .create({
        header: 'Forgot password?',
        message: forgotAlertMessage,
        inputs: [
          {
            name: 'email',
            id: 'email',
            type: 'email'
          }
        ],
        buttons: [
          {
            text: reset,
            handler: alertData => {
              if (this.isEmail(alertData.email)) {
                this.dm
                  .existEmail(alertData.email)
                  .then(res => {})
                  .catch(err => {
                    this.showErrorToast(emailDoesNotExist);
                  });
              } else {
                this.showErrorToast(invalidEmail);
                return false;
              }
            }
          },
          {
            text: cancel,
            role: 'cancel'
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  login() {
    let translation: string = this.translate.instant('LOGIN.FAIL');
    let LicenceExpiredHeader: string = this.translate.instant(
      'LOGIN.LINCENCE_EXPIRED_HEADER'
    );
    let LicenceExpiredBody: string = this.translate.instant(
      'LOGIN.LINCENCE_EXPIRED_BODY'
    );
    let updateLicence: string = this.translate.instant('LOGIN.UPDATE_LICENCE');
    let cancel: string = this.translate.instant('LOGIN.CANCEL');

    this.dm
      .login(this.registerCredentials)
      .then(data => {
        this.showLoading();
        setTimeout(() => {
          this.cookieService.set('token', data.token);
          this.dm.getUserLogged(data.token).then(user => {
            this.events.publish('user:logged', user);
            this.navCtrl.navigateRoot('/users');
          });
        }, 1500);
      })
      .catch(error => {
        this.showLoading();
        if (error.status === 403) {
          setTimeout(() => {
            this.alertCtrl
              .create({
                header: LicenceExpiredHeader,
                message: LicenceExpiredBody,
                buttons: [
                  {
                    text: updateLicence,
                    role: 'ok'
                  },
                  {
                    text: cancel,
                    role: 'cancel'
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
                message: translation,
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
            this.registerCredentials.username = '';
            this.registerCredentials.password = '';
          }, 1500);
        }
      });
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

  turnOnServer() {
    this.dm.turnOnServer();
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translate.use(selectedValue.detail.value);
  }
}
