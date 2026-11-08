import { createFrameOwner } from '../lib/raf-owner';
import { clampPageIndex } from '../lib/credential-pagination';
import { easeDeckProgress, interpolatePhotoDeckPose, isCurrentDeckGeneration, photoDeckRestPose, retargetPhotoDeck, settlePhotoDeck, transitionProgress, wrapPhotoIndex } from '../lib/competition-state.mjs';
import { scheduleV6EntranceScan } from './v6-entrance';
import { translate, type Locale, type MessageKey } from '../lib/i18n';

type DeckState = {
  deck: HTMLElement;
  layers: HTMLImageElement[];
  selectedIndex: number;
  targetIndex: number;
  generation: number;
  phase: 'idle' | 'out' | 'in';
  startedAt: number | undefined;
  legTargetIndex: number;
  outgoingIndex: number | undefined;
  outgoingDirection: number;
  phaseGeneration: number;
  alternate: boolean;
  frameOwner: ReturnType<typeof createFrameOwner>;
};

const section = document.querySelector<HTMLElement>('[data-competition-section]');
const viewport = section?.querySelector<HTMLElement>('[data-competition-viewport]');
const track = section?.querySelector<HTMLElement>('[data-competition-track]');
const pages = section ? [...section.querySelectorAll<HTMLElement>('[data-competition-page]')] : [];
const pagination = section?.querySelector<HTMLElement>('[data-competition-pagination]');
const pageStatus = section?.querySelector<HTMLElement>('[data-competition-page-status]');
const previousButton = section?.querySelector<HTMLButtonElement>('[data-competition-previous]');
const nextButton = section?.querySelector<HTMLButtonElement>('[data-competition-next]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactDeckViewport = window.matchMedia('(max-width: 48rem)');
let currentPage = 0;
const decks: DeckState[] = [];

function currentLocale(): Locale {
  return document.documentElement.dataset.locale === 'en' ? 'en' : 'id';
}

function restPose(state: DeckState, rank: number) {
  const source = photoDeckRestPose(rank, compactDeckViewport.matches, state.alternate);
  const pose = {
    x: source.x ?? 0,
    y: source.y ?? 0,
    rotate: source.rotate ?? 0,
    scale: source.scale ?? 1,
    opacity: source.opacity ?? 1,
  };
  if (reduceMotion.matches) return { ...pose, x: 0, y: 0, rotate: 0, scale: 1, z: 3 - rank };
  return { ...pose, z: 3 - rank };
}

function updateCounter(state: DeckState, index: number): void {
  const counter = state.deck.querySelector<HTMLElement>('[data-photo-counter]');
  if (counter) counter.textContent = `${index + 1} / ${state.layers.length}`;
}

function writeLayerPose(layer: HTMLImageElement, pose: { x: number; y: number; rotate: number; scale: number; opacity: number; z: number }): void {
  layer.style.zIndex = String(pose.z);
  layer.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotate}deg) scale(${pose.scale})`;
  layer.style.opacity = String(pose.opacity);
}

function setDeckAnimationHint(state: DeckState, active: boolean): void {
  for (const layer of state.layers) {
    if (active) layer.style.willChange = 'transform, opacity';
    else layer.style.removeProperty('will-change');
  }
}

function writeInterpolatedPose(
  layer: HTMLImageElement,
  from: { x: number; y: number; rotate: number; scale: number; opacity: number },
  to: { x: number; y: number; rotate: number; scale: number; opacity: number },
  progress: number,
  z: number,
  rank: number,
): void {
  const pose = interpolatePhotoDeckPose(from, to, progress);
  layer.dataset.stackRank = String(rank);
  writeLayerPose(layer, { ...pose, z });
}

function setDeckLayers(state: DeckState, selected = state.selectedIndex, counterIndex = selected): void {
  const count = state.layers.length;
  const locale = currentLocale();
  state.layers.forEach((layer, index) => {
    const rank = wrapPhotoIndex(index - selected, count);
    const active = index === selected;
    const pose = restPose(state, rank);
    layer.dataset.current = String(active);
    layer.dataset.stackRank = String(rank);
    layer.style.setProperty('--photo-rank', String(rank));
    writeLayerPose(layer, pose);
    layer.alt = active ? layer.dataset[locale === 'id' ? 'altId' : 'altEn'] ?? '' : '';
    layer.setAttribute('aria-hidden', String(!active));
  });
  updateCounter(state, counterIndex);
  const surface = state.deck.querySelector<HTMLButtonElement>('[data-photo-advance]');
  const title = state.deck.dataset[locale === 'id' ? 'titleId' : 'titleEn'] ?? '';
  const nextKey: MessageKey = 'competitions.photoNext';
  if (surface) {
    surface.setAttribute('aria-label', translate(locale, nextKey, { title }));
    surface.dataset.ariaId = translate('id', nextKey, { title: state.deck.dataset.titleId ?? '' });
    surface.dataset.ariaEn = translate('en', nextKey, { title: state.deck.dataset.titleEn ?? '' });
  }
}

function announceDeck(state: DeckState): void {
  const status = state.deck.querySelector<HTMLElement>('[data-photo-status]');
  if (!status) return;
  const locale = currentLocale();
  status.textContent = translate(locale, 'competitions.photoPosition', { index: state.selectedIndex + 1, count: state.layers.length });
}

function finishDeck(state: DeckState, announce = false): void {
  state.frameOwner.cancel();
  const settled = settlePhotoDeck(state, state.layers.length);
  state.phase = 'idle';
  state.startedAt = undefined;
  state.selectedIndex = settled.selectedIndex;
  state.targetIndex = settled.targetIndex;
  state.generation = settled.generation;
  state.phaseGeneration = settled.generation;
  state.legTargetIndex = settled.selectedIndex;
  state.outgoingIndex = undefined;
  state.outgoingDirection = 1;
  state.deck.dataset.phase = 'idle';
  setDeckAnimationHint(state, false);
  setDeckLayers(state, settled.selectedIndex, settled.selectedIndex);
  if (announce) announceDeck(state);
}

function outgoingPose(direction: number) {
  return { x: 38 * direction, y: -20, rotate: 14 * direction, scale: 1.02, opacity: 0.8 };
}

function runDeckFrame(state: DeckState, timestamp: number): void {
  if (state.phase === 'idle') return;
  if (state.startedAt === undefined) state.startedAt = timestamp;
  if (!isCurrentDeckGeneration(state.generation, state.phaseGeneration)) {
    // Clicks during a shuffle update the logical target. Finish this short leg at
    // its already-started photo, then start a new leg for the latest target.
    state.phaseGeneration = state.generation;
  }
  if (state.phase === 'out') {
    if (state.legTargetIndex === state.selectedIndex) {
      finishDeck(state, true);
      return;
    }
    const linearProgress = transitionProgress(timestamp, state.startedAt, 150);
    const progress = easeDeckProgress(linearProgress);
    const outgoingIndex = state.selectedIndex;
    const direction = state.legTargetIndex === wrapPhotoIndex(state.selectedIndex + 1, state.layers.length) ? 1 : -1;
    const flyingPose = outgoingPose(direction);
    state.layers.forEach((layer, index) => {
      const fromRank = wrapPhotoIndex(index - state.selectedIndex, state.layers.length);
      const toRank = wrapPhotoIndex(index - state.legTargetIndex, state.layers.length);
      const from = restPose(state, fromRank);
      const to = restPose(state, toRank);
      if (index === outgoingIndex) {
        writeInterpolatedPose(layer, from, flyingPose, progress, 4, 0);
      } else {
        const incoming = index === state.legTargetIndex;
        const z = incoming
          ? (progress < 0.5 ? 3 - fromRank : 3)
          : (progress < 0.5 ? 3 - fromRank : 3 - toRank);
        writeInterpolatedPose(layer, from, incoming ? restPose(state, 0) : to, progress, z, incoming ? 0 : toRank);
      }
    });
    if (progress >= 1) {
      state.outgoingIndex = outgoingIndex;
      state.outgoingDirection = direction;
      state.selectedIndex = state.legTargetIndex;
      setDeckLayers(state, state.selectedIndex, state.targetIndex);
      state.phase = 'in';
      state.deck.dataset.phase = 'in';
      state.startedAt = timestamp;
      const outgoing = state.layers[state.outgoingIndex];
      if (outgoing) writeLayerPose(outgoing, { ...flyingPose, z: 1 });
    }
  } else {
    const linearProgress = transitionProgress(timestamp, state.startedAt, 190);
    const progress = easeDeckProgress(linearProgress);
    const outgoing = state.outgoingIndex === undefined ? undefined : state.layers[state.outgoingIndex];
    const finalRank = state.outgoingIndex === undefined
      ? 0
      : wrapPhotoIndex(state.outgoingIndex - state.selectedIndex, state.layers.length);
    if (outgoing) {
      const target = restPose(state, finalRank);
      const flying = outgoingPose(state.outgoingDirection);
      writeInterpolatedPose(outgoing, flying, target, progress, progress >= 0.98 ? target.z : 1, finalRank);
    }
    if (progress >= 1) {
      state.phase = 'idle';
      state.startedAt = undefined;
      if (state.targetIndex !== state.selectedIndex) {
        state.phase = 'out';
        state.deck.dataset.phase = 'out';
        state.legTargetIndex = state.targetIndex;
        state.phaseGeneration = state.generation;
        state.startedAt = undefined;
      } else {
        state.outgoingIndex = undefined;
        state.deck.dataset.phase = 'idle';
        setDeckAnimationHint(state, false);
        setDeckLayers(state, state.selectedIndex, state.selectedIndex);
        announceDeck(state);
      }
    }
  }
  if (state.phase !== 'idle') state.frameOwner.schedule();
}

function requestPhoto(state: DeckState, direction: number): void {
  const next = retargetPhotoDeck(state, direction, state.layers.length);
  state.targetIndex = next.targetIndex;
  state.generation = next.generation;
  updateCounter(state, state.targetIndex);
  if (state.targetIndex === state.selectedIndex) {
    finishDeck(state, true);
    return;
  }
  if (reduceMotion.matches || document.hidden || !section?.isConnected) {
    finishDeck(state, true);
    return;
  }
  if (state.phase === 'idle') {
    state.phase = 'out';
    state.deck.dataset.phase = 'out';
    state.legTargetIndex = state.targetIndex;
    state.phaseGeneration = state.generation;
    state.startedAt = undefined;
  }
  setDeckAnimationHint(state, true);
  state.frameOwner.schedule();
}

function measureActivePage(): void {
  const page = pages[currentPage];
  if (!track || !page) return;
  const height = Math.ceil(page.scrollHeight);
  if (height > 0) track.style.height = `${height}px`;
}

function refreshDeckLayout(): void {
  decks.forEach((deck) => finishDeck(deck));
  measureActivePage();
}

function updatePage(index: number, announce = true): void {
  if (!track) return;
  const previousPage = currentPage;
  const focusedControl = document.activeElement === nextButton
    ? 'next'
    : document.activeElement === previousButton ? 'previous' : undefined;
  currentPage = clampPageIndex(index, pages.length);
  pages.forEach((page, pageIndex) => {
    const active = pageIndex === currentPage;
    page.setAttribute('aria-hidden', String(!active));
    page.setAttribute('aria-current', active ? 'page' : 'false');
    (page as HTMLElement & { inert: boolean }).inert = !active;
  });
  const pageCount = pages.length;
  track.style.transform = `translate3d(-${pageCount ? currentPage * 100 / pageCount : 0}%, 0, 0)`;
  measureActivePage();
  if (pageStatus) {
    const key: MessageKey = 'competitions.page';
    pageStatus.textContent = pageCount ? translate(currentLocale(), key, { index: currentPage + 1, count: pageCount }) : '';
    if (announce) pageStatus.dataset.state = 'changed';
    else pageStatus.removeAttribute('data-state');
  }
  if (previousButton) previousButton.disabled = currentPage <= 0;
  if (nextButton) nextButton.disabled = currentPage >= pageCount - 1;
  if (focusedControl) {
    const preferred = focusedControl === 'next' ? nextButton : previousButton;
    const fallback = focusedControl === 'next' ? previousButton : nextButton;
    const focusTarget = preferred?.disabled ? fallback : preferred;
    focusTarget?.focus({ preventScroll: true });
  }
  decks.forEach((deck) => finishDeck(deck));
  if (currentPage !== previousPage) scheduleV6EntranceScan();
}

function initializeDeck(deck: HTMLElement): void {
  const layers = [...deck.querySelectorAll<HTMLImageElement>('[data-photo-index]')];
  if (layers.length < 1) return;
  const initialIndex = layers.findIndex((layer) => layer.dataset.current === 'true');
  const row = deck.closest<HTMLElement>('[data-competition-row]');
  const page = row?.parentElement;
  const rowIndex = row && page ? [...page.children].indexOf(row) : 0;
  const state = {
    deck,
    layers,
    selectedIndex: initialIndex >= 0 ? initialIndex : 0,
    targetIndex: initialIndex >= 0 ? initialIndex : 0,
    generation: 0,
    phase: 'idle' as const,
    startedAt: undefined,
    legTargetIndex: initialIndex >= 0 ? initialIndex : 0,
    outgoingIndex: undefined,
    outgoingDirection: 1,
    phaseGeneration: 0,
    alternate: rowIndex >= 0 && rowIndex % 2 === 1,
    frameOwner: createFrameOwner(
      (callback) => window.requestAnimationFrame(callback),
      (handle) => window.cancelAnimationFrame(handle),
      (timestamp) => runDeckFrame(state, timestamp),
    ),
  } as DeckState;
  decks.push(state);
  deck.dataset.phase = 'idle';
  const advance = deck.querySelector<HTMLButtonElement>('[data-photo-advance]');
  const controls = deck.querySelector<HTMLElement>('[data-photo-controls]');
  if (advance) advance.hidden = false;
  if (controls) controls.hidden = false;
  setDeckLayers(state);
  advance?.addEventListener('click', () => requestPhoto(state, 1));
  controls?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-photo-direction]') : null;
    if (!button || button.disabled) return;
    requestPhoto(state, Number(button.dataset.photoDirection));
  });
  deck.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (!(event.target instanceof Element) || !event.target.closest('button')) return;
    event.preventDefault();
    event.stopPropagation();
    requestPhoto(state, event.key === 'ArrowLeft' ? -1 : 1);
  });
  deck.addEventListener('pointercancel', () => finishDeck(state, true));
}

if (section && viewport && track && pages.length > 0) {
  try {
    pages.forEach((page, pageIndex) => {
      if (pageIndex !== 0) {
        page.setAttribute('aria-hidden', 'true');
        (page as HTMLElement & { inert: boolean }).inert = true;
      }
    });
    section.querySelectorAll<HTMLElement>('[data-competition-deck]').forEach(initializeDeck);
    section.dataset.enhanced = 'true';
    updatePage(0, false);
    if (pagination) pagination.hidden = pages.length <= 1;
    previousButton?.addEventListener('click', () => updatePage(currentPage - 1));
    nextButton?.addEventListener('click', () => updatePage(currentPage + 1));
    pagination?.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft' && currentPage > 0) {
        event.preventDefault();
        updatePage(currentPage - 1);
      } else if (event.key === 'ArrowRight' && currentPage < pages.length - 1) {
        event.preventDefault();
        updatePage(currentPage + 1);
      }
    });
    track.addEventListener('transitionend', (event) => {
      if (event.target !== track || event.propertyName !== 'transform') return;
      scheduleV6EntranceScan();
    });
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(refreshDeckLayout);
      resizeObserver.observe(viewport);
      pages.forEach((page) => resizeObserver.observe(page));
    }
    window.addEventListener('resize', refreshDeckLayout, { passive: true });
    document.addEventListener('portfolio:localechange', () => {
      decks.forEach((deck) => finishDeck(deck));
      updatePage(currentPage, false);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) decks.forEach((deck) => finishDeck(deck, true));
    });
    reduceMotion.addEventListener('change', (event) => {
      if (event.matches) decks.forEach((deck) => finishDeck(deck, true));
      else decks.forEach((deck) => setDeckLayers(deck));
    });
    compactDeckViewport.addEventListener('change', refreshDeckLayout);
    window.addEventListener('pagehide', () => decks.forEach((deck) => finishDeck(deck)));
  } catch {
    section.removeAttribute('data-enhanced');
    pages.forEach((page) => {
      page.removeAttribute('aria-hidden');
      page.removeAttribute('aria-current');
      (page as HTMLElement & { inert: boolean }).inert = false;
    });
    track.style.removeProperty('transform');
    track.style.removeProperty('height');
    if (pagination) pagination.hidden = true;
    section.querySelectorAll<HTMLElement>('[data-photo-advance], [data-photo-controls]').forEach((control) => { control.hidden = true; });
    decks.forEach((deck) => deck.frameOwner.cancel());
  }
}
