import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Services
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataManagement } from './services/dataManagement';
import { RestWS } from './services/restService';
import { ConfigService } from 'src/config/configService';

//Components
import { AuthGuard } from './guards/auth/auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UsernameValidator } from './validators/username.validator';
import { CustomEmailValidator } from './validators/email.validator';
import { PhoneNumberValidator } from './validators/phonenumber.validator';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    CookieService,
    ConfigService,
    DataManagement,
    RestWS,
    UsernameValidator,
    CustomEmailValidator,
    PhoneNumberValidator,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
