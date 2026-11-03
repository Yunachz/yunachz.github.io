import { messages, translate, type Locale, type MessageKey } from '../lib/i18n';
import { clampPageIndex, paginateRecords } from '../lib/credential-pagination';

const root = document.documentElement;
const localeStorageKey = 'portfolio-locale';
const themeStorageKey = 'portfolio-theme';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
let locale: Locale = root.dataset.locale === 'en' ? 'en' : 'id';
const localeToggle = document.querySelector<HTMLButtonElement>('[data-locale-toggle]');
const emailButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const emailAnnouncement = document.querySelector<HTMLElement>('[data-copy-announcement]');
const emailAddress = emailButton?.dataset.copyEmail ?? '';
type EmailCopyPhase = 'idle' | 'pending' | 'success' | 'error';
let emailCopyPhase: EmailCopyPhase = 'idle';
let emailCopyDeadline = 0;
let emailCopyGeneration = 0;
let emailCopyTimer: number | undefined;

function updateLocaleToggle(): void {
  if (!localeToggle) return;
  const key: MessageKey = locale === 'id' ? 'locale.idActiveSwitchToEn' : 'locale.enActiveSwitchToId';
  localeToggle.dataset.currentLocale = locale;
  localeToggle.setAttribute('aria-label', messages[locale][key]);
}

function renderEmailCopyState(): void {
  if (emailButton) {
    emailButton.textContent = emailCopyPhase === 'success' ? messages[locale]['contact.copied'] : emailAddress;
    emailButton.dataset.copyState = emailCopyPhase;
    emailButton.setAttribute('aria-busy', String(emailCopyPhase === 'pending'));
  }
  if (!emailAnnouncement) return;
  if (emailCopyPhase === 'success' || emailCopyPhase === 'error') {
    const key: MessageKey = emailCopyPhase === 'success' ? 'contact.copied' : 'contact.copyFailed';
    emailAnnouncement.dataset.messageKey = key;
    emailAnnouncement.textContent = messages[locale][key];
    emailAnnouncement.dataset.state = emailCopyPhase;
  } else {
    emailAnnouncement.textContent = '';
    emailAnnouncement.removeAttribute('data-message-key');
    emailAnnouncement.dataset.state = emailCopyPhase;
  }
}

function applyLocale(nextLocale: Locale): void {
  locale = nextLocale;
  root.dataset.locale = nextLocale;
  root.lang = nextLocale;
  document.querySelectorAll<HTMLElement>('[data-copy-id][data-copy-en]').forEach((node) => {
    node.textContent = nextLocale === 'id' ? node.dataset.copyId ?? '' : node.dataset.copyEn ?? '';
  });
  document.querySelectorAll<HTMLElement>('[data-aria-id][data-aria-en]').forEach((node) => {
    node.setAttribute('aria-label', nextLocale === 'id' ? node.dataset.ariaId ?? '' : node.dataset.ariaEn ?? '');
  });
  document.querySelectorAll<HTMLImageElement>('[data-alt-id][data-alt-en]').forEach((image) => {
    image.alt = nextLocale === 'id' ? image.dataset.altId ?? '' : image.dataset.altEn ?? '';
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-download-locale]').forEach((node) => {
    const key: MessageKey = node.dataset.downloadLocale === 'id' ? 'cv.downloadIdLabel' : 'cv.downloadEnLabel';
    node.setAttribute('aria-label', messages[nextLocale][key]);
  });
  document.querySelectorAll<HTMLIFrameElement>('[data-cv-frame][data-document-locale]').forEach((frame) => {
    const key: MessageKey = frame.dataset.documentLocale === 'id' ? 'cv.frameId' : 'cv.frameEn';
    frame.title = translate(nextLocale, key);
  });
  document.querySelectorAll<HTMLElement>('[data-message-key]').forEach((node) => {
    const key = node.dataset.messageKey as MessageKey | undefined;
    if (key && key in messages[nextLocale]) node.textContent = messages[nextLocale][key];
  });
  document.querySelectorAll<HTMLElement>('[data-dialog-aria-id][data-dialog-aria-en]').forEach((node) => {
    node.setAttribute('aria-label', nextLocale === 'id' ? node.dataset.dialogAriaId ?? '' : node.dataset.dialogAriaEn ?? '');
  });
  updateLocaleToggle();
  renderEmailCopyState();
  document.title = nextLocale === 'id' ? root.dataset.titleId ?? document.title : root.dataset.titleEn ?? document.title;
  const description = document.querySelector<HTMLMetaElement>('[data-meta-description]');
  if (description) description.content = nextLocale === 'id' ? root.dataset.descriptionId ?? '' : root.dataset.descriptionEn ?? '';
  const ogTitle = document.querySelector<HTMLMetaElement>('[data-meta-title]');
  if (ogTitle) ogTitle.content = document.title;
  const ogDescription = document.querySelector<HTMLMetaElement>('[data-meta-og-description]');
  if (ogDescription) ogDescription.content = description?.content ?? '';
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', nextLocale === 'id' ? 'id_ID' : 'en_US');
  try { localStorage.setItem(localeStorageKey, nextLocale); } catch {}
  root.classList.remove('locale-pending');
  updateNavigationState();
  updateSkillState();
  updateProjectState(false);
  updateExperienceState();
  updateCredentialState(undefined, false);
}

localeToggle?.addEventListener('click', () => applyLocale(locale === 'id' ? 'en' : 'id'));

const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
type ThemeTransition = { ready?: Promise<unknown>; finished: Promise<unknown>; skipTransition: () => void };
let activeThemeTransition: ThemeTransition | undefined;
let themeSequence = 0;
let intendedTheme: 'light' | 'dark' = root.dataset.theme === 'dark' ? 'dark' : 'light';
let userThemeIntent = false;
type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ThemeTransition;
};

function writeTheme(theme: 'light' | 'dark', persist: boolean, updateMode = true): void {
  root.dataset.theme = theme;
  if (updateMode) root.dataset.themeMode = theme;
  try {
    if (persist) localStorage.setItem(themeStorageKey, theme);
  } catch {}
  const nextAction: MessageKey = theme === 'dark' ? 'theme.toLight' : 'theme.toDark';
  const label = messages[locale][nextAction];
  themeToggle?.setAttribute('aria-label', label);
  themeToggle?.setAttribute('data-aria-id', messages.id[nextAction]);
  themeToggle?.setAttribute('data-aria-en', messages.en[nextAction]);
  themeToggle?.removeAttribute('hidden');
}

function themeOrigin(): { x: number; y: number; radius: number } {
  const rect = themeToggle?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  return { x, y, radius };
}

