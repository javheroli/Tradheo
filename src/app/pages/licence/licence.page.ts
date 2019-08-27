import { Component, OnInit } from '@angular/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import {
  AlertController,
  LoadingController,
  MenuController,
  ToastController,
  NavController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

declare let paypal: any;

@Component({
  selector: 'app-licence',
  templateUrl: './licence.page.html',
  styleUrls: ['./licence.page.scss']
})
export class LicencePage implements OnInit {
  check: boolean = false;
  plan = '19.99';
  logged;
  isReady = false;
  username;

  constructor(
    public dM: DataManagement,
    public toastCtrl: ToastController,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.check = this.cookieService.check('token');
    if (this.check) {
      this.menuCtrl.enable(true);
      const token = this.cookieService.get('token');
      this.dM.getUserLogged(token).then(res => {
        res.licenceDate = String(new Date(res.licenceDate)).split(' GMT')[0];
        this.logged = res;
        this.isReady = true;
      });
    } else {
      this.menuCtrl.enable(false);
      this.activatedRoute.paramMap.subscribe(paramMap => {
        this.username = paramMap.get('username');
        this.dM.getUserByUsernameWithoutLogging(this.username).then(res => {
          res.licenceDate = String(new Date(res.licenceDate)).split(' GMT')[0];
          this.logged = res;
          this.isReady = true;
        });
      });
    }
  }

  paid() {
    this.dM
      .paid(this.logged.username, this.plan)
      .then(data => {
        this.logged = data;
      })
      .catch(error => {
        this.alertCtrl
          .create({
            header: 'Error',
            message: 'error',
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
      });
  }

  loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.getElementById('buynow').appendChild(scriptElement);
    });
  }
  async success() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    let translation: string = this.translate.instant('LICENCE.UPDATED_LICENCE');
    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: translation,

        position: 'middle'
      });

      toast.present();
      if (!this.check) {
        this.navCtrl.navigateRoot('/');
      }
    });
  }
  async payment() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
  }

  ngAfterViewInit(): void {
    let lang: string = this.translate.instant('LICENCE.LANG');
    this.loadExternalScript(
      'https://www.paypalobjects.com/api/checkout.js'
    ).then(() => {
      paypal.Button.render(
        {
          env: 'sandbox',
          locale: lang,
          style: {
            size: 'large',
            color: 'gold',
            shape: 'pill',
            label: 'checkout',
            tagline: 'false'
          },
          client: {
            production: '',
            sandbox:
              'AcqiPZIYUpbbQD6mUewMDcAd3wFInz9ae4xdtOuj3Ykg8aX4hFeNSOcEne3O0IDKT2v3VlaOQoazagvc'
          },
          commit: true,
          payment: function(data, actions) {
            var x = document.getElementById('radio1');
            var checked = x.getAttribute('aria-checked') === 'true';
            var plan = null;

            if (checked) {
              plan = '19.99';
            } else {
              x = document.getElementById('radio2');
              checked = x.getAttribute('aria-checked') === 'true';
              if (checked) {
                plan = '49.99';
              } else {
                plan = '149.99';
              }
            }

            return actions.payment.create({
              payment: {
                transactions: [
                  {
                    amount: { total: plan, currency: 'EUR' }
                  }
                ]
              }
            });
          },
          onAuthorize: (data, actions) => {
            return actions.payment.execute().then(payment => {
              this.paid();
              this.success();
            });
          }
        },
        '#buynow'
      );
    });
  }
}
