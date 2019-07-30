import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  NavController,
  MenuController,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { DataManagement } from 'src/app/services/dataManagement';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss']
})
export class ResetPage implements OnInit {
  public onResetForm: FormGroup;
  password: string;
  confirmPassword: string;
  token: string;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public dm: DataManagement,
    private translate: TranslateService,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onResetForm = this.formBuilder.group({
      password: [
        null,
        Validators.compose([Validators.minLength(5), Validators.required])
      ],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.token = paramMap.get('token');
      this.dm
        .verifyReset(paramMap.get('token'))
        .then(() => {})
        .catch(err => {
          let tokenInvalid: string = this.translate.instant(
            'RESET.TOKEN_INVALID'
          );
          this.showErrorToast(tokenInvalid);
          this.navCtrl.navigateRoot('/');
        });
    });
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

  async showSuccessToast(data: any) {
    let toast = await this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top',
      cssClass: 'toast',
      color: 'success'
    });

    toast.present();
  }

  confirmPasswordValidation() {
    if (this.password === this.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translate.use(selectedValue.detail.value);
  }

  public reset() {
    let tokenInvalid: string = this.translate.instant('RESET.TOKEN_INVALID');
    let success: string = this.translate.instant('RESET.SUCCESS');
    this.dm
      .reset(this.password, this.token)
      .then(() => {
        this.showLoading();
        setTimeout(() => {
          this.showSuccessToast(success);
          this.navCtrl.navigateRoot('/');
        }, 1500);
      })
      .catch(err => {
        this.showErrorToast(tokenInvalid);
        this.navCtrl.navigateRoot('/');
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
}