function clearThemeReveal(): void {
  root.style.removeProperty('--theme-origin-x');
  root.style.removeProperty('--theme-origin-y');
  root.style.removeProperty('--max-radius');
}

function cancelThemeTransition(): void {
  try { activeThemeTransition?.skipTransition(); } catch {}
  activeThemeTransition = undefined;
}

async function toggleTheme(): Promise<void> {
  const sequence = ++themeSequence;
  userThemeIntent = true;
  intendedTheme = intendedTheme === 'dark' ? 'light' : 'dark';
  const nextTheme = intendedTheme;
  const documentWithTransition = document as TransitionDocument;
  if (reduceMotion.matches || !documentWithTransition.startViewTransition || !window.CSS?.supports('clip-path', 'circle(0px at 0px 0px)')) {
    cancelThemeTransition();
    clearThemeReveal();
    writeTheme(nextTheme, true);
    return;
  }
  cancelThemeTransition();
  const { x, y, radius } = themeOrigin();
  root.style.setProperty('--theme-origin-x', `${x}px`);
  root.style.setProperty('--theme-origin-y', `${y}px`);
  root.style.setProperty('--max-radius', `${Math.ceil(radius)}px`);
  let transition: ThemeTransition | undefined;
  try {
    transition = documentWithTransition.startViewTransition(() => {
      if (sequence === themeSequence) writeTheme(nextTheme, true);
    });
    activeThemeTransition = transition;
    void transition.ready?.catch(() => {
      if (sequence === themeSequence) writeTheme(nextTheme, true);
    });
    await transition.finished;
  } catch {
    if (sequence === themeSequence) writeTheme(nextTheme, true);
  } finally {
    if (sequence === themeSequence && activeThemeTransition === transition) {
      activeThemeTransition = undefined;
      clearThemeReveal();
    }
  }
}

writeTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false, false);
themeToggle?.addEventListener('click', () => { void toggleTheme(); });
systemDark.addEventListener('change', (event) => {
  if (root.dataset.themeMode === 'system' && !userThemeIntent) {
    intendedTheme = event.matches ? 'dark' : 'light';
    writeTheme(intendedTheme, false, false);
  }
});
reduceMotion.addEventListener('change', (event) => {
  if (event.matches && activeThemeTransition) {
    themeSequence += 1;
    cancelThemeTransition();
    clearThemeReveal();
    writeTheme(intendedTheme, true);
  }
  updateProjectState(false);
});

const navigation = document.querySelector<HTMLElement>('#primary-navigation');
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle');
const mobileNavigation = window.matchMedia('(max-width: 60rem)');
let menuIsOpen = false;

function updateNavigationState(): void {
  if (!navigation || !menuToggle) return;
  if (!mobileNavigation.matches) {
    menuIsOpen = false;
    navigation.hidden = false;
    menuToggle.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', messages[locale]['nav.open']);
    return;
  }
  menuToggle.hidden = false;
  navigation.hidden = !menuIsOpen;
  menuToggle.setAttribute('aria-expanded', String(menuIsOpen));
  const key: MessageKey = menuIsOpen ? 'nav.close' : 'nav.open';
  menuToggle.setAttribute('aria-label', messages[locale][key]);
  menuToggle.setAttribute('data-aria-id', messages.id[key]);
  menuToggle.setAttribute('data-aria-en', messages.en[key]);
}

function closeNavigation(restoreFocus = false): void {
  menuIsOpen = false;
  updateNavigationState();
  if (restoreFocus) menuToggle?.focus();
}

menuToggle?.addEventListener('click', () => {
  menuIsOpen = !menuIsOpen;
  updateNavigationState();
  if (menuIsOpen) navigation?.querySelector<HTMLAnchorElement>('a')?.focus();
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (mobileNavigation.matches) closeNavigation();
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuIsOpen) closeNavigation(true);
});
mobileNavigation.addEventListener('change', () => {
  menuIsOpen = false;
  updateNavigationState();
});
updateNavigationState();

const dialog = document.querySelector<HTMLDialogElement>('#content-dialog');
const dialogContent = dialog?.querySelector<HTMLElement>('[data-dialog-content]');
const dialogClose = dialog?.querySelector<HTMLButtonElement>('[data-dialog-close]');
let lastDialogTrigger: HTMLElement | null = null;

function labelDialogHeading(): void {
  if (!dialog || !dialogContent) return;
  const headings = [...dialogContent.querySelectorAll<HTMLElement>('[data-dialog-title]')];
  const heading = headings.find((candidate) => !candidate.closest('[hidden]')) ?? headings[0];
  headings.forEach((candidate) => candidate.removeAttribute('id'));
  if (heading) {
    heading.id = 'dialog-title';
    dialog.setAttribute('aria-labelledby', heading.id);
  }
}

function openDialog(trigger: HTMLElement, content: Node): boolean {
  if (!dialog || !dialogContent || typeof dialog.showModal !== 'function') return false;
  try {
    dialogContent.replaceChildren(content);
    labelDialogHeading();
    lastDialogTrigger = trigger;
    document.body.classList.add('dialog-open');
    dialog.showModal();
    dialogClose?.focus();
    return true;
  } catch {
    document.body.classList.remove('dialog-open');
    dialogContent.replaceChildren();
    return false;
  }
}

dialogClose?.addEventListener('click', () => dialog?.close());
let backdropPointerStartedOutsideContent = false;
dialog?.addEventListener('pointerdown', (event) => {
  backdropPointerStartedOutsideContent = event.target === dialog;
});
dialog?.addEventListener('pointerup', (event) => {
  if (backdropPointerStartedOutsideContent && event.target === dialog) dialog?.close();
  backdropPointerStartedOutsideContent = false;
});
dialog?.addEventListener('pointercancel', () => { backdropPointerStartedOutsideContent = false; });
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  const trigger = lastDialogTrigger;
  lastDialogTrigger = null;
  window.requestAnimationFrame(() => {
    const projectSlide = trigger?.closest<HTMLElement>('[data-project-slide]');
    const projectIndex = projectSlide ? filteredProjectSlides.indexOf(projectSlide) : -1;
    if (projectIndex >= 0) {
      projectTransition = undefined;
      projectPhase = projectIndex * projectStep;
      renderProjectPositions();
    }
    const canRestoreTrigger = trigger?.isConnected
      && !trigger.closest('[hidden], [inert], [aria-hidden="true"]')
      && trigger.getClientRects().length > 0;
    if (canRestoreTrigger) {
      trigger.focus({ preventScroll: true });
      if (projectIndex >= 0) addProjectPauseReason('keyboard-card', true);
    }
    else document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true });
    addProjectPauseReason('dialog', false);
  });
});
dialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || !dialogContent) return;
  const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.closest('[hidden]') && element.getClientRects().length > 0);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

