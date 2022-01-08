import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopupModule } from "./popup/popup.module";
import { WelcomeModule } from "./welcome/welcome.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PopupModule,
    WelcomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
