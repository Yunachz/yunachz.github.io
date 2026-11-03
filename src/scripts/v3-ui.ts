import { messages, translate, type Locale, type MessageKey } from '../lib/i18n';

const root = document.documentElement;
const localeStorageKey = 'portfolio-locale';
const themeStorageKey = 'portfolio-theme';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
let locale: Locale = root.dataset.locale === 'en' ? 'en' : 'id';

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
  const language = document.querySelector<HTMLSelectElement>('#site-language');
  if (language) language.value = nextLocale;
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
}

const languageSelect = document.querySelector<HTMLSelectElement>('#site-language');
languageSelect?.addEventListener('change', () => {
  const chosen = languageSelect.value === 'en' ? 'en' : 'id';
  applyLocale(chosen);
});

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
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  addProjectPauseReason('dialog', false);
  lastDialogTrigger?.focus();
  lastDialogTrigger = null;
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

const pauseReasons = new Set<string>();
let updateProjectState: (announce: boolean) => void = () => {};
let updateProjectTimer: () => void = () => {};
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
  captureTarget: HTMLElement;
  wasDragged: boolean;
};

function bindHorizontalDrag(
  stage: HTMLElement | null,
  onSwipe: (direction: number) => void,
  onDragState?: (active: boolean) => void,
  ignoreSelector = '',
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
    onDragState?.(false);
    if (finished?.captureTarget.hasPointerCapture(finished.pointerId)) {
      try { finished.captureTarget.releasePointerCapture(finished.pointerId); } catch {}
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
    const captureTarget = target.closest<HTMLElement>('[data-gallery-drag-zone]')
      ?? target.closest<HTMLElement>('a, summary, figure, img, div, article')
      ?? stage;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      captureTarget,
      wasDragged: false,
    };
    try { captureTarget.setPointerCapture(event.pointerId); } catch {}
    onDragState?.(true);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.wasDragged && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) drag.wasDragged = true;
    if (!drag.wasDragged) return;
    stage.classList.add('is-dragging');
    stage.style.setProperty('--drag-offset', `${dx}px`);
    if (event.cancelable) event.preventDefault();
  });

  stage.addEventListener('pointerup', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const finished = clear(event);
    if (!finished?.wasDragged || Math.abs(dx) <= 6 || Math.abs(dx) <= Math.abs(dy)) return;
    suppressClickUntil = Date.now() + 450;
    if (Math.abs(dx) > 44) onSwipe(dx < 0 ? 1 : -1);
  });

  stage.addEventListener('pointercancel', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    clear(event);
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
let projectTimer: number | undefined;

function renderProjectAnnouncement(): void {
  if (!projectStatus) return;
  const count = filteredProjectSlides.length;
  projectStatus.textContent = count === 1
    ? messages[locale]['projects.countOne']
    : translate(locale, 'projects.countMany', { count });
}

updateProjectState = (announce: boolean): void => {
  filteredProjectSlides = projectSlides.filter((slide) => currentFilter === 'all' || (slide.dataset.categories ?? '').split(' ').includes(currentFilter));
  if (currentProjectIndex >= filteredProjectSlides.length) currentProjectIndex = 0;
  const count = filteredProjectSlides.length;
  const visiblePositions = new Map<HTMLElement, number>();
  filteredProjectSlides.forEach((slide, index) => {
    let position = count ? (index - currentProjectIndex + count) % count : 0;
    if (position > count / 2) position -= count;
    visiblePositions.set(slide, position);
    const visible = Math.abs(position) <= 1 || count <= 3;
    slide.hidden = !visible;
    slide.dataset.position = String(position);
    slide.dataset.active = String(position === 0);
    slide.setAttribute('aria-hidden', String(!visible));
    (slide as HTMLElement & { inert: boolean }).inert = !visible;
  });
  const sample = filteredProjectSlides.find((slide) => !slide.hidden);
  const cardWidth = sample ? Number.parseFloat(window.getComputedStyle(sample).width) || sample.offsetWidth : 380;
  const gap = projectStage ? Number.parseFloat(window.getComputedStyle(projectStage).getPropertyValue('--project-gap')) || 24 : 24;
  const step = cardWidth + gap;
  projectSlides.forEach((slide) => {
    const position = visiblePositions.get(slide);
    if (position === undefined) {
      slide.hidden = true;
      slide.setAttribute('aria-hidden', 'true');
      (slide as HTMLElement & { inert: boolean }).inert = true;
      return;
    }
    slide.style.setProperty('--slide-offset', `${position * step}px`);
  });
  const empty = filteredProjectSlides.length === 0;
  if (projectEmpty) projectEmpty.hidden = !empty;
  if (projectControls) projectControls.hidden = empty || filteredProjectSlides.length < 2;
  if (projectToggle) {
    if (projectCarousel) projectCarousel.dataset.userPaused = String(userPausedProjectMotion);
    projectToggle.disabled = reduceMotion.matches || filteredProjectSlides.length < 2;
    projectToggle.setAttribute('aria-pressed', String(userPausedProjectMotion));
    const key: MessageKey = userPausedProjectMotion ? 'projects.play' : 'projects.pause';
    projectToggle.setAttribute('aria-label', messages[locale][key]);
    projectToggle.dataset.ariaId = messages.id[key];
    projectToggle.dataset.ariaEn = messages.en[key];
    if (projectPauseIcon) projectPauseIcon.style.display = userPausedProjectMotion ? 'none' : 'block';
    if (projectPlayIcon) projectPlayIcon.style.display = userPausedProjectMotion ? 'block' : 'none';
  }
  if (projectPrevious) projectPrevious.disabled = filteredProjectSlides.length < 2;
  if (projectNext) projectNext.disabled = filteredProjectSlides.length < 2;
  renderProjectAnnouncement();
  if (announce && projectStatus && filteredProjectSlides.length > 1) {
    projectStatus.textContent = translate(locale, 'projects.position', { index: currentProjectIndex + 1, count: filteredProjectSlides.length });
  }
  updateProjectTimer();
};

updateProjectTimer = (): void => {
  if (projectTimer !== undefined) window.clearInterval(projectTimer);
  projectTimer = undefined;
  if (userPausedProjectMotion || reduceMotion.matches || pauseReasons.size > 0 || filteredProjectSlides.length < 2) return;
  projectTimer = window.setInterval(() => {
    currentProjectIndex = (currentProjectIndex + 1) % filteredProjectSlides.length;
    updateProjectState(false);
  }, 5200);
};

function moveProject(direction: number): void {
  if (filteredProjectSlides.length < 2) return;
  currentProjectIndex = (currentProjectIndex + direction + filteredProjectSlides.length) % filteredProjectSlides.length;
  updateProjectState(true);
}

projectPrevious?.addEventListener('click', () => moveProject(-1));
projectNext?.addEventListener('click', () => moveProject(1));
projectToggle?.addEventListener('click', () => {
  userPausedProjectMotion = !userPausedProjectMotion;
  updateProjectState(false);
});
filterButtons.forEach((button) => button.addEventListener('click', () => {
  currentFilter = button.dataset.projectFilter ?? 'all';
  currentProjectIndex = 0;
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
  if (lastProjectInteractionWasKeyboard) addProjectPauseReason('keyboard-card', true);
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
bindHorizontalDrag(projectStage, moveProject, (active) => addProjectPauseReason('drag', active));
document.addEventListener('visibilitychange', () => addProjectPauseReason('hidden', document.hidden));
if (projectCarousel && 'IntersectionObserver' in window) {
  const projectObserver = new IntersectionObserver(([entry]) => addProjectPauseReason('offscreen', !(entry?.isIntersecting ?? false)), { threshold: 0.08 });
  projectObserver.observe(projectCarousel);
}

document.addEventListener('click', (event) => {
  const trigger = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-project-open]');
  if (!trigger) return;
  if (trigger.closest<HTMLElement>('[data-project-slide]')?.hidden) return;
  if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
  const slide = trigger.closest<HTMLElement>('[data-project-slide]');
  if (!slide) return;
  let payload: ProjectPayload;
  try { payload = JSON.parse(slide.dataset.projectPayload ?? 'null') as ProjectPayload; } catch { return; }
  const content = createProjectDialog(payload);
  if (!openDialog(trigger, content)) return;
  event.preventDefault();
  addProjectPauseReason('dialog', true);
  applyLocale(locale);
});

const experienceSlides = [...document.querySelectorAll<HTMLElement>('[data-experience-slide]')];
const experienceControls = document.querySelector<HTMLElement>('[data-experience-controls]');
const experiencePrevious = document.querySelector<HTMLButtonElement>('[data-experience-previous]');
const experienceNext = document.querySelector<HTMLButtonElement>('[data-experience-next]');
const experienceStatus = document.querySelector<HTMLElement>('[data-experience-status]');
const experienceStage = document.querySelector<HTMLElement>('[data-experience-stage]');
let currentExperienceIndex = 0;

function updateExperienceState(): void {
  const count = experienceSlides.length;
  const stageWidth = experienceStage?.clientWidth ?? 1000;
  const centerWidth = Math.min(640, stageWidth * 0.9);
  const step = centerWidth * 0.78;
  experienceSlides.forEach((slide, index) => {
    let position = count ? (index - currentExperienceIndex + count) % count : 0;
    if (position > count / 2) position -= count;
    const visible = Math.abs(position) <= 1 || count <= 3;
    slide.hidden = !visible;
    slide.dataset.position = String(position);
    slide.dataset.active = String(position === 0);
    slide.style.setProperty('--slide-offset', `${position * step}px`);
    slide.setAttribute('aria-hidden', String(!visible));
    (slide as HTMLElement & { inert: boolean }).inert = !visible;
    const jump = slide.querySelector<HTMLButtonElement>('[data-experience-jump]');
    if (jump) {
      const canNavigate = count > 1 && Math.abs(position) === 1;
      jump.hidden = !canNavigate;
      const key: MessageKey = position < 0 ? 'experience.previous' : 'experience.next';
      jump.dataset.ariaId = messages.id[key];
      jump.dataset.ariaEn = messages.en[key];
      jump.setAttribute('aria-label', messages[locale][key]);
      jump.dataset.direction = String(position);
    }
  });
  if (experienceControls) experienceControls.hidden = count < 2;
  if (experiencePrevious) experiencePrevious.disabled = count < 2;
  if (experienceNext) experienceNext.disabled = count < 2;
  if (experienceStatus) {
    experienceStatus.textContent = count === 0
      ? messages[locale]['experience.empty']
      : translate(locale, 'experience.position', { index: currentExperienceIndex + 1, count });
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
experiencePrevious?.addEventListener('click', () => moveExperience(-1));
experienceNext?.addEventListener('click', () => moveExperience(1));
experienceSlides.forEach((slide) => {
  slide.querySelector<HTMLButtonElement>('[data-experience-jump]')?.addEventListener('click', () => {
    const position = Number(slide.dataset.position ?? 0);
    if (Math.abs(position) === 1) moveExperience(position);
  });
});
bindHorizontalDrag(experienceStage, moveExperience, undefined, 'summary, input, select, textarea, a');

const skillCards = [...document.querySelectorAll<HTMLElement>('[data-skill-card]')];
let activeSkillId = skillCards[0]?.dataset.skillId ?? '';

function updateSkillState(): void {
  skillCards.forEach((card) => {
    const active = card.dataset.skillId === activeSkillId;
    card.dataset.active = String(active);
    const button = card.querySelector<HTMLButtonElement>('[data-skill-activate]');
    const title = card.querySelector<HTMLElement>('.skill-card__detail strong');
    if (!button || !title) return;
    button.setAttribute('aria-expanded', String(active));
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

const emailButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const emailAnnouncement = document.querySelector<HTMLElement>('[data-copy-announcement]');
async function copyWithFallback(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  const temporary = document.createElement('textarea');
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';
  document.body.append(temporary);
  temporary.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch {}
  temporary.remove();
  previousFocus?.focus({ preventScroll: true });
  return copied;
}
emailButton?.addEventListener('click', async () => {
  const success = await copyWithFallback(emailButton.dataset.copyEmail ?? '');
  if (emailAnnouncement) {
    const key: MessageKey = success ? 'contact.copied' : 'contact.copyFailed';
    emailAnnouncement.dataset.messageKey = key;
    emailAnnouncement.textContent = messages[locale][key];
    emailAnnouncement.dataset.state = success ? 'success' : 'error';
  }
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
