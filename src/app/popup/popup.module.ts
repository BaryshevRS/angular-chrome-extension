import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from "../ui/ui.module";
import { PopupComponent } from "./popup.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    PopupComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule
  ]
})
export class PopupModule { }
