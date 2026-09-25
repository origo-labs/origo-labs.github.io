document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

const heroTabs = [...document.querySelectorAll('.hero-controls [role="tab"]')];
const heroPanels = heroTabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

const activateHeroPanel = (index, moveFocus = false) => {
  heroTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    heroPanels[tabIndex].hidden = !active;
  });
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
