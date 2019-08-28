import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  MenuController,
  ToastController,
  NavController,
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  Events
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { interval } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.page.html',
  styleUrls: ['./live-data.page.scss'],
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }
        .mobile-hidden {
          display: none;
        }
      }
      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }
        .mobile-hidden {
          display: initial;
        }
      }
      .icon {
        position: absolute;
      }
      .datatable-icon-down {
        top: 0px;
      }
      .datatable-icon-up {
        top: 40px;
      }
      .dragFromLeft .icon {
        left: -13px;
      }
    `
  ]
})
export class LiveDataPage implements OnInit {
  public intervallTimer = interval(1000);
  private subscription;
  country: string = 'Spain';
  data = null;
  previousData = null;
  first = true;
  columns = [
    { prop: 'name', name: null },
    { prop: 'last', name: null },
    { prop: 'high', name: null },
    { prop: 'low', name: null },
    { prop: 'change', name: null },
    { prop: 'changePerCent', name: null },
    { prop: 'volume', name: null },
    { prop: 'time', name: null },
    { name: null }
  ];

  screenWidth: any;
  isSmallScreen = false;
  isMobile = false;
  isReady = false;
  reorderable = true;
  swapColumns = false;
  automaticOperation;

  constructor(
    public menuCtrl: MenuController,
    private translate: TranslateService,
    public dm: DataManagement,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    private deviceService: DeviceDetectorService,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    public events: Events
  ) {
    this.onResize();

    const name: string = this.translate.instant('LIVE_DATA.NAME');
    const last: string = this.translate.instant('LIVE_DATA.LAST');
    const high: string = this.translate.instant('LIVE_DATA.HIGH');
    const low: string = this.translate.instant('LIVE_DATA.LOW');
    const change: string = this.translate.instant('LIVE_DATA.CHANGE');
    const changePerCent: string = this.translate.instant(
      'LIVE_DATA.CHANGEPERCENT'
    );
    const volume: string = this.translate.instant('LIVE_DATA.VOLUME');
    const time: string = this.translate.instant('LIVE_DATA.TIME');
    const actions: string = this.translate.instant('LIVE_DATA.ACTIONS');

    this.columns[0].name = name;
    this.columns[1].name = last;
    this.columns[2].name = high;
    this.columns[3].name = low;
    this.columns[4].name = change;
    this.columns[5].name = changePerCent;
    this.columns[6].name = volume;
    this.columns[7].name = time;
    this.columns[8].name = actions;

    this.dm
      .marketLiveData(this.country)
      .then(res => {
        res.date = String(new Date(res.date)).split(' GMT')[0];
        this.previousData = res;
        this.data = res;
        this.isReady = true;
      })
      .catch(err => {
        console.log(err);
      });

    this.dm.getAutomaticOperation().then(res => {
      this.automaticOperation = res;
    });

    events.subscribe(
      'automaticOperation:changedFromSimulator',
      automaticOperation => {
        this.automaticOperation = automaticOperation;
      }
    );
  }

  ionViewWillEnter() {
    this.dm
      .marketLiveData(this.country)
      .then(res => {
        res.date = String(new Date(res.date)).split(' GMT')[0];
        this.previousData = res;
        this.first = true;
        this.data = res;
      })
      .catch(err => {
        console.log(err);
      });
      
    this.subscription = this.intervallTimer.subscribe(x => {
      this.dm.getAutomaticOperation().then(res => {
        if (!this.automaticOperation && res) {
          this.automaticOperation = true;
          this.events.publish(
            'automaticOperation:changedFromLive',
            this.automaticOperation
          );
          const newAuto: string = this.translate.instant('LIVE_DATA.NEW_AUTO');
          this.showSuccessToast(newAuto);
        } else if (this.automaticOperation && !res) {
          this.automaticOperation = false;
          this.events.publish(
            'automaticOperation:changedFromLive',
            this.automaticOperation
          );
        }
      });
      if (this.first) {
        this.first = false;
      } else {
        this.previousData = this.data;
      }

      const now = new Date();
      if (
        now.getDay() > 0 &&
        now.getDay() < 6 &&
        now.getHours() >= 8 &&
        !(now.getHours() == 8 && now.getMinutes() < 25) &&
        now.getHours() <= 17 &&
        !(now.getHours() == 17 && now.getMinutes() > 45)
      ) {
        this.dm
          .marketLiveData(this.country)
          .then(res => {
            res.date = String(new Date(res.date)).split(' GMT')[0];
            this.data = res;
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
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

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.isMobile = this.deviceService.isMobile();
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 800) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  async ngOnInit() {}

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }

  onClickFabSpain() {
    this.country = 'Spain';
    this.dm
      .marketLiveData(this.country)
      .then(res => {
        res.date = String(new Date(res.date)).split(' GMT')[0];
        this.previousData = res;
        this.first = true;
        this.data = res;
      })
      .catch(err => {
        console.log(err);
      });
  }

  onClickFabGermany() {
    this.country = 'Germany';
    this.dm
      .marketLiveData(this.country)
      .then(res => {
        res.date = String(new Date(res.date)).split(' GMT')[0];
        this.previousData = res;
        this.first = true;
        this.data = res;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCellClass({ row, column, value }): any {
    if (value[0] === '+') {
      return {
        'is-positive': true
      };
    } else if (value[0] === '-') {
      return {
        'is-negative': true
      };
    } else {
      return {
        'is-neutral': true
      };
    }
  }
  getCellClassForLast = ({ row, column, value }): any => {
    const previousCompanyData = this.previousData.companies.find(
      x => x.name === row.name
    );
    if (value > previousCompanyData.last) {
      return {
        greenBackground: true
      };
    } else if (value < previousCompanyData.last) {
      return {
        redBackground: true
      };
    }
  };

  getMarginLeftForFirstColumn({ row, column, value }): any {
    return {
      'margin-left-for-first-column': true
    };
  }
  getMarginRightForLastColumn({ row, column, value }): any {
    return {
      'margin-right-for-last-column': true
    };
  }

  async presentActionSheet(message: any) {
    const translationCancel: string = this.translate.instant(
      'LIVE_DATA.CANCEL'
    );
    const translationActions: string = this.translate.instant(
      'LIVE_DATA.ACTIONS'
    );

    const showChart: string = this.translate.instant('LIVE_DATA.SHOWCHARTS');
    const buyStocks: string = this.translate.instant('LIVE_DATA.BUY_STOCKS');

    const actionSheet = await this.actionSheetController.create({
      header: translationActions,
      buttons: [
        {
          text: buyStocks + message,
          icon: 'logo-usd',
          handler: async () => {
            const stockValue = this.data.companies.filter(
              x => x.name === message
            )[0].last;
            const modal = await this.modalController.create({
              component: ModalPage,
              componentProps: {
                company: message,
                stockValue
              }
            });
            await modal.present();
          }
        },
        {
          text: showChart + message,
          icon: 'analytics',
          handler: () => {
            this.navCtrl.navigateForward(
              '/charts/' + this.country + '/' + message
            );
          }
        },
        {
          text: translationCancel,
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  showLoading() {
    let translation2: string = this.translate.instant('LOGIN.WAIT');
    this.loadingCtrl
      .create({
        message: translation2,
        showBackdrop: true,
        duration: 500
      })
      .then(loadingEl => {
        loadingEl.present();
      });
  }
}
