import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialSharing } from '@ionic-native/social-sharing';

import { billServiceProvider } from './providers/bill-service/bills-service';
import { InputDialogServiceProvider } from './providers/input-dialog-service/input-dialog-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Tab3Page} from './tab3/tab3.page'


import { 
  HTTP_INTERCEPTORS, 
  HttpClientModule 
} from '@angular/common/http';
import { HttpConfigInterceptor } from './httpConfig.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,ReactiveFormsModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  },{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },SocialSharing,billServiceProvider,
    InputDialogServiceProvider,Tab3Page],
  bootstrap: [AppComponent],
})
export class AppModule {}