type ProjectPayload = {
  slug: string;
  title: string;
  category: { id: string; en: string };
  copy: {
    id: { summary: string; paragraphs: string[]; imageAlt: string };
    en: { summary: string; paragraphs: string[]; imageAlt: string };
  };
  media: { src: string; width: number; height: number; kind: string };
  tags: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  sourceLinks: Array<{ labelKey: string; url: string }>;
  url: string;
};

function localizeNode<T extends HTMLElement>(node: T, idText: string, enText: string): T {
  node.dataset.copyId = idText;
  node.dataset.copyEn = enText;
  node.textContent = locale === 'id' ? idText : enText;
  return node;
}

function createProjectDialog(payload: ProjectPayload): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project-detail';
  const header = document.createElement('header');
  const category = document.createElement('p');
  category.className = 'project-detail__category';
  localizeNode(category, payload.category.id, payload.category.en);
  const title = document.createElement('h2');
  title.className = 'project-detail__title';
  title.dataset.dialogTitle = '';
  title.textContent = payload.title;
  const summary = document.createElement('p');
  summary.className = 'project-detail__summary';
  localizeNode(summary, payload.copy.id.summary, payload.copy.en.summary);
  const tagHeading = document.createElement('p');
  tagHeading.className = 'project-detail__tag-label';
  localizeNode(tagHeading, translate('id', 'projects.technologies'), translate('en', 'projects.technologies'));
  const tags = document.createElement('ul');
  tags.className = 'tag-list';
  payload.tags.forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = tag;
    tags.append(item);
  });
  header.append(category, title, summary, tagHeading, tags);

  const figure = document.createElement('figure');
  figure.className = 'project-detail__media';
  const image = document.createElement('img');
  image.src = payload.media.src;
  image.width = payload.media.width;
  image.height = payload.media.height;
  image.alt = locale === 'id' ? payload.copy.id.imageAlt : payload.copy.en.imageAlt;
  image.dataset.altId = payload.copy.id.imageAlt;
  image.dataset.altEn = payload.copy.en.imageAlt;
  image.loading = 'lazy';
  image.decoding = 'async';
  figure.append(image);

  const body = document.createElement('div');
  body.className = 'project-detail__body';
  const prose = document.createElement('div');
  prose.className = 'project-detail__prose';
  payload.copy.id.paragraphs.forEach((idText, index) => {
    const paragraph = document.createElement('p');
    localizeNode(paragraph, idText, payload.copy.en.paragraphs[index] ?? idText);
    prose.append(paragraph);
  });
  const aside = document.createElement('aside');
  aside.className = 'source-panel';
  const asideHeading = document.createElement('h3');
  localizeNode(asideHeading, translate('id', 'projects.resources'), translate('en', 'projects.resources'));
  const links = document.createElement('ul');
  payload.sourceLinks.forEach(({ labelKey, url }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const key = `resource.${labelKey}` as MessageKey;
    localizeNode(link, messages.id[key] ?? messages.id['projects.resources'], messages.en[key] ?? messages.en['projects.resources']);
    link.dataset.resourceKey = labelKey;
    item.append(link);
    links.append(item);
  });
  aside.append(asideHeading, links);
  const actions = document.createElement('div');
  actions.className = 'source-panel__actions';
  if (payload.repositoryUrl) {
    const repository = document.createElement('a');
    repository.className = 'button button--primary';
    repository.href = payload.repositoryUrl;
    repository.target = '_blank';
    repository.rel = 'noopener noreferrer';
    localizeNode(repository, messages.id['projects.repository'], messages.en['projects.repository']);
    actions.append(repository);
  }
  if (payload.demoUrl) {
    const demo = document.createElement('a');
    demo.className = 'button button--quiet';
    demo.href = payload.demoUrl;
    demo.target = '_blank';
    demo.rel = 'noopener noreferrer';
    localizeNode(demo, messages.id['projects.demo'], messages.en['projects.demo']);
    actions.append(demo);
  }
  aside.append(actions);
  body.append(prose, aside);
  article.append(header, figure, body);
  article.dataset.dialogAriaId = translate('id', 'dialog.projectLabel', { title: payload.title });
  article.dataset.dialogAriaEn = translate('en', 'dialog.projectLabel', { title: payload.title });
  article.setAttribute('aria-label', translate(locale, 'dialog.projectLabel', { title: payload.title }));
  return article;
}

type CredentialPayload = {
  name: string;
  media: { src: string; width: number; height: number };
  alt: Record<Locale, string>;
};

function createCredentialDialog(payload: CredentialPayload): HTMLElement {
  const article = document.createElement('article');
  article.className = 'credential-dialog';
  const title = document.createElement('h2');
  title.dataset.dialogTitle = '';
  title.textContent = payload.name;

  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.width = payload.media.width;
  image.height = payload.media.height;
  image.alt = payload.alt[locale];
  image.dataset.altId = payload.alt.id;
  image.dataset.altEn = payload.alt.en;
  image.loading = 'eager';
  image.decoding = 'async';
  const error = document.createElement('p');
  error.className = 'credential-dialog__error';
  error.dataset.copyId = translate('id', 'credentials.imageError');
  error.dataset.copyEn = translate('en', 'credentials.imageError');
  error.textContent = messages[locale]['credentials.imageError'];
  error.hidden = true;
  image.addEventListener('error', () => { error.hidden = false; }, { once: true });
  image.src = payload.media.src;
  figure.append(image);
  article.append(title, figure, error);
  article.dataset.dialogAriaId = translate('id', 'dialog.credentialLabel', { title: payload.name });
  article.dataset.dialogAriaEn = translate('en', 'dialog.credentialLabel', { title: payload.name });
  article.setAttribute('aria-label', translate(locale, 'dialog.credentialLabel', { title: payload.name }));
  return article;
}

const pauseReasons = new Set<string>();
let updateProjectState: (announce: boolean) => void = () => {};
let updateProjectTimer: () => void = () => {};
let updateCredentialState: (pageIndex?: number, announce?: boolean) => void = () => {};
let lastProjectInteractionWasKeyboard = false;
document.addEventListener('keydown', () => { lastProjectInteractionWasKeyboard = true; }, true);
document.addEventListener('pointerdown', () => { lastProjectInteractionWasKeyboard = false; }, true);
function addProjectPauseReason(reason: string, paused: boolean): void {
  if (paused) pauseReasons.add(reason);
  else pauseReasons.delete(reason);
  updateProjectTimer();
}

type HorizontalDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  target: HTMLElement;
  intent: 'pending' | 'horizontal' | 'vertical';
  lastX: number;
  distance: number;
  pauseNotified: boolean;
};

function bindHorizontalDrag(
  stage: HTMLElement | null,
  onSwipe: (direction: number, distance: number) => void,
  onDragState?: (active: boolean) => void,
  ignoreSelector = '',
  onDragMove?: (distance: number) => void,
): void {
  if (!stage) return;
  stage.querySelectorAll<HTMLImageElement>('img').forEach((image) => { image.draggable = false; });
  stage.addEventListener('dragstart', (event) => event.preventDefault());
  let drag: HorizontalDragState | undefined;
  let suppressClickUntil = 0;

  const clear = (event?: PointerEvent): HorizontalDragState | undefined => {
    const finished = drag;
    drag = undefined;
    stage.classList.remove('is-dragging');
    stage.style.removeProperty('--drag-offset');
    if (finished?.pauseNotified) onDragState?.(false);
    if (finished?.target.hasPointerCapture(finished.pointerId)) {
      try { finished.target.releasePointerCapture(finished.pointerId); } catch {}
    } else if (event && stage.hasPointerCapture(event.pointerId)) {
      try { stage.releasePointerCapture(event.pointerId); } catch {}
    }
    return finished;
  };

  stage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const target = event.target instanceof Element ? event.target : stage;
    if (ignoreSelector && target.closest(ignoreSelector)) return;
    const control = target.closest<HTMLElement>('button, input, select, textarea');
    if (control && !control.hasAttribute('data-gallery-drag-zone')) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      target: stage,
      intent: 'pending',
      lastX: event.clientX,
      distance: 0,
      pauseNotified: Boolean(onDragState),
    };
    onDragState?.(true);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.intent === 'pending' && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
      drag.intent = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      if (drag.intent === 'horizontal') {
        try { stage.setPointerCapture(event.pointerId); } catch {}
        stage.classList.add('is-dragging');
      }
    }
    if (drag.intent !== 'horizontal') return;
    const delta = event.clientX - drag.lastX;
    drag.distance += delta;
    drag.lastX = event.clientX;
    stage.classList.add('is-dragging');
    stage.style.setProperty('--drag-offset', `${dx}px`);
    onDragMove?.(delta);
    if (event.cancelable) event.preventDefault();
  });

  stage.addEventListener('pointerup', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const finished = clear(event);
    if (!finished || finished.intent !== 'horizontal' || Math.abs(dx) <= 6 || Math.abs(dx) <= Math.abs(dy)) return;
    suppressClickUntil = Date.now() + 240;
    onSwipe(dx < 0 ? 1 : -1, finished.distance);
  });

  stage.addEventListener('pointercancel', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const finished = clear(event);
    if (finished?.intent === 'horizontal') onDragMove?.(0);
  });

  stage.addEventListener('lostpointercapture', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const finished = clear(event);
    if (finished?.intent === 'horizontal') onDragMove?.(0);
  });

  stage.addEventListener('click', (event) => {
    if (Date.now() >= suppressClickUntil) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}

const projectCarousel = document.querySelector<HTMLElement>('[data-project-carousel]');
const projectStage = document.querySelector<HTMLElement>('[data-project-stage]');
const projectSlides = [...document.querySelectorAll<HTMLElement>('[data-project-slide]')];
const filterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-project-filter]')];
const projectControls = document.querySelector<HTMLElement>('[data-project-controls]');
const projectPrevious = document.querySelector<HTMLButtonElement>('[data-project-previous]');
const projectNext = document.querySelector<HTMLButtonElement>('[data-project-next]');
const projectToggle = document.querySelector<HTMLButtonElement>('[data-project-toggle]');
const projectStatus = document.querySelector<HTMLElement>('[data-project-status]');
const projectEmpty = document.querySelector<HTMLElement>('[data-project-empty]');
const projectPauseIcon = projectToggle?.querySelector<SVGSVGElement>('[data-icon-pause]');
const projectPlayIcon = projectToggle?.querySelector<SVGSVGElement>('[data-icon-play]');
let filteredProjectSlides = [...projectSlides];
let currentProjectIndex = 0;
let currentFilter = 'all';
let userPausedProjectMotion = false;
const projectCopies: Array<{ element: HTMLElement; source: HTMLElement; repeat: number }> = [];
const projectCountElement = document.querySelector<HTMLElement>('[data-project-count]');
let projectPhase = 0;
let projectStep = 404;
let projectFrame: number | undefined;
let previousProjectFrame = 0;
let projectTransition: { from: number; to: number; started: number; duration: number } | undefined;

function positiveModulo(value: number, modulus: number): number {
  return modulus > 0 ? ((value % modulus) + modulus) % modulus : 0;
}

function makeProjectCopy(source: HTMLElement, sourceIndex: number, repeat: number): HTMLElement {
  const copy = source.cloneNode(true) as HTMLElement;
  copy.removeAttribute('data-project-slide');
  copy.removeAttribute('data-project-payload');
  copy.removeAttribute('data-position');
  copy.removeAttribute('data-active');
  copy.dataset.projectCloneIndex = String(sourceIndex);
  copy.dataset.projectCloneRepeat = String(repeat);
  copy.setAttribute('aria-hidden', 'true');
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  copy.querySelectorAll('a').forEach((anchor) => {
    const decorativeCard = document.createElement('div');
    decorativeCard.className = anchor.className;
    decorativeCard.setAttribute('aria-hidden', 'true');
    decorativeCard.append(...Array.from(anchor.childNodes));
    anchor.replaceWith(decorativeCard);
  });
  copy.querySelectorAll('button, input, select, textarea, [tabindex]').forEach((node) => node.removeAttribute('tabindex'));
  return copy;
}

projectSlides.forEach((source, sourceIndex) => {
  for (let repeat = -2; repeat <= 2; repeat += 1) {
    if (repeat === 0) {
      projectCopies.push({ element: source, source, repeat });
      continue;
    }
    const copy = makeProjectCopy(source, sourceIndex, repeat);
    projectStage?.append(copy);
    projectCopies.push({ element: copy, source, repeat });
  }
});

function projectPitch(): number {
  const sample = filteredProjectSlides[0];
  const cardWidth = sample ? Number.parseFloat(window.getComputedStyle(sample).width) || sample.offsetWidth : 380;
  const gap = projectStage ? Number.parseFloat(window.getComputedStyle(projectStage).getPropertyValue('--project-gap')) || 24 : 24;
  return cardWidth + gap;
}

