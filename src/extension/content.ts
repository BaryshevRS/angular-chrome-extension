import { of, Observable, BehaviorSubject, ReplaySubject, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getTextNodes } from "./content/text-content";
import { configMutation, observeOnMutation } from "./content/mutation-observable";

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

const store = new ReplaySubject();

const textNodesObservable = (checkConditions: (node: ChildNode) => boolean) => {
  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    if (checkConditions(node)) {
      store.next(node);
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
                store.next(node);
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

var x = 0;
store.subscribe((values) => {
  ++x;
  console.log('node', (values as HTMLElement).nodeValue?.toString());
  console.log('x', x)
})

window.onload = () => {
  test();
  (document.querySelector('h1') as HTMLHeadingElement).style.backgroundColor = 'red';

  textNodesObservable(checkConditions);
}
