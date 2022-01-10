const modalRemove = () => {
  const modal = document.getElementById("meobwoof");
  modal?.parentNode?.removeChild(modal);
}

export const modalRemoveHandler = (e: MouseEvent) => {
  if ((e.target as Element).id === 'meobwoof-close') {
    modalRemove();
  }
}

export const modalHandler = (e: MouseEvent) => {
  const target = e.target as Element;
  if (target.getAttributeNames().includes('data-meobwoof')) {
    e.preventDefault();
    let rect = target.getBoundingClientRect();
    const modalWidth = 400;
    const modalHeight = 280;
    const width  = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight||
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
    document.body.insertAdjacentHTML('beforeend',
      `<div style="left: ${left}px; top: ${top}px" id="meobwoof">
               <div id="meobwoof-header">
                    <div>
                     <span>Look!</span> It’s a c&#8288;at!
                    </div>
                    <div id="meobwoof-close"></div>
                </div>
                <div id="meobwoof-img">
                    <img src="https://www.purinaone.ru/cat/sites/default/files/2020-08/factori-min.jpg" alt="">
                </div>
            </div>`
    );
  }
}
