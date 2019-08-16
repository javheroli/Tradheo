import { Component, OnInit, TrackByFunction } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import { interval, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  LoadingController,
  ToastController,
  AlertController,
  ActionSheetController
} from '@ionic/angular';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.page.html',
  styleUrls: ['./simulator.page.scss']
})
export class SimulatorPage implements OnInit {
  public intervallTimer = interval(1000);
  private subscription;
  simulationsResponse;
  logged;
  userCheckbox = true;
  tradheoCheckbox = true;
  inProgressCheckbox = true;
  resolvedCheckbox = true;
  isReady = false;
  data;
  marketSpain;
  marketGermany;
  Math = Math;
  trackSimulation = simulation => simulation._id;
  constructor(
    private translate: TranslateService,
    public dm: DataManagement,
    private cookieService: CookieService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController
  ) {
    const token = this.cookieService.get('token');
    this.dm.getUserLogged(token).then(res => {
      this.logged = res;

      this.dm.getAllSimulations().then(res => {
        this.simulationsResponse = res;

        this.dm.marketLiveData('Spain').then(res => {
          this.marketSpain = res.companies;
          this.dm.marketLiveData('Germany').then(res => {
            this.marketGermany = res.companies;
            this.simulationsResponse.simulators
              .filter(x => x.result === null)
              .forEach(simulation => {
                if (simulation.country === 'Spain') {
                  simulation.last = this.marketSpain.find(
                    y => y.name === simulation.company
                  ).last;
                } else {
                  simulation.last = this.marketGermany.find(
                    y => y.name === simulation.company
                  ).last;
                }
              });

            this.data = this.simulationsResponse.simulators;
            this.isReady = true;
          });
        });
      });
    });
  }

  ionViewWillEnter() {
    this.dm.getAllSimulations().then(res => {
      this.simulationsResponse = res;

      this.dm.marketLiveData('Spain').then(res => {
        this.marketSpain = res.companies;
        this.dm.marketLiveData('Germany').then(res => {
          this.marketGermany = res.companies;
          this.simulationsResponse.simulators
            .filter(x => x.result === null)
            .forEach(simulation => {
              if (simulation.country === 'Spain') {
                simulation.last = this.marketSpain.find(
                  y => y.name === simulation.company
                ).last;
              } else {
                simulation.last = this.marketGermany.find(
                  y => y.name === simulation.company
                ).last;
              }
            });

          this.changeFilter(null);
        });
      });
    });

    this.subscription = this.intervallTimer
      .pipe(mergeMap(_ => from(this.dm.getAllSimulations())))
      .subscribe(res => {
        this.simulationsResponse = res;
        this.dm.marketLiveData('Spain').then(res => {
          this.marketSpain = res.companies;
          this.dm.marketLiveData('Germany').then(res => {
            this.marketGermany = res.companies;
            this.simulationsResponse.simulators
              .filter(x => x.result === null)
              .forEach(simulation => {
                if (simulation.country === 'Spain') {
                  simulation.last = this.marketSpain.find(
                    y => y.name === simulation.company
                  ).last;
                } else {
                  simulation.last = this.marketGermany.find(
                    y => y.name === simulation.company
                  ).last;
                }
              });

            this.changeFilter(null);
          });
        });
      });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}

  changeUserCheckbox() {
    this.userCheckbox = !this.userCheckbox;
    if (!this.userCheckbox && !this.tradheoCheckbox) {
      this.tradheoCheckbox = true;
    }
  }
  changeTradheoCheckbox() {
    this.tradheoCheckbox = !this.tradheoCheckbox;
    if (!this.userCheckbox && !this.tradheoCheckbox) {
      this.userCheckbox = true;
    }
  }

