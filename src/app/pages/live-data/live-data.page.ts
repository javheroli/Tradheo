import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.page.html',
  styleUrls: ['./live-data.page.scss']
})
export class LiveDataPage implements OnInit {
  constructor(public menuCtrl: MenuController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
}
