import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const check = this.cookieService.check('token');
    if (!check) {
      this.navCtrl.navigateForward('/');
      this.alertCtrl
        .create({
          header: 'Unathenticated!',
          message: 'You are not allowed to access to this resource',
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
    }
    return check;
  }
}
