import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PopupComponent } from './popup/popup.component';
import { SwitchComponent } from './ui/switch/switch.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PopupComponent,
    SwitchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
