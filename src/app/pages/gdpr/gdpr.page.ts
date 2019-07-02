import { Component, OnInit } from '@angular/core';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  Events
} from '@ionic/angular';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.page.html',
  styleUrls: ['./gdpr.page.scss']
})
export class GdprPage implements OnInit {
  constructor(public menuCtrl: MenuController, public navCtrl: NavController) {}

  ngOnInit() {
    this.menuCtrl.enable(false); // or true
  }
  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