function renderProjectPositions(): void {
  if (!projectStage) return;
  const count = filteredProjectSlides.length;
  const stageWidth = projectStage.clientWidth;
  const cardWidth = projectPitch() - (Number.parseFloat(window.getComputedStyle(projectStage).getPropertyValue('--project-gap')) || 24);
  const cycle = count * projectStep;
  const center = stageWidth / 2 - cardWidth / 2;
  const indexBySlide = new Map(filteredProjectSlides.map((slide, index) => [slide, index]));
  const staticLayout = count > 0 && count <= 3;
  projectStage.dataset.static = String(staticLayout);
  projectStage.dataset.count = String(count);
  const closestIndex = count ? Math.round(projectPhase / projectStep) % count : 0;
  currentProjectIndex = positiveModulo(closestIndex, Math.max(1, count));

  projectCopies.forEach(({ element, source, repeat }) => {
    const index = indexBySlide.get(source);
    element.dataset.position = index === undefined ? '-1' : String(index - currentProjectIndex);
    element.dataset.active = String(index !== undefined && index === currentProjectIndex);
    if (index === undefined || staticLayout) {
      element.hidden = element !== source || index === undefined;
      element.setAttribute('aria-hidden', String(element !== source || index === undefined));
      if (element === source) {
        source.dataset.position = String(index ?? -1);
        source.dataset.active = String(index === currentProjectIndex);
        source.removeAttribute('style');
        source.setAttribute('aria-hidden', String(index === undefined));
        (source as HTMLElement & { inert: boolean }).inert = index === undefined;
      }
      return;
    }
    const base = positiveModulo(index * projectStep - projectPhase, cycle);
    const x = center + base + repeat * cycle;
    const visible = x < stageWidth && x + cardWidth > 0;
    const inOverscan = x > -cardWidth - projectStep && x < stageWidth + projectStep;
    element.hidden = element === source ? !visible : !inOverscan;
    element.style.setProperty('--slide-x', `${x}px`);
    element.setAttribute('aria-hidden', String(element !== source || !visible));
    if (element === source) {
      (source as HTMLElement & { inert: boolean }).inert = !visible;
    }
  });
}

function projectMotionAllowed(): boolean {
  return Boolean(projectStage)
    && filteredProjectSlides.length > 3
    && !userPausedProjectMotion
    && !reduceMotion.matches
    && pauseReasons.size === 0;
}

function scheduleProjectFrame(): void {
  const needsFrame = projectMotionAllowed() || Boolean(projectTransition);
  if (!needsFrame) {
    if (projectFrame !== undefined) window.cancelAnimationFrame(projectFrame);
    projectFrame = undefined;
    previousProjectFrame = 0;
    return;
  }
  if (projectFrame === undefined) projectFrame = window.requestAnimationFrame(animateProjectFrame);
}

