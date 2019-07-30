import { Component, OnInit } from '@angular/core';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  Events
} from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.page.html',
  styleUrls: ['./gdpr.page.scss']
})
export class GdprPage implements OnInit {
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.check('token')) {
      this.menuCtrl.enable(true); // or true
    } else {
      this.menuCtrl.enable(false);
    }
  }
  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
