import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  SelectMultipleControlValueAccessor
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

  login() {
    let translation: string = this.translate.instant('LOGIN.FAIL');

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