function animateProjectFrame(timestamp: number): void {
  projectFrame = undefined;
  const elapsed = previousProjectFrame ? Math.min(48, timestamp - previousProjectFrame) : 0;
  previousProjectFrame = timestamp;
  if (projectTransition) {
    const transition = projectTransition;
    const progress = Math.min(1, (timestamp - transition.started) / transition.duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    projectPhase = transition.from + (transition.to - transition.from) * eased;
    if (progress >= 1) projectTransition = undefined;
  } else if (projectMotionAllowed()) {
    projectPhase += elapsed * 0.088;
  }
  const cycle = filteredProjectSlides.length * projectStep;
  if (cycle > 0) projectPhase = positiveModulo(projectPhase, cycle);
  renderProjectPositions();
  scheduleProjectFrame();
}

function renderProjectAnnouncement(): void {
  const count = filteredProjectSlides.length;
  if (projectCountElement) projectCountElement.textContent = count === 1
    ? messages[locale]['projects.countOne']
    : translate(locale, 'projects.countMany', { count });
}

updateProjectState = (announce: boolean): void => {
  const previousId = filteredProjectSlides[currentProjectIndex]?.dataset.projectId;
  const progress = positiveModulo(projectPhase, projectStep || 404) / (projectStep || 404);
  filteredProjectSlides = projectSlides.filter((slide) => currentFilter === 'all' || (slide.dataset.categories ?? '').split(' ').includes(currentFilter));
  const count = filteredProjectSlides.length;
  if (projectStage) projectStage.dataset.static = 'false';
  const measureSlide = filteredProjectSlides[0];
  if (measureSlide) measureSlide.hidden = false;
  const nextIndex = filteredProjectSlides.findIndex((slide) => slide.dataset.projectId === previousId);
  projectStep = projectPitch();
  if (projectStep <= 0) projectStep = 404;
  projectPhase = (Math.max(0, nextIndex) + progress) * projectStep;
  if (count > 0) projectPhase = positiveModulo(projectPhase, count * projectStep);
  projectTransition = undefined;
  renderProjectPositions();
  const empty = filteredProjectSlides.length === 0;
  if (projectEmpty) projectEmpty.hidden = !empty;
  if (projectControls) projectControls.hidden = empty || filteredProjectSlides.length <= 3;
  if (projectToggle) {
    if (projectCarousel) projectCarousel.dataset.userPaused = String(userPausedProjectMotion);
    projectToggle.disabled = reduceMotion.matches || filteredProjectSlides.length <= 3;
    projectToggle.setAttribute('aria-pressed', String(userPausedProjectMotion));
    const key: MessageKey = reduceMotion.matches ? 'projects.motionUnavailable' : userPausedProjectMotion ? 'projects.play' : 'projects.pause';
    projectToggle.setAttribute('aria-label', messages[locale][key]);
    projectToggle.title = messages[locale][key];
    projectToggle.dataset.ariaId = messages.id[key];
    projectToggle.dataset.ariaEn = messages.en[key];
    if (projectPauseIcon) projectPauseIcon.style.display = !reduceMotion.matches && !userPausedProjectMotion ? 'block' : 'none';
    if (projectPlayIcon) projectPlayIcon.style.display = !reduceMotion.matches && userPausedProjectMotion ? 'block' : 'none';
  }
  if (projectPrevious) projectPrevious.disabled = filteredProjectSlides.length <= 3;
  if (projectNext) projectNext.disabled = filteredProjectSlides.length <= 3;
  renderProjectAnnouncement();
  if (announce && projectStatus && filteredProjectSlides.length > 1) {
    projectStatus.textContent = translate(locale, 'projects.position', { index: currentProjectIndex + 1, count: filteredProjectSlides.length });
  }
  scheduleProjectFrame();
};

updateProjectTimer = scheduleProjectFrame;

function moveProject(direction: number): void {
  if (filteredProjectSlides.length < 2 || !projectStage) return;
  if (reduceMotion.matches) {
    projectPhase = positiveModulo(projectPhase + direction * projectStep, filteredProjectSlides.length * projectStep);
    renderProjectPositions();
    if (projectStatus) projectStatus.textContent = translate(locale, 'projects.position', { index: positiveModulo(currentProjectIndex, filteredProjectSlides.length) + 1, count: filteredProjectSlides.length });
    return;
  }
  projectTransition = { from: projectPhase, to: projectPhase + direction * projectStep, started: performance.now(), duration: 440 };
  if (projectStatus) projectStatus.textContent = translate(locale, 'projects.position', { index: positiveModulo(currentProjectIndex + direction, filteredProjectSlides.length) + 1, count: filteredProjectSlides.length });
  scheduleProjectFrame();
}

projectPrevious?.addEventListener('click', () => moveProject(-1));
projectNext?.addEventListener('click', () => moveProject(1));
projectToggle?.addEventListener('click', () => {
  userPausedProjectMotion = !userPausedProjectMotion;
  updateProjectState(false);
});
filterButtons.forEach((button) => button.addEventListener('click', () => {
  currentFilter = button.dataset.projectFilter ?? 'all';
  filterButtons.forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle('is-active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  updateProjectState(true);
}));
projectCarousel?.addEventListener('pointerdown', () => addProjectPauseReason('keyboard-card', false));
projectCarousel?.addEventListener('focusin', (event) => {
  const slide = (event.target as HTMLElement).closest<HTMLElement>('[data-project-slide]');
  if (!slide || slide.hidden) return;
  if (!lastProjectInteractionWasKeyboard) return;
  addProjectPauseReason('keyboard-card', true);
  if (slide.dataset.active === 'true') return;
  const index = filteredProjectSlides.indexOf(slide);
  if (index >= 0) {
    currentProjectIndex = index;
    updateProjectState(false);
  }
});
projectCarousel?.addEventListener('focusout', (event) => {
  const target = event.relatedTarget;
  const nextSlide = target instanceof HTMLElement ? target.closest<HTMLElement>('[data-project-slide]') : null;
  if (!nextSlide || nextSlide.hidden) addProjectPauseReason('keyboard-card', false);
});
bindHorizontalDrag(projectStage, () => {}, (active) => {
  if (active) projectTransition = undefined;
  addProjectPauseReason('drag', active);
}, '', (delta) => {
  projectTransition = undefined;
  projectPhase -= delta;
  const cycle = filteredProjectSlides.length * projectStep;
  if (cycle > 0) projectPhase = positiveModulo(projectPhase, cycle);
  renderProjectPositions();
});
document.addEventListener('visibilitychange', () => addProjectPauseReason('hidden', document.hidden));
if (projectCarousel && 'IntersectionObserver' in window) {
  const projectObserver = new IntersectionObserver(([entry]) => addProjectPauseReason('offscreen', !(entry?.isIntersecting ?? false)), { threshold: 0.08 });
  projectObserver.observe(projectCarousel);
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  const clone = target?.closest<HTMLElement>('[data-project-clone-index]');
  const trigger = target?.closest<HTMLAnchorElement>('[data-project-open]');
  if (!trigger && !clone) return;
  if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
  const slide = trigger?.closest<HTMLElement>('[data-project-slide]')
    ?? projectSlides[Number(clone?.dataset.projectCloneIndex)];
  if (!slide) return;
  if (!clone && (slide.hidden || slide.getAttribute('aria-hidden') === 'true')) return;
  let payload: ProjectPayload;
  try { payload = JSON.parse(slide.dataset.projectPayload ?? 'null') as ProjectPayload; } catch { return; }
  const content = createProjectDialog(payload);
  if (!openDialog(trigger ?? projectToggle ?? slide, content)) return;
  event.preventDefault();
  addProjectPauseReason('dialog', true);
  applyLocale(locale);
});

const experienceSlides = [...document.querySelectorAll<HTMLElement>('[data-experience-slide]')];
const experienceCopies = [...document.querySelectorAll<HTMLElement>('[data-experience-copy]')];
const experienceStatus = document.querySelector<HTMLElement>('[data-experience-status]');
const experienceStage = document.querySelector<HTMLElement>('[data-experience-stage]');
let currentExperienceIndex = 0;

function updateExperienceState(): void {
  const count = experienceSlides.length;
  experienceSlides.forEach((slide, index) => {
    let position = count ? (index - currentExperienceIndex + count) % count : 0;
    if (position > count / 2) position -= count;
    const visible = Math.abs(position) <= 2 || count <= 3;
    const interactive = Math.abs(position) <= 1 || count <= 1;
    slide.hidden = !visible;
    slide.dataset.position = String(position);
    slide.dataset.active = String(position === 0);
    slide.setAttribute('aria-hidden', String(!visible));
    (slide as HTMLElement & { inert: boolean }).inert = !interactive;
  });
  experienceCopies.forEach((copy, index) => {
    const active = index === currentExperienceIndex;
    copy.hidden = false;
    copy.setAttribute('aria-hidden', String(!active));
    (copy as HTMLElement & { inert: boolean }).inert = !active;
    copy.dataset.active = String(active);
  });
  if (experienceStatus) {
    experienceStatus.textContent = count === 0
      ? messages[locale]['experience.empty']
      : `${translate(locale, 'experience.position', { index: currentExperienceIndex + 1, count })}: ${experienceCopies[currentExperienceIndex]?.querySelector('h3')?.textContent ?? ''}`;
  }
}

function moveExperience(direction: number): void {
  if (experienceSlides.length < 2) return;
  currentExperienceIndex = (currentExperienceIndex + direction + experienceSlides.length) % experienceSlides.length;
  experienceSlides.forEach((slide) => {
    const disclosure = slide.querySelector<HTMLDetailsElement>('details');
    if (disclosure) disclosure.open = false;
  });
  updateExperienceState();
}
experienceSlides.forEach((slide) => slide.addEventListener('click', () => {
  const position = Number(slide.dataset.position ?? 0);
  if (Math.abs(position) === 1) moveExperience(position);
}));
experienceStage?.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveExperience(event.key === 'ArrowLeft' ? -1 : 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    currentExperienceIndex = 0;
    updateExperienceState();
  } else if (event.key === 'End') {
    event.preventDefault();
    currentExperienceIndex = Math.max(0, experienceSlides.length - 1);
    updateExperienceState();
  }
});
bindHorizontalDrag(experienceStage, (direction) => moveExperience(direction), undefined, 'summary, input, select, textarea, a, [data-experience-caption]');

