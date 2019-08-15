import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataManagement } from 'src/app/services/dataManagement';
import { discardElement } from 'highcharts';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss']
})
export class ModalPage implements OnInit {
  stockValue;
  company;
  number = 1;
  Math = Math;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private translate: TranslateService,
    public dm: DataManagement,
    public toastCtrl: ToastController
  ) {}
  ngOnInit() {}

  ionViewWillEnter() {
    this.stockValue = this.navParams.get('stockValue');
    this.company = this.navParams.get('company');
  }

  purchase() {
    const purchaseDone: string = this.translate.instant(
      'LIVE_DATA.PURCHASE_DONE'
    );

    this.dm
      .purchaseByUser(this.company, this.number, this.stockValue)
      .then(res => {
        this.dismissModal();
        this.showSuccessToast(purchaseDone);
      })
      .catch(err => {
        console.log(err);
        this.dismissModal();
        this.showErrorToast('Error');
      });
  }
  async dismissModal() {
    await this.modalController.dismiss();
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
}
