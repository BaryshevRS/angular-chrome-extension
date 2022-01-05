import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from "./welcome/welcome.component";
import { PopupComponent } from "./popup/popup.component";

const routes: Routes = [
  {
    path: '', component: PopupComponent,
  },
  {
    path: 'welcome', component: WelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
