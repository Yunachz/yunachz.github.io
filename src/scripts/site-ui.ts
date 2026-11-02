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
      // The chosen appearance remains active if storage is unavailable.
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
const mobileNavigation = window.matchMedia('(max-width: 64rem)');

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
  menuToggle?.setAttribute('aria-expanded', String(willOpen));
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (mobileNavigation.matches) closeNavigation();
}));

const contentDialog = document.querySelector<HTMLDialogElement>('#content-dialog');
const dialogContent = contentDialog?.querySelector<HTMLElement>('[data-dialog-content]');
const dialogClose = contentDialog?.querySelector<HTMLButtonElement>('[data-dialog-close]');
let lastDialogTrigger: HTMLElement | null = null;

function openDialog(trigger: HTMLElement, contents: Node): boolean {
  if (!contentDialog || !dialogContent || typeof contentDialog.showModal !== 'function') return false;
  try {
    dialogContent.replaceChildren(contents);
    const heading = dialogContent.querySelector<HTMLElement>('[data-dialog-title]');
    if (heading) {
      heading.id = 'dialog-title';
      contentDialog.setAttribute('aria-labelledby', heading.id);
    } else {
      const fallbackHeading = document.createElement('h2');
      fallbackHeading.id = 'dialog-title';
      fallbackHeading.textContent = 'Detail';
      dialogContent.prepend(fallbackHeading);
      contentDialog.setAttribute('aria-labelledby', fallbackHeading.id);
    }
    lastDialogTrigger = trigger;
    document.body.classList.add('dialog-open');
    contentDialog.showModal();
    dialogClose?.focus();
    return true;
  } catch {
    document.body.classList.remove('dialog-open');
    dialogContent.replaceChildren();
    return false;
  }
}

function createCvPreview(trigger: HTMLAnchorElement): HTMLElement {
  const section = document.createElement('section');
  section.className = 'cv-preview';
  const heading = document.createElement('h2');
  heading.dataset.dialogTitle = '';
  heading.textContent = 'Curriculum Vitae · ' + (trigger.dataset.cvName ?? 'Muhammad Fajar Sodik');
  const frame = document.createElement('iframe');
  frame.className = 'cv-preview__frame';
  frame.src = trigger.href;
  frame.title = 'Pratinjau CV PDF';
  frame.loading = 'eager';
  frame.setAttribute('allowfullscreen', '');
  const actions = document.createElement('div');
  actions.className = 'cv-preview__actions';
  const open = document.createElement('a');
  open.className = 'button button--quiet';
  open.href = trigger.href;
  open.target = '_blank';
  open.rel = 'noopener noreferrer';
  open.textContent = 'Buka PDF di tab baru';
  const download = document.createElement('a');
  download.className = 'button button--primary';
  download.href = trigger.href;
  download.download = 'cv-muhammad-fajar-sodik.pdf';
  download.textContent = 'Unduh CV PDF';
  actions.append(open, download);
  const note = document.createElement('p');
  note.className = 'cv-preview__note';
  note.textContent = 'Jika pratinjau tidak tersedia di browser, gunakan salah satu tautan PDF di atas.';
  section.append(heading, note, actions, frame);
  return section;
}

function focusableItems(): HTMLElement[] {
  if (!contentDialog) return [];
  return Array.from(contentDialog.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((element) => element.getClientRects().length > 0);
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const target = event.target;
  if (target.closest('[data-dialog-close]')) {
    contentDialog?.close();
    return;
  }
  if (contentDialog && target === contentDialog) {
    contentDialog.close();
    return;
  }

  const summary = target.closest('summary');
  const disclosure = summary?.closest<HTMLDetailsElement>('[data-record-dialog]');
  if (summary && disclosure && event.target instanceof Node) {
    const detailContent = disclosure.querySelector<HTMLElement>('[data-record-details]');
    if (detailContent) {
      const copy = detailContent.cloneNode(true);
      if (openDialog(summary, copy)) event.preventDefault();
    }
    return;
  }

  const anchor = target.closest<HTMLAnchorElement>('a[data-project-dialog], a[data-cv-dialog]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  if (anchor.hasAttribute('data-cv-dialog')) {
    if (openDialog(anchor, createCvPreview(anchor))) event.preventDefault();
    return;
  }

  const slug = anchor.dataset.projectDialog;
  const template = slug ? document.querySelector<HTMLTemplateElement>('#project-detail-' + CSS.escape(slug)) : null;
  if (template) {
    const content = template.content.cloneNode(true);
    if (openDialog(anchor, content)) event.preventDefault();
  }
});

dialogClose?.addEventListener('click', () => contentDialog?.close());
contentDialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  const trigger = lastDialogTrigger;
  lastDialogTrigger = null;
  trigger?.focus();
});
contentDialog?.addEventListener('cancel', () => {
  // The native dialog handles Escape; close cleanup and focus restoration run on its close event.
});
contentDialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const items = focusableItems();
  if (items.length === 0) {
    event.preventDefault();
    dialogClose?.focus();
    return;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (event.shiftKey && (document.activeElement === first || !contentDialog.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !contentDialog?.open && navigation && !navigation.hidden && mobileNavigation.matches) closeNavigation(true);
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
    if (projectCount) projectCount.textContent = visibleCount + ' proyek ditampilkan';
  };
  filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.categoryFilter ?? 'all')));
}

root.classList.add('theme-ready');
