// Each tab points to its panel through aria-controls.
const tabList = document.querySelector('[role="tablist"]');
const tabBar = document.querySelector('.session-tab-bar');
const previous = document.querySelector('.tab-scroll-previous');
const next = document.querySelector('.tab-scroll-next');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
const panels = tabs
  .map(tab => document.getElementById(tab.getAttribute('aria-controls')))
  .filter(Boolean);
const selectedTabKey = 'inkling-for-greatness:selected-tab';

function updateScrollButtons() {
  const maxScroll = tabList.scrollWidth - tabList.clientWidth;
  previous.disabled = tabList.scrollLeft <= 1;
  next.disabled = tabList.scrollLeft >= maxScroll - 1;
}

function revealTab(tab) {
  const listRect = tabList.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  if (tabRect.width > listRect.width || tabRect.left < listRect.left) {
    tabList.scrollLeft += tabRect.left - listRect.left;
  }
  else if (tabRect.right > listRect.right) tabList.scrollLeft += tabRect.right - listRect.right;
}

// Keep the frame at the height of its tallest panel so switching tabs does not
// move the page or make the scrollbar appear and disappear.
function syncPanelHeight() {
  const hidden = panels.map(panel => panel.hidden);
  panels.forEach(panel => { panel.style.minHeight = ''; panel.hidden = false; });
  const height = Math.max(...panels.map(panel => panel.offsetHeight));
  panels.forEach((panel, index) => {
    panel.hidden = hidden[index];
    panel.style.minHeight = `${height}px`;
  });
}

function selectTab(selected, persist = true) {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
  }
  if (persist) {
    try {
      localStorage.setItem(selectedTabKey, selected.id);
    } catch {
      // Ignore storage failures; tab switching still works normally.
    }
  }
}

let savedTabId = null;
try {
  savedTabId = localStorage.getItem(selectedTabKey);
} catch {
  // Ignore storage failures and use the HTML-selected tab.
}
const initialTab = tabs.find(tab => tab.id === savedTabId)
  || tabs.find(tab => tab.getAttribute('aria-selected') === 'true')
  || tabs[0];
if (initialTab) selectTab(initialTab, false);
if (initialTab) revealTab(initialTab);

tabBar.classList.add('enhanced');
previous.hidden = false;
next.hidden = false;
updateScrollButtons();
tabList.addEventListener('scroll', updateScrollButtons, { passive: true });
for (const [button, direction] of [[previous, -1], [next, 1]]) {
  button.addEventListener('click', () => {
    tabList.scrollBy({ left: direction * tabList.clientWidth * .7, behavior: 'auto' });
  });
}

syncPanelHeight();
window.addEventListener('resize', () => {
  syncPanelHeight();
  updateScrollButtons();
});
tabList.addEventListener('click', event => {
  const tab = event.target.closest('[role="tab"]');
  if (tab && tabs.includes(tab)) {
    selectTab(tab);
    revealTab(tab);
  }
});
tabList.addEventListener('keydown', event => {
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;
  event.preventDefault();
  selectTab(tabs[next]);
  revealTab(tabs[next]);
  tabs[next].focus({ preventScroll: true });
});
