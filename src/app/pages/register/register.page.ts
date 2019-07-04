import { Component, OnInit, NgZone } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  EmailValidator,
  FormControl
} from '@angular/forms';
import {
  NavController,
  MenuController,
  LoadingController,
  AlertController,
  Events
} from '@ionic/angular';
import { User } from 'src/app/app.data.model';
import { DataManagement } from 'src/app/services/dataManagement';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import countries from './phonePrefixByCountry';
import libphonenumber from 'google-libphonenumber';
import { UsernameValidator } from 'src/app/validators/username.validator';
import { CustomEmailValidator } from 'src/app/validators/email.validator';
import { PhoneNumberValidator } from 'src/app/validators/phonenumber.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string = '';
  phonePrefix: string = '';
  birthDate: string;
  firstName: string;
  lastName: string;
  description: string = '';
  country;
  countries = countries;
  city: string;
  profilePic: File = null;
  isValidNumber: boolean;
  privacyPolicites: boolean;

  private captchaPassed: boolean = false;
  private captchaResponse: string;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public dm: DataManagement,
    private translate: TranslateService,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    public events: Events,
    public usernameValidator: UsernameValidator,
    public emailValidator: CustomEmailValidator,
    public phoneNumberValidator: PhoneNumberValidator,
    private zone: NgZone
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      username: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.{5,25}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$'
          )
        ]),
        this.usernameValidator.checkUsername.bind(this.usernameValidator)
      ],
      password: [
        null,
        Validators.compose([Validators.minLength(5), Validators.required])
      ],
      confirmPassword: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
        this.emailValidator.checkEmail.bind(this.emailValidator)
      ],
      birthDate: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      description: [null, null],
      country: [null, Validators.compose([Validators.required])],
      phoneNumber: [
        null,
        Validators.compose([Validators.required]),
        this.phoneNumberValidator.checkPhoneNumber.bind(
          this.phoneNumberValidator
        )
      ],
      city: [null, Validators.compose([Validators.required])]
    });
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });
  }

  confirmPasswordValidation() {
    if (this.password === this.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  validateBirthdate() {
    const birthdate = new Date(this.birthDate);
    const today = new Date();

    if (birthdate > today) {
      return false;
    }
    return true;
  }

  isAdult(): boolean {
    const today = new Date();
    const birthdate = new Date(this.birthDate);

    var edad = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      edad--;
    }

    return edad > 18;
  }

  public signUp() {
    let translation1: string = this.translate.instant(
      'REGISTER.HEADER_SUCCESS'
    );
    let translation2: string = this.translate.instant('REGISTER.SUCCESS');
    let translation3: string = this.translate.instant('REGISTER.ERROR_SIGNUP');

    this.dm
      .captchaVerify(this.captchaResponse)
      .then(res => {
        this.dm
          .register(
            this.username,
            this.password,
            this.email,
            this.phoneNumber,
            this.birthDate,
            this.firstName,
            this.lastName,
            this.description,
            this.country.name,
            this.city,
            this.profilePic
          )
          .then(data => {
            this.showLoading();
            setTimeout(() => {
              this.alertCtrl
                .create({
                  header: translation1,
                  message: translation2,
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
              this.navCtrl.navigateForward('/');
              (this.username = ''),
                (this.password = ''),
                (this.confirmPassword = ''),
                (this.email = ''),
                (this.phoneNumber = ''),
                (this.birthDate = ''),
                (this.firstName = ''),
                (this.lastName = ''),
                (this.description = ''),
                (this.country = ''),
                (this.city = ''),
                (this.profilePic = null);
            }, 1500);
          })
          .catch(error => {
            this.showLoading();
            setTimeout(() => {
              this.alertCtrl
                .create({
                  header: 'Error',
                  message: translation3,
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
          });
      })
      .catch(errorr => {
        console.log('No bots!');
      });
  }

  showLoading() {
    const translation2: string = this.translate.instant('LOGIN.WAIT');
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

  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }

  onProfilePicInputChange(file: File) {
    this.checkFileIsImage(file[0], 'profPic');
    this.profilePic = file[0];
  }

  private checkFileIsImage(file: File, picture: string) {
    if (!(file.type.split('/')[0] == 'image')) {
      let translation1: string = this.translate.instant('REGISTER.IMAGE_ERROR');

      this.alertCtrl
        .create({
          header: translation1,
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

      if (picture == 'profPic') {
        this.profilePic = null;
        (<HTMLInputElement>document.getElementById('procPic')).value = '';
      }
    }
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translate.use(selectedValue.detail.value);
  }

  autocompletePrefixPhoneNumber() {
    this.phonePrefix = this.country.dial_code + ' ';
    this.phoneNumber = '';
    this.isValidNumber = true;

    return null;
  }
  validatePhoneNumber() {
    if (this.phoneNumber === '') {
      this.isValidNumber = true;
      return null;
    }
    this.phoneNumber = '' + this.phoneNumber + '';
    this.isValidNumber = false;
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    let region = this.country.code;
    let number = phoneUtil.parse(this.phoneNumber, region);
    this.isValidNumber = phoneUtil.isValidNumber(number);
    if (this.isValidNumber) {
      this.phoneNumber = phoneUtil.format(
        number,
        libphonenumber.PhoneNumberFormat.INTERNATIONAL
      );
    }
  }
}
