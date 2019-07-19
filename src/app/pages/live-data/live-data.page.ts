import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  MenuController,
  ToastController,
  NavController,
  ActionSheetController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { interval } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  public intervallTimer = interval(10000);
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

  constructor(
    public menuCtrl: MenuController,
    private translate: TranslateService,
    public dm: DataManagement,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    private deviceService: DeviceDetectorService
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
        this.isReady = true;
        this.data = res;
      })
      .catch(err => {
        console.log(err);
      });

    this.subscription = this.intervallTimer.subscribe(x => {
      if (this.first) {
        this.first = false;
      } else {
        this.previousData = this.data;
      }
      this.dm
        .marketLiveData(this.country)
        .then(res => {
          res.date = String(new Date(res.date)).split(' GMT')[0];
          this.data = res;
        })
        .catch(err => {
          console.log(err);
        });
    });
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
    const previousCompanyData = this.previousData.market.companies.find(
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

    const actionSheet = await this.actionSheetController.create({
      header: translationActions,
      buttons: [
        {
          text: translationCancel,
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
