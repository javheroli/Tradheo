import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ModalPage } from './modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  declarations: [ModalPage],
  entryComponents: [ModalPage]
})
export class ModalPageModule {}