  changeFilter(checkbox) {
    if (checkbox === 'user' && !this.userCheckbox && !this.tradheoCheckbox) {
      this.tradheoCheckbox = true;
    }
    if (checkbox === 'tradheo' && !this.userCheckbox && !this.tradheoCheckbox) {
      this.userCheckbox = true;
    }
    if (
      checkbox === 'inProgress' &&
      !this.inProgressCheckbox &&
      !this.resolvedCheckbox
    ) {
      this.resolvedCheckbox = true;
    }
    if (
      checkbox === 'resolved' &&
      !this.inProgressCheckbox &&
      !this.resolvedCheckbox
    ) {
      this.inProgressCheckbox = true;
    }

    //Filter Tradheo/User simulations
    if (this.userCheckbox && this.tradheoCheckbox) {
      this.data = this.simulationsResponse.simulators;
    } else if (this.userCheckbox && !this.tradheoCheckbox) {
      this.data = this.simulationsResponse.simulators.filter(
        x => x.username !== null
      );
    } else {
      this.data = this.simulationsResponse.simulators.filter(
        x => x.username === null
      );
      console.log(this.data);
    }
    //Filter inProgress/resolved simulations
    if (this.inProgressCheckbox && !this.resolvedCheckbox) {
      this.data = this.data.filter(x => x.result === null);
    } else if (!this.inProgressCheckbox && this.resolvedCheckbox) {
      this.data = this.data.filter(x => x.result !== null);
    }
  }

  deleteSimulation(_id) {
    let cancel: string = this.translate.instant('LOGIN.CANCEL');
    let deletee: string = this.translate.instant('SIMULATOR.DELETE');
    let deleteHeader: string = this.translate.instant(
      'SIMULATOR.DELETE_HEADER'
    );
    let deleteBody: string = this.translate.instant('SIMULATOR.DELETE_BODY');
    let deleteSuccess: string = this.translate.instant(
      'SIMULATOR.DELETE_SUCCESS'
    );

    this.alertCtrl
      .create({
        header: deleteHeader,
        message: deleteBody,

        buttons: [
          {
            text: deletee,
            handler: () => {
              this.showLoading();
              this.dm
                .deleteSimulation(_id)
                .then(res => {
                  this.data = this.data.filter(x => x._id !== _id);
                  this.showSuccessToast(deleteSuccess);
                })
                .catch(err => {
                  console.log(err);
                });
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

  sendSimulation(simulation) {
    let cancel: string = this.translate.instant('LOGIN.CANCEL');
    let sell: string = this.translate.instant('SIMULATOR.SELL');
    let sellHeader: string = this.translate.instant('SIMULATOR.SELL_HEADER');
    let sellBody: string = this.translate.instant('SIMULATOR.SELL_BODY');
    let sellSuccess: string = this.translate.instant('SIMULATOR.SELL_SUCCESS');

    this.alertCtrl
      .create({
        header: sellHeader,
        message: sellBody,

        buttons: [
          {
            text: sell,
            handler: () => {
              this.showLoading();
              this.dm
                .sellSimulation(simulation._id, simulation.last)
                .then(res => {
                  this.showSuccessToast(sellSuccess);
                })
                .catch(err => {
                  console.log(err);
                });
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

  async showSuccessToast(data: any) {
    let toast = await this.toastCtrl.create({
      message: data,
      duration: 1000,
      position: 'top',
      cssClass: 'toast',
      color: 'success'
    });

    toast.present();
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

  async presentActionSheet(simulation) {
    const translationCancel: string = this.translate.instant(
      'LIVE_DATA.CANCEL'
    );
    const translationActions: string = this.translate.instant(
      'LIVE_DATA.ACTIONS'
    );

    const send: string = this.translate.instant('SIMULATOR.SELL_HEADER');
    const deletee: string = this.translate.instant('SIMULATOR.DELETE_HEADER');

    var buttons;
    if (simulation.result === null) {
      buttons = [
        {
          text: send,
          icon: 'cash',
          handler: () => {
            this.sendSimulation(simulation);
          }
        },
        {
          text: deletee,
          icon: 'trash',
          handler: () => {
            this.deleteSimulation(simulation._id);
          }
        },
        {
          text: translationCancel,
          icon: 'close',
          role: 'cancel'
        }
      ];
    } else {
      buttons = [
        {
          text: deletee,
          icon: 'trash',
          handler: () => {
            this.deleteSimulation(simulation._id);
          }
        },
        {
          text: translationCancel,
          icon: 'close',
          role: 'cancel'
        }
      ];
    }

    const actionSheet = await this.actionSheetController.create({
      header: translationActions,
      buttons: buttons
    });
    await actionSheet.present();
  }
}
