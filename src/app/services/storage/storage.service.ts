import { Injectable } from '@angular/core';
import { from as fromPromise, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  get<T>(key: string[] | string): Observable<Record<string, T>> {
    return fromPromise<PromiseLike<Record<string, T>>>(new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items: Record<string, T>) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            reject();
          } else {
            resolve(items);
          }
        });
      })
    );
  }

  set<T>(keyValue: Record<string, T>): Observable<boolean> {
    return fromPromise(new Promise<boolean>((resolve, reject) => {
      chrome.storage.local.set(keyValue, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(false);
        } else {
          resolve(true);
        }
      });
    }));
  }
}
