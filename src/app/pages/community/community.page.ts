import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  LoadingController,
  Events
} from '@ionic/angular';
import { User } from '../../app.data.model';
import { DataManagement } from '../../services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import { interval } from 'rxjs';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss']
})
export class CommunityPage implements OnInit {
  users: User[] = [];
  logged: User;
  keyword: string;
  isReady: boolean = false;
  notifications;

  constructor(
    public navCtrl: NavController,
    public dM: DataManagement,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController
  ) {
    const token = this.cookieService.get('token');
    this.dM
      .getUserLogged(token)
      .then(res => {
        this.logged = res;
        this.listUsers(null);
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  }
  public intervallTimer = interval(1000);
  private subscription;

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.subscription = this.intervallTimer.subscribe(x => {
      this.dM.getChatNotifications().then(res => {
        this.notifications = res.notifications;
        this.sortingUsers();
      });
    });
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goTo(destination: string) {
    this.navCtrl.navigateForward(destination);
  }
  sortingUsers() {
    this.users.sort((x, y) => {
      if (x.username === 'Support') {
        return -9007199254740991;
      } else if (y.username === 'Support') {
        return 9007199254740991;
      } else if (
        this.notifications[x.username] > this.notifications[y.username]
      ) {
        return -10 * this.notifications[x.username];
      } else if (
        this.notifications[x.username] < this.notifications[y.username]
      ) {
        return 10 * this.notifications[y.username];
      } else if (
        this.notifications[x.username] !== undefined &&
        this.notifications[y.username] === undefined
      ) {
        return -1;
      } else if (
        this.notifications[x.username] === undefined &&
        this.notifications[y.username] !== undefined
      ) {
        return 1;
      } else if (
        this.logged.blockedUsersByMe.includes(x.username) &&
        !this.logged.blockedUsersByMe.includes(y.username)
      ) {
        return 1;
      } else if (
        !this.logged.blockedUsersByMe.includes(x.username) &&
        this.logged.blockedUsersByMe.includes(y.username)
      ) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  chat(otherUsername) {
    this.notifications[otherUsername] = 0;

    this.navCtrl.navigateForward(
      '/chat/' + this.logged.username + '/' + otherUsername
    );
    this.dM.resetChatNotifications(otherUsername).then(res => {});
  }

  private listUsers(keyword: string): void {
    this.dM
      .listUsers(keyword)
      .then((data: any) => {
        this.users = data;
        this.dM.getChatNotifications().then(res => {
          this.notifications = res.notifications;
          this.sortingUsers();
          this.isReady = true;
        });
      })
      .catch(error => {});
  }

  blockUser(username: string) {
    let blockSureHeader: string = this.translate.instant(
      'COMMUNITY.BLOCK_SURE_HEADER'
    );
    let blockSureBody: string = this.translate.instant(
      'COMMUNITY.BLOCK_SURE_BODY'
    );
    let continuee: string = this.translate.instant('COMMUNITY.CONTINUE');
    let cancel: string = this.translate.instant('COMMUNITY.CANCEL');

    this.alertCtrl
      .create({
        header: blockSureHeader,
        message: blockSureBody,
        buttons: [
          {
            text: continuee,
            handler: () => {
              this.dM.blockUser(username).then(res => {
                this.notifications[username] = 0;
                this.dM.resetChatNotifications(username).then(res => {});
                const token = this.cookieService.get('token');
                this.dM
                  .getUserLogged(token)
                  .then(res => {
                    this.logged = res;
                    this.listUsers(null);
                    let blockSuccessHeader: string = this.translate.instant(
                      'COMMUNITY.BLOCK_SUCCESS_HEADER'
                    );
                    let blockSuccessBody: string = this.translate.instant(
                      'COMMUNITY.BLOCK_SUCCESS_BODY'
                    );
                    this.alertCtrl
                      .create({
                        header: blockSuccessHeader,
                        message: blockSuccessBody,
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
                  })
                  .catch(err => {
                    console.log('Error: ' + err);
                  });
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

  unblockUser(username: string) {
    let unblockSureHeader: string = this.translate.instant(
      'COMMUNITY.UNBLOCK_SURE_HEADER'
    );
    let unblockSureBody: string = this.translate.instant(
      'COMMUNITY.UNBLOCK_SURE_BODY'
    );
    let continuee: string = this.translate.instant('COMMUNITY.CONTINUE');
    let cancel: string = this.translate.instant('COMMUNITY.CANCEL');

    this.alertCtrl
      .create({
        header: unblockSureHeader,
        message: unblockSureBody,
        buttons: [
          {
            text: continuee,
            handler: () => {
              this.dM.unblockUser(username).then(res => {
                const token = this.cookieService.get('token');
                this.dM
                  .getUserLogged(token)
                  .then(res => {
                    this.logged = res;
                    this.listUsers(null);
                    let unblockSuccessHeader: string = this.translate.instant(
                      'COMMUNITY.UNBLOCK_SUCCESS_HEADER'
                    );
                    let unblockSuccessBody: string = this.translate.instant(
                      'COMMUNITY.UNBLOCK_SUCCESS_BODY'
                    );
                    this.alertCtrl
                      .create({
                        header: unblockSuccessHeader,
                        message: unblockSuccessBody,
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
                  })
                  .catch(err => {
                    console.log('Error: ' + err);
                  });
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

  searchUsers() {
    this.listUsers(this.keyword);
  }
}
