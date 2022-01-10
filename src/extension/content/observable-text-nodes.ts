import { Observable } from "rxjs";

export interface PageContent {
  textNode: ParentNode,
  textContent: string
}

export const getTextNodes = (node: ChildNode, result: ChildNode[] = []) => {
  if (node.childNodes.length) {
    for (var i = 0; i < node.childNodes.length; i++) {
      result = getTextNodes(node.childNodes[i], result);
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    if (!(node.parentNode as HTMLElement).tagName.match(/script|style/i)) {
      result.push(node);
    }
  }
  return result;
};

export const observeOnMutation = (target: HTMLElement, config: Record<string, boolean> ): Observable<MutationRecord[]> => {
  return new Observable((observer) => {
    const mutation = new MutationObserver((mutations, instance) => {
      observer.next(mutations);
    });
    mutation.observe(target, config);
    const unsubscribe = () => {
      mutation.disconnect();
    };
    return unsubscribe;
  });
};

export const configMutation = { attributes: false, childList: true, characterData: false };

export const textNodesObservable = (cb: (parentNode: ChildNode | null) => void) => {
  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    cb(node)
  });

  // New values checks
  const mutationObservable = observeOnMutation(document.body, configMutation)
    .subscribe((mutations) => {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (mutationNode) {
          mutationNode.childNodes.forEach((mutationChildNode) => {
            const textNodes = getTextNodes(mutationChildNode);
            textNodes.forEach((node) => {
              cb(node);
            })
          });
        });
      });
    });

  return () => {
    mutationObservable.unsubscribe();
  }
}
