// Keep iOS from rubber-banding the page while allowing long menus to scroll.
let lastTouchY = 0;

document.addEventListener('touchstart', event => {
  if (event.touches.length === 1) lastTouchY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', event => {
  if (event.touches.length !== 1) return;

  const y = event.touches[0].clientY;
  const delta = y - lastTouchY;
  lastTouchY = y;
  if (!delta) return;

  const canScroll = element => element.scrollHeight > element.clientHeight + 1 &&
    (delta > 0 ? element.scrollTop > 0 : element.scrollTop + element.clientHeight < element.scrollHeight - 1);

  for (let element = event.target; element instanceof Element; element = element.parentElement) {
    if (/^(auto|scroll)$/.test(getComputedStyle(element).overflowY) && canScroll(element)) return;
  }

  const page = document.scrollingElement;
  if (page && !/^(hidden|clip)$/.test(getComputedStyle(page).overflowY) && canScroll(page)) return;
  event.preventDefault();
}, { passive: false });
