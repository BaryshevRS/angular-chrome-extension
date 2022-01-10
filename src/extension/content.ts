import {
  BehaviorSubject,
  fromEvent,
  ReplaySubject,
  skip,
  switchMap
} from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { StorageService } from "../app/services/storage/storage.service";
import { ConfigsService } from "../app/services/configs/configs.service";
import { Configs } from "../app/services/configs/configs";
import { checkConditions, extension } from "./content/extension";
import { PageContent, textNodesObservable } from './content/observable-text-nodes';
import { checkModalButton, checkModalRemove, modalHandler, modalRemoveHandler } from './content/modal';
import { getAnimal } from "./content/api";

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

const contentLoadedHandler = () => {
  const documentClick$ = fromEvent(document, 'click');

  documentClick$
    .pipe(
      filter(checkModalRemove),
      tap((event: Event) => {
        modalRemoveHandler(event as MouseEvent)
      })
    ).subscribe();

  documentClick$
    .pipe(
      filter(checkModalButton),
      switchMap((event: Event) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();

        const target = event.target as Element;
        const animal = target.textContent?.match(new RegExp(/cat/, 'i')) ? 'cat': 'dog';
        return getAnimal(animal).pipe(
          map((src) => ({animal, src, event}))
        )
      })
    ).subscribe(({animal, src, event}) => {
      modalHandler(event, src, animal)
  });
}

if (document.readyState !== 'loading') {
  contentLoadedHandler();
} else {
  document.addEventListener('DOMContentLoaded', contentLoadedHandler);
}
