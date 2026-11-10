// Each tab points to its panel through aria-controls.
const tabList = document.querySelector('[role="tablist"]');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
function selectTab(selected) {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
  }
}
tabList.addEventListener('click', event => {
  const tab = event.target.closest('[role="tab"]');
  if (tab && tabs.includes(tab)) selectTab(tab);
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
  tabs[next].focus();
});
