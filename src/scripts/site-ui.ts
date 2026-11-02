const root = document.documentElement;
const themeSelect = document.querySelector<HTMLSelectElement>('#theme-mode');
const themeControl = document.querySelector<HTMLElement>('[data-theme-control]');
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
const themeKey = 'portfolio-theme';

function setTheme(mode: string, persist: boolean): void {
  const selected = mode === 'light' || mode === 'dark' ? mode : 'system';
  root.dataset.themeMode = selected;
  root.dataset.theme = selected === 'system' ? (themePreference.matches ? 'dark' : 'light') : selected;
  if (themeSelect) themeSelect.value = selected;

  if (persist) {
    try {
      if (selected === 'system') localStorage.removeItem(themeKey);
      else localStorage.setItem(themeKey, selected);
    } catch {
      // Persistence can fail; the selected theme still applies for this page.
    }
  }
}

setTheme(root.dataset.themeMode ?? 'system', false);
themeSelect?.addEventListener('change', () => setTheme(themeSelect.value, true));
themePreference.addEventListener('change', () => {
  if (root.dataset.themeMode === 'system') setTheme('system', false);
});
themeControl?.removeAttribute('hidden');

const navigation = document.querySelector<HTMLElement>('#primary-navigation');
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle');
const mobileNavigation = window.matchMedia('(max-width: 52rem)');

function setNavigationForViewport(): void {
  if (!navigation || !menuToggle) return;
  const isMobile = mobileNavigation.matches;
  menuToggle.hidden = !isMobile;
  if (isMobile) {
    navigation.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  } else {
    navigation.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
  }
}

function closeNavigation(restoreFocus = false): void {
  if (!navigation || !menuToggle) return;
  navigation.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuToggle.focus();
}

setNavigationForViewport();
mobileNavigation.addEventListener('change', setNavigationForViewport);
menuToggle?.addEventListener('click', () => {
  if (!navigation) return;
  const willOpen = navigation.hidden;
  navigation.hidden = !willOpen;
  menuToggle.setAttribute('aria-expanded', String(willOpen));
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (mobileNavigation.matches) closeNavigation();
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation && !navigation.hidden && mobileNavigation.matches) closeNavigation(true);
});

const filters = document.querySelector<HTMLElement>('[data-project-filters]');
const filterButtons = filters?.querySelectorAll<HTMLButtonElement>('[data-category-filter]');
const projectCards = Array.from(document.querySelectorAll<HTMLElement>('[data-project-card]'));
const projectCount = document.querySelector<HTMLElement>('[data-project-count]');

if (filters && filterButtons?.length && projectCards.length) {
  filters.hidden = false;
  const applyFilter = (category: string) => {
    let visibleCount = 0;
    for (const card of projectCards) {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    }
    for (const button of filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === category));
    }
    if (projectCount) projectCount.textContent = `${visibleCount} proyek ditampilkan`;
  };
  filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.categoryFilter ?? 'all')));
}

root.classList.add('theme-ready');
