import { Observable } from "rxjs";

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

