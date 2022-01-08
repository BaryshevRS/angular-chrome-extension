import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from "../ui/ui.module";
import { WelcomeComponent } from "./welcome.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: 'welcome', component: WelcomeComponent
  }
]

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    RouterModule.forChild(routes)
  ]
})
export class WelcomeModule { }
