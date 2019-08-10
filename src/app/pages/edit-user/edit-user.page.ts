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
import { UsernameValidatorForEdit } from 'src/app/validators/username.validator.edit';
import { CustomEmailValidatorForEdit } from 'src/app/validators/email.validator.edit';
import { PhoneNumberValidatorForEdit } from 'src/app/validators/phonenumber.validator.edit';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss']
})
export class EditUserPage implements OnInit {
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
  isValidNumber: boolean = true;
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
    public events: Events,
    public usernameValidator: UsernameValidatorForEdit,
    public emailValidator: CustomEmailValidatorForEdit,
    public phoneNumberValidator: PhoneNumberValidatorForEdit
  ) {
    this.dm.getUserLogged(this.cookieService.get('token')).then(res => {
      this.username = res.username;
      this.email = res.email;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.country = this.countries.filter(x => x.name === res.country)[0];
      this.phoneNumber = res.phoneNumber;
      this.city = res.city;
      this.birthDate = res.birthDate;
      this.description = res.description;
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
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

  public editUser() {
    let translationHeader: string = this.translate.instant(
      'EDIT_USER.HEADER_SUCCESS_EDIT'
    );
    let translationMessage: string = this.translate.instant(
      'EDIT_USER.SUCCESS_EDIT'
    );

    this.dm
      .editUser(
        this.username,
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
              header: translationHeader,
              message: translationMessage,
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

          this.events.publish('user:edited');
        }, 1500);
      })
      .catch(error => {});
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
