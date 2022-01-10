import {
  BehaviorSubject,
  ReplaySubject,
  skip,
  switchMap
} from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from "../app/services/storage/storage.service";
import { ConfigsService } from "../app/services/configs/configs.service";
import { Configs } from "../app/services/configs/configs";
import { checkConditions, extension } from "./content/extension";
import { PageContent, textNodesObservable } from './content/observable-text-nodes';

const storageService = new StorageService();
const configsService = new ConfigsService(storageService);

const pageContent$ = new ReplaySubject<PageContent>();
const configs$ = new BehaviorSubject<Configs>({} as Configs);

configsService.getValue().subscribe((configs) => {
  configs$.next(configs);
});

// Отслеживаем изменения
const storageHandler = function (changes: Record<string, any>) {
  for (let [key, value] of Object.entries(changes)) {
    if (key === 'configs') {
      const {newValue}: Record<string, Configs> = value;
      // console.log('newValue', newValue)
      configs$.next(newValue);
    }
  }
}

chrome.storage.onChanged.addListener(storageHandler);

const extension$ = configs$.asObservable()
  .pipe(
    skip(1),
    switchMap((configs: Configs) => pageContent$
      .pipe(map((obj: PageContent) => ({...obj, configs})))
    )
  );

extension$.subscribe(({textNode, configs, textContent}) => {
  extension(textNode, configs, textContent)
})

window.onload = () => {
  textNodesObservable((node: ChildNode | null) => {
    const textContent = node?.parentNode?.textContent || '';
    if (checkConditions(node)) {
      pageContent$.next({
        textNode: node?.parentNode as ParentNode,
        textContent
      });
    }
  });
}
