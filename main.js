document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

const heroTabs = [...document.querySelectorAll('.hero-controls [role="tab"]')];
const heroPanels = heroTabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
let activeHeroPanel = heroTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
let hidePreviousPanel;

const activateHeroPanel = (index, moveFocus = false) => {
  if (index === activeHeroPanel) return;
  const previousPanel = heroPanels[activeHeroPanel];
  const nextPanel = heroPanels[index];
  clearTimeout(hidePreviousPanel);
  heroPanels.forEach((panel, panelIndex) => {
    if (panelIndex !== activeHeroPanel && !panel.hidden) {
      panel.hidden = true;
      panel.classList.remove('is-entering', 'is-leaving');
    }
  });

  heroTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  previousPanel.setAttribute('aria-hidden', 'true');
  previousPanel.classList.add('is-leaving');
  nextPanel.hidden = false;
  nextPanel.setAttribute('aria-hidden', 'false');
  nextPanel.classList.add('is-entering');
  requestAnimationFrame(() => nextPanel.classList.remove('is-entering'));

  hidePreviousPanel = setTimeout(() => {
    previousPanel.hidden = true;
    previousPanel.classList.remove('is-leaving');
  }, 360);
  activeHeroPanel = index;
  if (moveFocus) heroTabs[index].focus();
};

heroTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateHeroPanel(index));
  tab.addEventListener('keydown', (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (event.key in keys) {
      event.preventDefault();
      activateHeroPanel((index + keys[event.key] + heroTabs.length) % heroTabs.length, true);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      activateHeroPanel(0, true);
    }
    if (event.key === 'End') {
      event.preventDefault();
      activateHeroPanel(heroTabs.length - 1, true);
    }
  });
});
