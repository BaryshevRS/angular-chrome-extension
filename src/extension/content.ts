import {
  BehaviorSubject,
  ReplaySubject,
  skip,
  switchMap
} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getTextNodes } from "./content/text-nodes";
import { configMutation, observeOnMutation } from "./content/mutation-observable";
import { StorageService } from "../app/services/storage/storage.service";
import { ConfigsService } from "../app/services/configs/configs.service";
import { Configs } from "../app/services/configs/configs";

const storageService = new StorageService();
const configsService = new ConfigsService(storageService);

const test = () => {
  const span = document.createElement('div');
  span.innerHTML = 'update cat';

  document.body.appendChild(span);

  setInterval(() => {
    const b = document.createElement('div');
    b.innerHTML = 'new <b>dog</b> create';
    document.body.appendChild(b);
  }, 5000);

  setInterval(() => {
    let div = document.createElement('div');
    let p = document.createElement('p');
    p.innerHTML = 'new best cat';
    div.append(p);
    document.body.append(div);
  }, 6000);

}

const pageContent$ = new ReplaySubject();

const textNodesObservable = (checkConditions: (node: ChildNode) => boolean) => {
  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    if (checkConditions(node)) {
      pageContent$.next(node);
    }
  })

  // New values checks
  const mutationObservable = observeOnMutation(document.body, configMutation)
    .subscribe((mutations) => {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (mutationNode) {
          mutationNode.childNodes.forEach((mutationChildNode) => {
            const textNodes = getTextNodes(mutationChildNode);
            textNodes.forEach((node) => {
              if (checkConditions(node)) {
                pageContent$.next(node);
              }
            })
          });
        });
      });
    });

  return () => {
    mutationObservable.unsubscribe();
  }
}

const checkConditions = (node: ChildNode): boolean => {
  if (node.textContent?.match(/ cat |^cat$|^cat | cat$| dog |^dog$|^dog | dog$/i)) {
    return true;
  }
  return false;
}

const configs$ = new BehaviorSubject<Configs>({} as Configs);

configsService.getValue().subscribe((configs) => {
  // console.log('configs', configs);
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

// todo: removeListener
chrome.storage.onChanged.addListener(storageHandler);

const extension = (
  textNode: ChildNode,
  {
    enableExtension,
    disabledSites,
    loveCats,
    loveDogs
  }: Configs) => {

  if (
    (loveCats && loveDogs) ||
    (!loveCats && !loveDogs)
  ) {

  } else if (loveCats) {

  } else if (loveDogs) {

  }
}

const extension$ = configs$.asObservable()
  .pipe(
    skip(1),
    tap((t) => {
      console.log('tap', t)
    }),
    switchMap((configs: Configs) => pageContent$
      .pipe(map((textNode) => ({textNode, configs})))
    )
  )

extension$.subscribe(({textNode, configs}) => {
  console.log('newValue', {textNode, configs})
})

window.onload = () => {
  test();
  textNodesObservable(checkConditions);
}