const credentialTrack = document.querySelector<HTMLElement>('[data-credential-track]');
const credentialPageElements = [...document.querySelectorAll<HTMLElement>('[data-credential-page]')];
const credentialCards = [...document.querySelectorAll<HTMLAnchorElement>('[data-credential-open]')];
const credentialPagination = document.querySelector<HTMLElement>('[data-credential-pagination]');
const credentialPageStatus = document.querySelector<HTMLElement>('[data-credential-page-status]');
const credentialPrevious = document.querySelector<HTMLButtonElement>('[data-credential-previous]');
const credentialNext = document.querySelector<HTMLButtonElement>('[data-credential-next]');
let currentCredentialPage = 0;

updateCredentialState = (pageIndex = currentCredentialPage, announce = true): void => {
  const result = paginateRecords(credentialCards, pageIndex);
  currentCredentialPage = clampPageIndex(result.pageIndex, credentialPageElements.length);
  const pageCount = credentialPageElements.length;
  credentialPageElements.forEach((page, index) => {
    const active = index === currentCredentialPage;
    page.setAttribute('aria-hidden', String(!active));
    page.setAttribute('aria-current', active ? 'page' : 'false');
    (page as HTMLElement & { inert: boolean }).inert = !active;
  });
  if (credentialTrack) credentialTrack.style.transform = `translate3d(-${pageCount ? currentCredentialPage * 100 / pageCount : 0}%, 0, 0)`;
  if (credentialPageStatus) {
    const status = pageCount ? translate(locale, 'credentials.page', { index: currentCredentialPage + 1, count: pageCount }) : messages[locale]['credentials.empty'];
    credentialPageStatus.textContent = status;
    if (announce) credentialPageStatus.dataset.state = 'changed';
    else credentialPageStatus.removeAttribute('data-state');
  }
  if (credentialPagination) credentialPagination.hidden = pageCount <= 1;
  if (credentialPrevious) credentialPrevious.disabled = currentCredentialPage <= 0;
  if (credentialNext) credentialNext.disabled = currentCredentialPage >= pageCount - 1;
};

credentialPrevious?.addEventListener('click', () => updateCredentialState(currentCredentialPage - 1));
credentialNext?.addEventListener('click', () => updateCredentialState(currentCredentialPage + 1));
document.querySelector<HTMLElement>('[data-credential-viewport]')?.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowLeft' && currentCredentialPage > 0) {
    event.preventDefault();
    updateCredentialState(currentCredentialPage - 1);
  } else if (event.key === 'ArrowRight' && currentCredentialPage < credentialPageElements.length - 1) {
    event.preventDefault();
    updateCredentialState(currentCredentialPage + 1);
  }
});

document.addEventListener('click', (event) => {
  const trigger = event.target instanceof HTMLElement ? event.target.closest<HTMLAnchorElement>('[data-credential-open]') : null;
  if (!trigger || trigger.closest('[aria-hidden="true"]')) return;
  if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
  let payload: CredentialPayload;
  try { payload = JSON.parse(trigger.dataset.credentialPayload ?? 'null') as CredentialPayload; } catch { return; }
  const content = createCredentialDialog(payload);
  if (!openDialog(trigger, content)) return;
  event.preventDefault();
  addProjectPauseReason('dialog', true);
  applyLocale(locale);
});

const skillCards = [...document.querySelectorAll<HTMLElement>('[data-skill-card]')];
let activeSkillId = skillCards[0]?.dataset.skillId ?? '';

function updateSkillState(): void {
  skillCards.forEach((card) => {
    const active = card.dataset.skillId === activeSkillId;
    card.dataset.active = String(active);
    const button = card.querySelector<HTMLButtonElement>('[data-skill-activate]');
    const detail = card.querySelector<HTMLElement>('.skill-card__detail');
    const title = card.querySelector<HTMLElement>('.skill-card__detail strong');
    if (!button || !title) return;
    button.setAttribute('aria-expanded', String(active));
    if (detail) {
      detail.setAttribute('aria-hidden', String(!active));
      (detail as HTMLElement & { inert: boolean }).inert = !active;
    }
    const idTitle = title.dataset.copyId ?? title.textContent ?? '';
    const enTitle = title.dataset.copyEn ?? title.textContent ?? '';
    const idLabel = translate('id', 'skills.expand', { title: idTitle });
    const enLabel = translate('en', 'skills.expand', { title: enTitle });
    button.dataset.ariaId = idLabel;
    button.dataset.ariaEn = enLabel;
    button.setAttribute('aria-label', locale === 'id' ? idLabel : enLabel);
  });
}

skillCards.forEach((card) => {
  const button = card.querySelector<HTMLButtonElement>('[data-skill-activate]');
  const activate = () => {
    activeSkillId = card.dataset.skillId ?? '';
    updateSkillState();
  };
  button?.addEventListener('focus', activate);
  button?.addEventListener('pointerenter', activate);
  button?.addEventListener('click', activate);
  button?.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = skillCards.indexOf(card);
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? skillCards.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + skillCards.length) % skillCards.length;
    skillCards[nextIndex]?.querySelector<HTMLButtonElement>('[data-skill-activate]')?.focus();
  });
});

const skillTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-skill-tab]')];
const skillPanels = [...document.querySelectorAll<HTMLElement>('[data-skill-panel]')];
function activateSkillTab(selected: HTMLButtonElement, focus = false): void {
  skillTabs.forEach((tab) => {
    const active = tab === selected;
    tab.hidden = false;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  skillPanels.forEach((panel) => {
    panel.hidden = panel.dataset.skillPanel !== selected.dataset.skillTab;
  });
  if (focus) selected.focus();
}
skillTabs.forEach((tab) => {
  tab.hidden = false;
  tab.addEventListener('click', () => activateSkillTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = skillTabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? skillTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + skillTabs.length) % skillTabs.length;
    const nextTab = skillTabs[next];
    if (nextTab) activateSkillTab(nextTab, true);
  });
});
skillCards.forEach((card) => card.querySelector<HTMLButtonElement>('[data-skill-activate]')?.removeAttribute('disabled'));
filterButtons.forEach((button) => button.removeAttribute('disabled'));
if (skillTabs[0]) activateSkillTab(skillTabs[0]);
updateSkillState();
document.querySelectorAll<HTMLImageElement>('[data-software-icon]').forEach((image) => {
  image.addEventListener('error', () => {
    image.closest<HTMLElement>('.software-tile__icon')?.setAttribute('data-icon-missing', 'true');
  }, { once: true });
});

