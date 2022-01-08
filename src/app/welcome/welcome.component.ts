import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from "rxjs";
import { ConfigsService } from "../services/configs/configs.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  formWelcome!: FormGroup;
  private unSubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private configs: ConfigsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configs.getValue()
      .pipe(
        takeUntil(this.unSubscribe$)
      ).subscribe((configs) => {
      // Form init
      this.formWelcome = this.fb.group({
        loveCats: [configs.loveCats],
        loveDogs: [configs.loveDogs],
      });

      // Form updated on change
      this.formWelcome.valueChanges
        .pipe(
          debounceTime(400),
          takeUntil(this.unSubscribe$)
        ).subscribe((value) => {
        this.configs.setValue(
          configs,
          value
        );
      });
    });
  }
}
