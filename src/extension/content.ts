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

interface PageContent {
  textNode: ParentNode,
  textContent: string
}

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
  }, 10000);

  // setInterval(() => {
  //   let div = document.createElement('div');
  //   let p = document.createElement('p');
  //   p.innerHTML = 'new best cat';
  //   div.append(p);
  //   document.body.append(div);
  // }, 6000);
}

const pageContent$ = new ReplaySubject<PageContent>();

const textNodesObservable = (checkConditions: (node: ChildNode) => boolean) => {
  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    if (checkConditions(node)) {
      pageContent$.next({
        textNode: node.parentNode as ParentNode,
        textContent: node.textContent || ''
      });
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
                pageContent$.next({
                  textNode: node.parentNode as ParentNode,
                  textContent: node.textContent || ''
                })
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
  if (
    node.textContent?.match(new RegExp(/cat/, 'gi')) ||
    node.textContent?.match(new RegExp(/dog/, 'gi'))
  ) {
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

const setMatches = (text = '', changeTo?: Record<string, string>) => {
  text = text
    .replace(
      new RegExp(/(^cat[^a-z]{1}|^cat$|[^a-z]{1}cat[^a-z]{1}|[^a-z]{1}cat$)/, 'gi'),
      `<span data-meobwoof>$1</span>`
    )
    .replace(
      new RegExp(/(^dog[^a-z]{1}|^dog$|[^a-z]{1}dog[^a-z]{1}|[^a-z]{1}dog$)/, 'gi'),
      `<span data-meobwoof>$1</span>`
    )
    .replace(
      new RegExp(/(^cats[^a-z]{1}|^cats$|[^a-z]{1}cats[^a-z]{1}|[^a-z]{1}cats$)/, 'gi'),
      `<span data-meobwoof>$1</span>`
    )
    .replace(
      new RegExp(/(^dogs[^a-z]{1}|^dogs$|[^a-z]{1}dogs[^a-z]{1}|[^a-z]{1}dogs$)/, 'gi'),
      `<span data-meobwoof>$1</span>`
    );

  if (changeTo) {
    Object.entries(changeTo).forEach(([from, to]) => {
      text = text.replace(
        new RegExp(`[^>]*?${from}[^<]*?`, 'g'),function (str: string) {
          return str.replace(from, to)
        }
      )
    });
  }

  return text;
}

const extension = (
  textNode: ParentNode,
  {
    enableExtension,
    disabledSites,
    loveCats,
    loveDogs
  }: Configs,
  textContent = ''
) => {
  const parentNode = textNode; // textNode.parentNode;
  let text = textContent // parentNode?.textContent || '';

  // console.log('textContent', textNode);

  if (
    (loveCats && loveDogs) ||
    (!loveCats && !loveDogs)
  ) {
    text = setMatches(text);
  } else if (loveCats) {
    text = setMatches(text, {'Dogs': 'Cats', 'dogs': 'cats', 'Dog': 'Cat', 'dog': 'cat'});
  } else if (loveDogs) {
    text = setMatches(text, {'Cats': 'Dogs', 'cats': 'dogs', 'Cat': 'Dog', 'cat': 'dog'});
  }

  try {
    (parentNode! as HTMLElement).innerHTML = text;
  } catch (e) {
    console.error(e)
  }
}

const extension$ = configs$.asObservable()
  .pipe(
    skip(1),
    switchMap((configs: Configs) => pageContent$
      .pipe(map((obj: PageContent) => ({...obj, configs})))
    )
  );

extension$.subscribe(({textNode, configs, textContent}) => {
  // console.log('newValue', {textNode, configs})
  extension(textNode, configs, textContent)
})

window.onload = () => {
  test();
  textNodesObservable(checkConditions);
}