async function copyWithFallback(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  const temporary = document.createElement('textarea');
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = document.getSelection();
  const savedRanges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.style.position = 'fixed';
  temporary.style.insetInlineStart = '-10000px';
  temporary.style.opacity = '0';
  document.body.append(temporary);
  temporary.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    temporary.remove();
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      savedRanges.forEach((range) => {
        try { selection.addRange(range); } catch {}
      });
    }
  }
  return copied;
}

emailButton?.addEventListener('click', async () => {
  const generation = ++emailCopyGeneration;
  if (emailCopyTimer !== undefined) window.clearTimeout(emailCopyTimer);
  emailCopyTimer = undefined;
  emailCopyPhase = 'pending';
  emailCopyDeadline = 0;
  renderEmailCopyState();
  let success = false;
  try { success = await copyWithFallback(emailAddress); } catch { success = false; }
  if (generation !== emailCopyGeneration) return;
  emailCopyPhase = success ? 'success' : 'error';
  emailCopyDeadline = Date.now() + 2200;
  renderEmailCopyState();
  const expireFeedback = () => {
    if (generation !== emailCopyGeneration || Date.now() < emailCopyDeadline) return;
    emailCopyPhase = 'idle';
    emailCopyDeadline = 0;
    emailCopyTimer = undefined;
    renderEmailCopyState();
  };
  emailCopyTimer = window.setTimeout(expireFeedback, Math.max(0, emailCopyDeadline - Date.now()));
});
emailButton?.removeAttribute('hidden');

const cvTemplate = document.querySelector<HTMLTemplateElement>('#cv-dialog-template');
const cvTextTemplates: Record<Locale, HTMLTemplateElement | null> = {
  id: document.querySelector<HTMLTemplateElement>('#cv-text-id'),
  en: document.querySelector<HTMLTemplateElement>('#cv-text-en'),
};
let cvUrls: Record<Locale, string> = { id: '', en: '' };

function showCvChoice(content: HTMLElement): void {
  const choice = content.querySelector<HTMLElement>('[data-cv-choice]');
  const preview = content.querySelector<HTMLElement>('[data-cv-preview]');
  if (choice) choice.hidden = false;
  if (preview) preview.hidden = true;
  labelDialogHeading();
  content.querySelector<HTMLButtonElement>('[data-cv-language="id"]')?.focus();
}

function showCvLanguage(content: HTMLElement, documentLocale: Locale): void {
  const choice = content.querySelector<HTMLElement>('[data-cv-choice]');
  const preview = content.querySelector<HTMLElement>('[data-cv-preview]');
  if (choice) choice.hidden = true;
  if (!preview) return;
  preview.hidden = false;
  const frame = preview.querySelector<HTMLIFrameElement>('[data-cv-frame]');
  const download = preview.querySelector<HTMLAnchorElement>('[data-cv-download]');
  const openPdf = preview.querySelector<HTMLAnchorElement>('[data-cv-open-pdf]');
  const textPreview = preview.querySelector<HTMLElement>('[data-cv-text-preview]');
  const loading = preview.querySelector<HTMLElement>('[data-cv-loading]');
  const textTemplate = cvTextTemplates[documentLocale];
  const url = cvUrls[documentLocale];
  if (frame) {
    frame.dataset.documentLocale = documentLocale;
    frame.title = translate(locale, documentLocale === 'id' ? 'cv.frameId' : 'cv.frameEn');
    frame.tabIndex = -1;
    if (loading) {
      loading.hidden = false;
      loading.dataset.messageKey = 'cv.loading';
      loading.textContent = messages[locale]['cv.loading'];
    }
    frame.onload = () => {
      if (loading) {
        loading.hidden = true;
        delete loading.dataset.messageKey;
      }
    };
    frame.onerror = () => {
      if (loading) {
        loading.hidden = false;
        loading.dataset.messageKey = 'cv.error';
        loading.textContent = messages[locale]['cv.error'];
      }
    };
    frame.src = url;
  }
  if (download) {
    download.href = url;
    download.download = new URL(url, window.location.href).pathname.split('/').pop() || `cv-muhammad-fajar-sodik${documentLocale === 'id' ? '-id' : ''}.pdf`;
    download.dataset.downloadLocale = documentLocale;
    const downloadKey: MessageKey = documentLocale === 'id' ? 'cv.downloadIdLabel' : 'cv.downloadEnLabel';
    download.setAttribute('aria-label', messages[locale][downloadKey]);
  }
  if (openPdf) openPdf.href = url;
  if (textPreview && textTemplate) textPreview.replaceChildren(textTemplate.content.cloneNode(true));
  const textDetails = preview.querySelector<HTMLDetailsElement>('[data-cv-text-details]');
  if (textDetails) textDetails.open = window.matchMedia('(max-width: 40rem)').matches;
  labelDialogHeading();
  const heading = preview.querySelector<HTMLElement>('[data-dialog-title]');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus();
}

document.addEventListener('click', (event) => {
  const trigger = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-cv-open]');
  if (!trigger || !cvTemplate) return;
  const idUrl = trigger.getAttribute('data-cv-id-url');
  const enUrl = trigger.getAttribute('data-cv-en-url');
  if (!idUrl || !enUrl) return;
  const content = cvTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement | null;
  if (!content || !openDialog(trigger, content)) return;
  event.preventDefault();
  const cvContent = dialogContent?.querySelector<HTMLElement>('.cv-dialog');
  if (!cvContent) return;
  cvUrls = { id: idUrl, en: enUrl };
  applyLocale(locale);
  showCvChoice(cvContent);
  cvContent.addEventListener('click', (cvEvent) => {
    const target = cvEvent.target as HTMLElement;
    const choice = target.closest<HTMLButtonElement>('[data-cv-language]');
    if (choice) {
      showCvLanguage(cvContent, choice.dataset.cvLanguage === 'en' ? 'en' : 'id');
      return;
    }
    if (target.closest('[data-cv-change-language]')) showCvChoice(cvContent);
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-cv-open]').forEach((button) => button.removeAttribute('hidden'));

document.querySelectorAll<HTMLAnchorElement>('[data-back-to-top]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true });
}));

updateProjectState(false);
updateExperienceState();
window.addEventListener('resize', () => {
  updateProjectState(false);
  updateExperienceState();
});
root.classList.add('js');
applyLocale(locale);
