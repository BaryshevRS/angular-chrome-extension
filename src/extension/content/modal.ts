const modalRemove = () => {
  const modal = document.getElementById("meowoof");
  modal?.parentNode?.removeChild(modal);
}

const templateModal = (left: number, top: number, src = '', animal = ''): string => `
<div style="left: ${left}px; top: ${top}px" id="meowoof">
    <div id="meowoof-header">
        <div>
            <span>Look!</span> It’s a ${animal}!</div>
            <div id="meowoof-close"></div>
        </div>
        <div id="meowoof-img">
            <div class="lds-ripple"><div></div><div></div></div>
            <img src="${src}" alt="">
        </div>
</div>`;

const disableAnimalButton = (animal: string) => {
  const spaceEmpty = '&#8288;'
  const firstChars = animal[0] + spaceEmpty;
  return firstChars + animal.slice(1);
}

export const checkModalRemove = (e: Event) => {
  return (e.target as Element).id === 'meowoof-close';
}

export const modalRemoveHandler = (e: MouseEvent) => {
  if ((e.target as Element).id === 'meowoof-close') {
    modalRemove();
  }
}

export const checkModalButton = (e: Event) => {
  const target = e.target as Element;
  return target.getAttributeNames().includes('data-meowoof');
}

export const modalHandler = (e: Event, src: string, animal: string) => {
  const target = e.target as Element;
  let rect = target.getBoundingClientRect();
  const modalWidth = 400;
  const modalHeight = 280;
  const width = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;

  let top = rect.top + rect.height + window.scrollY;
  if (height - rect.bottom < modalHeight) {
    top = rect.top + rect.height + window.scrollY - modalHeight - 20;
  }

  let left = rect.left + window.scrollX;
  if (width - left < modalWidth) {
    left = width - modalWidth - 10;
  }

  modalRemove();
  document.body.insertAdjacentHTML(
    'beforeend',
    templateModal(left, top, src, disableAnimalButton(animal))
  );
}
