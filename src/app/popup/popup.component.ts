import { Component, OnInit } from '@angular/core';
import { ConfigsService } from "../services/configs/configs.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, from, Subject, takeUntil, withLatestFrom } from "rxjs";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  public configsForm!: FormGroup;
  public url: string = '';
  private unSubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private configs: ConfigsService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    // Current tab get
    const currentTab = from(new Promise<{ url: string }>((resolve) => {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        resolve(tabs[0] as { url: string });
      });
    }));

    this.configs.getValue()
      .pipe(
        withLatestFrom(
          currentTab
        ),
        takeUntil(this.unSubscribe$)
      ).subscribe(([configs, tab]) => {
      this.url = new URL(tab.url as string).host;

      // Form init
      this.configsForm = this.fb.group({
        enableExtension: [configs.enableExtension],
        enableSite: [!configs.disabledSites.includes(this.url)],
        loveCats: [configs.loveCats],
        loveDogs: [configs.loveDogs],
      });

      // Form updated on change
      this.configsForm.valueChanges
        .pipe(
          debounceTime(400),
          takeUntil(this.unSubscribe$)
        ).subscribe((value) => {
        this.configs.setValue(
          configs,
          value,
          this.url
        );
      });
    });
  }
}
