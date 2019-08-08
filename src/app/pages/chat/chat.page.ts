import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataManagement } from 'src/app/services/dataManagement';
import { interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/app.data.model';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  loggedUsername: string;
  otherUsername: string;
  other: User = null;
  logged: User = null;
  message: string = '';
  messages: any;
  editMessage: any;
  editMessageForPlaceHolder: any;
  edit: boolean = false;
  private mutationObserver: MutationObserver;

  @ViewChild('content') content;
  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dm: DataManagement,
    private cookieService: CookieService,
    public actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    private translate: TranslateService
  ) {}
  public intervallTimer = interval(1000);
  private subscription;

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.loggedUsername = paramMap.get('loggedUsername');
      this.otherUsername = paramMap.get('otherUsername');
    });
    const token = this.cookieService.get('token');

    this.logged = await this.dm.getUserLogged(token);
    this.other = await this.dm.getUserBy(this.otherUsername, token);

    this.messages = await this.dm.getMessages(
      this.logged.username,
      this.other.username
    );
  }
  ionViewWillEnter() {
    this.subscription = this.intervallTimer.subscribe(x => {
      this.getMessages();
    });
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.mutationObserver.disconnect();
  }

  ionViewDidEnter() {
    this.content.scrollToBottom(300);
    this.mutationObserver = new MutationObserver(mutations => {
      this.content.scrollToBottom(300);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true,
      attributes: true,
      subtree: true
    });
  }

  keypress($event) {
    if ($event.keyCode == 13) {
      this.sendMessage();
    }
  }

  keypress2($event) {
    if ($event.keyCode == 13) {
      this.editMessages();
    }
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      console.log(event);
    }
  }

  async sendMessage() {
    const message = await this.dm.sendMessage(
      this.logged.username,
      this.other.username,
      this.message
    );
    this.message = '';
  }

  async getMessages() {
    const messages: any = await this.dm.getMessages(
      this.logged.username,
      this.other.username
    );

    const changed = await this.hasChanges(messages, this.messages);

    if (changed) {
      const indexNew = messages.length;
      let indexOld = this.messages.length;

      for (indexOld; indexOld < indexNew; indexOld++) {
        await this.messages.push(messages[indexOld]);
      }
    }

    let indexFinalOld = this.messages.length;
    for (let i = 0; i < indexFinalOld; i++) {
      if (this.messages[i].message !== messages[i].message) {
        this.messages[i].message = messages[i].message;
        this.messages[i].edited = messages[i].edited;
      }
    }
  }

  async hasChanges(newMessages: any, oldMessages: any) {
    if (newMessages.length === oldMessages.length) {
      return false;
    }
    return true;
  }

  async presentActionSheet(message: any) {
    const translationDeleteHeader: string = this.translate.instant(
      'CHAT.DELETE_CONFIRMATION_HEADER'
    );
    const translationDeleteMessage: string = this.translate.instant(
      'CHAT.DELETE_CONFIRMATION_MESSAGE'
    );
    const translationEditHeader: string = this.translate.instant(
      'CHAT.EDIT_CONFIRMATION_HEADER'
    );
    const translationEditMessage: string = this.translate.instant(
      'CHAT.EDIT_CONFIRMATION_MESSAGE'
    );
    const translationCancel: string = this.translate.instant('CHAT.CANCEL');
    const translationOK: string = this.translate.instant('CHAT.OK');
    const translationActions: string = this.translate.instant('CHAT.ACTIONS');
    const translationDelete: string = this.translate.instant('CHAT.DELETE');
    const translationEdit: string = this.translate.instant('CHAT.EDIT');

    const actionSheet = await this.actionSheetController.create({
      header: translationActions,
      buttons: [
        {
          text: translationDelete,
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.alertCtrl
              .create({
                header: translationDeleteHeader,
                message: translationDeleteMessage,
                buttons: [
                  {
                    text: translationOK,
                    handler: () => {
                      this.dm
                        .deleteMessages(message._id)
                        .then(res => {})
                        .catch(err => {
                          console.log(err);
                        });
                    }
                  },
                  {
                    text: translationCancel,
                    role: 'Cancel'
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        },
        {
          text: translationEdit,
          icon: 'create',
          handler: () => {
            this.alertCtrl
              .create({
                header: translationEditHeader,
                message: translationEditMessage,
                buttons: [
                  {
                    text: translationOK,
                    handler: () => {
                      this.editMessage = Object.create(message);
                      this.editMessageForPlaceHolder = message.message;
                      this.edit = true;
                    }
                  },
                  {
                    text: translationCancel,
                    role: 'Cancel'
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
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

  async editMessages() {
    const editMessage = await this.dm.editMessages(this.editMessage);
    this.editMessage = '';
    this.edit = false;
  }

  stopEditing() {
    this.editMessage = '';
    this.edit = false;
  }
}
