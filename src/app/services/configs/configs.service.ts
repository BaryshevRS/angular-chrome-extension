import { Injectable } from '@angular/core';
import { StorageService } from "../storage/storage.service";
import { Configs, ConfigsInit, StorageKey } from "./configs";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  constructor(
    private storage: StorageService
  ) {}

  getValue(): Observable<Configs> {
    return this.storage.get<Configs>(StorageKey)
      .pipe(
        map(({[StorageKey]: configs}) => {
          console.log('configs1', configs);
          return ({...ConfigsInit, ...configs})
        })
      );
  }

  setValue(
    configs: Configs,
    formConfigs: Omit<Configs, 'disabledSites'> & {enableSite: string},
    site: string
  ): Observable<boolean> {
    const {enableSite, ...configsNew} = formConfigs;
    const disabledSites = !enableSite ?
      [...new Set([...configs.disabledSites, site])] :
      configs.disabledSites.filter((s) => s !== site);

    console.log('itogoF', {...configsNew, disabledSites});

    return this.storage.set({[StorageKey]: {...configsNew, disabledSites}});
  }

  toStorage() {
  }
}
