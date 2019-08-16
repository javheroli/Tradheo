import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/app.data.model';
import { DataManagement } from 'src/app/services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  public user: User;
  private username: string;

  constructor(
    private dm: DataManagement,
    private coockieService: CookieService,
    private activatedRoute: ActivatedRoute,
    public events: Events
  ) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    this.getUserData(this.username);
    events.subscribe('user:rechargeImage', () => {
      this.getUserData(this.username);
    });
  }

  ngOnInit() {}

  private getUserData(username: string) {
    if (username) {
      this.getUser(username);
    } else {
      this.getUserLogged();
    }
  }

  private getUserLogged() {
    const token = this.coockieService.get('token');
    this.dm
      .getUserLogged(token)
      .then((res: User) => {
        this.user = res;
      })
      .catch(error => {
        console.log(error);
      });
  }

  private getUser(username: string) {
    const token = this.coockieService.get('token');
    this.dm
      .getUserBy(username, token)
      .then((res: User) => {
        this.user = res;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
