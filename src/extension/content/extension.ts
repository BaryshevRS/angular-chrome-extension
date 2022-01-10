import { Configs } from "../../app/services/configs/configs";

const setMatches = (text = '', changeTo?: Record<string, string>) => {
  const words = ['cat', 'dog', 'cats', 'dogs'];

  words.forEach((w) => {
    text = text
      .replace(
        new RegExp(`(^${w}[^a-z]{1}|^${w}$|[^a-z]{1}${w}[^a-z]{1}|[^a-z]{1}${w}$)`, 'gi'),
        `<span data-meobwoof>$1</span>`
      )
  })

  if (changeTo) {
    Object.entries(changeTo).forEach(([from, to]) => {
      text = text.replace(
        new RegExp(`[^>]*?${from}[^<]*?`, 'g'), function (str: string) {
          return str.replace(from, to)
        }
      )
    });
  }

  return text;
}

export const checkConditions = (node: ChildNode | null): boolean => {
  return !!(node?.textContent?.match(new RegExp(/cat/, 'gi')) ||
    node?.textContent?.match(new RegExp(/dog/, 'gi')));
}

export const extension = (
  parentNode: ParentNode,
  {
    enableExtension,
    disabledSites,
    loveCats,
    loveDogs
  }: Configs,
  text = ''
) => {
  console.log('textContent', text);

  if (enableExtension && !disabledSites.includes(location.host)) {
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
  }

  try {
    (parentNode as HTMLElement).innerHTML = text;
  } catch (e) {
    // console.error(e)
  }
}
