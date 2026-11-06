import { createOnceLedger, headingTiming, headingVisibleCount, isLanyardHandoffEligible, segmentGraphemes } from '../lib/v6-entrance-state.mjs';
import type { Locale } from '../lib/i18n';

type EntryId = string;
type HeadingRecord = {
  text: string;
  source: HTMLSpanElement;
  visual: HTMLSpanElement;
  characters: HTMLSpanElement[];
  frame?: number;
  resizeObserver?: ResizeObserver;
  typing: boolean;
};

const headingRecords = new WeakMap<HTMLElement, HeadingRecord>();
const activeHeadings = new Set<HTMLElement>();
let currentLocale: Locale = 'id';
let controllerStarted = false;
let ledger: ReturnType<typeof createOnceLedger> | undefined;
let entranceObserver: IntersectionObserver | undefined;
let scheduleVisibleScanCallback: (() => void) | undefined;
let finishEntryCallback: ((id: EntryId) => void) | undefined;

export function scheduleV6EntranceScan(): void {
  scheduleVisibleScanCallback?.();
}

export function finishV6Entrance(id: string): void {
  finishEntryCallback?.(id);
}

function entryId(element: HTMLElement): EntryId | undefined {
  const value = element.dataset.v6Enter?.trim();
  return value || undefined;
}

function recordState(id: EntryId | undefined): 'unseen' | 'entering' | 'done' | undefined {
  if (!id || !ledger) return undefined;
  const state = ledger.state(id);
  return state === 'unseen' || state === 'entering' || state === 'done' ? state : undefined;
}

function cancelHeadingWork(heading: HTMLElement, record: HeadingRecord): void {
  if (record.frame !== undefined) window.cancelAnimationFrame(record.frame);
  delete record.frame;
  record.resizeObserver?.disconnect();
  delete record.resizeObserver;
  record.typing = false;
  activeHeadings.delete(heading);
  heading.removeAttribute('data-v6-typing');
}

function makeHeadingRecord(heading: HTMLElement, text: string, locale: Locale, revealAll: boolean): HeadingRecord {
  let source = heading.querySelector<HTMLSpanElement>(':scope > .v6-heading__source');
  if (!source) {
    source = document.createElement('span');
    source.className = 'v6-heading__source';
    heading.prepend(source);
  }
  let visual = heading.querySelector<HTMLSpanElement>(':scope > .v6-heading__visual');
  if (!visual) {
    visual = document.createElement('span');
    visual.className = 'v6-heading__visual';
    visual.setAttribute('aria-hidden', 'true');
    heading.append(visual);
  }
  source.textContent = text;
  visual.setAttribute('aria-hidden', 'true');
  const graphemes = segmentGraphemes(text, locale);
  let characters = Array.from(visual.querySelectorAll<HTMLSpanElement>(':scope > .v6-heading__grapheme'));
  const existingText = characters.map((character) => character.textContent ?? '').join('');
  if (existingText !== text || characters.length !== graphemes.length) {
    characters = graphemes.map((grapheme) => {
      const character = document.createElement('span');
      character.className = 'v6-heading__grapheme';
      character.textContent = grapheme ?? '';
      return character;
    });
    visual.replaceChildren(...characters);
  }
  if (revealAll) characters.forEach((character) => { character.dataset.visible = 'true'; });
  heading.dataset.v6Ready = 'true';
  heading.dataset.v6HeadingState = revealAll ? 'done' : 'unseen';
  const record: HeadingRecord = {
    text,
    source,
    visual,
    characters,
    typing: false,
  };
  headingRecords.set(heading, record);
  return record;
}

function ownsHeadingNodes(heading: HTMLElement, record: HeadingRecord): boolean {
  return record.source.parentElement === heading
    && record.visual.parentElement === heading
    && heading.children.length === 2
    && heading.children[0] === record.source
    && heading.children[1] === record.visual;
}

function finishHeading(heading: HTMLElement): void {
  const record = headingRecords.get(heading);
  if (record) {
    cancelHeadingWork(heading, record);
    record.characters.forEach((character) => { character.dataset.visible = 'true'; });
  }
  heading.removeAttribute('data-v6-typing');
  heading.dataset.v6HeadingState = 'done';
  if (entryId(heading) === 'hero:title') {
    delete document.documentElement.dataset.v6EntrancePreflight;
  }
}

function prepareHeading(heading: HTMLElement, locale: Locale): HeadingRecord | undefined {
  const source = heading.querySelector<HTMLElement>(':scope > .v6-heading__source');
  const text = locale === 'id'
    ? source?.dataset.copyId ?? heading.dataset.copyId
    : source?.dataset.copyEn ?? heading.dataset.copyEn;
  if (typeof text !== 'string') return undefined;

  const id = entryId(heading);
  const state = recordState(id);
  const current = headingRecords.get(heading);
  const nodesIntact = current ? ownsHeadingNodes(heading, current) : false;

  if (current?.text === text && nodesIntact) {
    if (state === 'done' && current.typing) finishHeading(heading);
    return current;
  }

  const consumed = state === 'entering' || state === 'done';
  if (current) cancelHeadingWork(heading, current);
  if (state === 'entering' && id) ledger?.finish(id);
  const record = makeHeadingRecord(heading, text, locale, consumed);
  if (consumed) {
    heading.dataset.v6HeadingState = 'done';
    heading.dataset.v6State = 'done';
  }
  return record;
}

export function syncV6HeadingText(locale: Locale): void {
  currentLocale = locale;
  document.querySelectorAll<HTMLElement>('[data-v6-heading]').forEach((heading) => {
    prepareHeading(heading, locale);
  });
}

function finishEntry(id: EntryId, aliases: ReadonlyMap<EntryId, HTMLElement[]>): void {
  if (!ledger) return;
  ledger.finish(id);
  aliases.get(id)?.forEach((target) => {
    entranceObserver?.unobserve(target);
    target.dataset.v6State = 'done';
    if (target.matches('[data-v6-type]')) finishHeading(target);
    else target.querySelectorAll<HTMLElement>('[data-v6-type]').forEach(finishHeading);
  });

  const animations = activeAnimations.get(id);
  if (animations) {
    activeAnimations.delete(id);
    animations.forEach((animation) => animation.cancel());
  }
}

function visibleViewportTop(): number {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return 0;
  const rect = header.getBoundingClientRect();
  return rect.top <= 1 && rect.bottom > 0 ? Math.min(window.innerHeight, rect.bottom) : 0;
}

function clipsAxis(value: string): boolean {
  return value === 'hidden' || value === 'clip' || value === 'auto' || value === 'scroll';
}

function targetIsVisible(target: HTMLElement): boolean {
  if (!target.isConnected || target.closest('[hidden]')) return false;
  const targetRect = target.getBoundingClientRect();
  if (targetRect.width <= 0 || targetRect.height <= 0 || target.getClientRects().length === 0) return false;

  let left = Math.max(0, targetRect.left);
  let right = Math.min(window.innerWidth, targetRect.right);
  const inHeader = Boolean(target.closest('.site-header'));
  let top = Math.max(inHeader ? 0 : visibleViewportTop(), targetRect.top);
  let bottom = Math.min(window.innerHeight, targetRect.bottom);
  for (let node: HTMLElement | null = target; node; node = node.parentElement) {
    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || Number.parseFloat(style.opacity) <= 0.001) return false;
    if (node === target) continue;
    const overflowX = clipsAxis(style.overflowX);
    const overflowY = clipsAxis(style.overflowY);
    if (!overflowX && !overflowY) continue;
    const rect = node.getBoundingClientRect();
    const clipLeft = rect.left + node.clientLeft;
    const clipTop = rect.top + node.clientTop;
    if (overflowX) {
      left = Math.max(left, clipLeft);
      right = Math.min(right, clipLeft + node.clientWidth);
    }
    if (overflowY) {
      top = Math.max(top, clipTop);
      bottom = Math.min(bottom, clipTop + node.clientHeight);
    }
  }
  const visibleWidth = right - left;
  const visibleHeight = bottom - top;
  const visibleArea = visibleWidth * visibleHeight;
  const requiredArea = Math.min(6000, Math.max(600, targetRect.width * targetRect.height * 0.12));
  return visibleWidth >= 8 && visibleHeight >= 12 && visibleArea >= requiredArea;
}

function animationElement(target: HTMLElement): HTMLElement | undefined {
  if (target.dataset.v6RequiresReady === 'true') {
    const state = target.dataset.lanyardState;
    if (state === 'error' || state === 'reduced') {
      return target.querySelector<HTMLElement>('.hero-portrait__fallback') ?? undefined;
    }
    if (state !== 'ready') return undefined;
  }
  const selector = target.dataset.v6EnterTarget;
  if (!selector) return target;
  try {
    return target.querySelector<HTMLElement>(selector) ?? undefined;
  } catch {
    return target;
  }
}

const activeAnimations = new Map<EntryId, Map<HTMLElement, Animation>>();

export function initializeV6Entrances(): void {
  const root = document.documentElement;
  if (!root.hasAttribute('data-v6-home-page') || controllerStarted) return;
  controllerStarted = true;

  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-v6-enter]'))
    .filter((target) => Boolean(entryId(target)));
  const ids = Array.from(new Set(targets.map((target) => entryId(target) as EntryId)));
  ledger = createOnceLedger(ids);
  const aliases = new Map<EntryId, HTMLElement[]>();
  targets.forEach((target) => {
    const id = entryId(target);
    if (!id) return;
    target.dataset.v6State = 'unseen';
    const group = aliases.get(id) ?? [];
    group.push(target);
    aliases.set(id, group);
  });
  // Create the initial grapheme layer while each ledger entry is still unseen.
  // Building it only after begin() makes prepareHeading mistake first entry
  // for a locale-change replay and reveal the entire heading immediately.
  targets.filter((target) => target.matches('[data-v6-type]')).forEach((heading) => {
    prepareHeading(heading, currentLocale);
  });
  root.dataset.v6EntrancesReady = 'true';
  const abort = new AbortController();
  const finishOwnedEntry = (id: EntryId): void => {
    if (aliases.has(id)) finishEntry(id, aliases);
  };
  finishEntryCallback = finishOwnedEntry;
  abort.signal.addEventListener('abort', () => {
    if (finishEntryCallback === finishOwnedEntry) finishEntryCallback = undefined;
  }, { once: true });
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let headerObserver: ResizeObserver | undefined;
  let scanFrame: number | undefined;
  let observerMargin = '';

  const finishAll = (): void => {
    ids.forEach((id) => finishEntry(id, aliases));
    root.querySelectorAll<HTMLElement>('[data-v6-heading]').forEach(finishHeading);
  };

  const finishActive = (): void => {
    ids.forEach((id) => {
      if (ledger?.state(id) === 'entering') finishEntry(id, aliases);
    });
    Array.from(activeHeadings).forEach(finishHeading);
  };

  const animateAlias = (id: EntryId, target: HTMLElement, delay: number): Animation | undefined => {
    const visual = animationElement(target);
    if (!visual) return undefined;
    if (target.matches('[data-v6-type]')) return undefined;
    if (typeof visual.animate !== 'function') return undefined;

    const safe = target.dataset.v6Safe === 'true' || Boolean(visual.closest('a, button, input, select, textarea, summary, [role="button"], [role="tab"]'));
    const startOpacity = safe ? 0.72 : 0;
    const travel = safe ? '0px 5px' : '0px 14px';
    const keyframes: Keyframe[] = CSS.supports?.('translate', '0px 1px')
      ? [
          { opacity: startOpacity, translate: travel },
          { opacity: 1, translate: '0px 0px' },
        ]
      : [{ opacity: startOpacity }, { opacity: 1 }];

    try {
      const animation = visual.animate(keyframes, {
        duration: safe ? 360 : 560,
        delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      });
      const active = activeAnimations.get(id) ?? new Map<HTMLElement, Animation>();
      active.set(visual, animation);
      activeAnimations.set(id, active);
      animation.finished.then(() => {
        if (activeAnimations.get(id)?.get(visual) !== animation) return;
        active.delete(visual);
        animation.cancel();
        if (active.size === 0) {
          activeAnimations.delete(id);
          finishEntry(id, aliases);
        }
      }).catch(() => {
        if (activeAnimations.get(id)?.get(visual) !== animation) return;
        finishEntry(id, aliases);
      });
      return animation;
    } catch {
      return undefined;
    }
  };

  const startHeading = (heading: HTMLElement, id: EntryId): void => {
    const record = prepareHeading(heading, currentLocale);
    if (!record || ledger?.state(id) !== 'entering' || record.typing) {
      if (!record || ledger?.state(id) !== 'entering') finishEntry(id, aliases);
      return;
    }
    if (record.characters.length === 0) {
      finishEntry(id, aliases);
      return;
    }

    record.typing = true;
    heading.dataset.v6Typing = 'true';
    heading.dataset.v6HeadingState = 'typing';
    if (id === 'hero:title') delete document.documentElement.dataset.v6EntrancePreflight;
    activeHeadings.add(heading);
    const timing = headingTiming(record.characters.length, heading.tagName === 'H1');
    const generation = record;
    const startedAt = performance.now();
    const firstCharacter = record.characters[0];
    if (firstCharacter) firstCharacter.dataset.visible = 'true';

    if ('ResizeObserver' in window) {
      const initialWidth = heading.getBoundingClientRect().width;
      record.resizeObserver = new ResizeObserver(() => {
        if (headingRecords.get(heading) !== generation || !record.typing) return;
        if (Math.abs(heading.getBoundingClientRect().width - initialWidth) > 1) finishEntry(id, aliases);
      });
      record.resizeObserver.observe(heading);
    }

    const revealFrame = (timestamp: number): void => {
      if (headingRecords.get(heading) !== generation || !record.typing) return;
      const elapsed = Math.max(0, timestamp - startedAt);
      const visibleCount = headingVisibleCount(elapsed, timing.interval, record.characters.length);
      for (let index = 0; index < visibleCount; index += 1) {
        const character = record.characters[index];
        if (character) character.dataset.visible = 'true';
      }
      if (visibleCount >= record.characters.length || elapsed >= timing.duration) {
        finishEntry(id, aliases);
        return;
      }
      record.frame = window.requestAnimationFrame(revealFrame);
    };
    record.frame = window.requestAnimationFrame(revealFrame);
  };

  const startEntry = (id: EntryId, delay: number): void => {
    if (!ledger || document.hidden || ledger.state(id) !== 'unseen') return;
    if (motionPreference.matches) {
      finishEntry(id, aliases);
      return;
    }
    if (id === 'hero:title' && root.hasAttribute('data-v6-entrance-preflight-expired')) {
      finishEntry(id, aliases);
      return;
    }
    const group = aliases.get(id) ?? [];
    const readyLanyard = id === 'hero:lanyard'
      ? group.find((target) => target.dataset.v6RequiresReady === 'true')
      : undefined;
    if (readyLanyard?.dataset.lanyardState === 'ready'
      && !isLanyardHandoffEligible(readyLanyard.dataset.lanyardState, targetIsVisible(readyLanyard))) return;
    if (!ledger.begin(id)) return;
    group.forEach((target) => {
      entranceObserver?.unobserve(target);
      target.dataset.v6State = 'entering';
    });
    if (readyLanyard?.dataset.lanyardState === 'ready') {
      finishEntry(id, aliases);
      return;
    }
    const heading = group.find((target) => target.matches('[data-v6-type]'));
    if (heading) {
      startHeading(heading, id);
      return;
    }

    const visibleAliases = group.filter((target) => {
      const visual = animationElement(target);
      return Boolean(visual && targetIsVisible(visual));
    });
    const started = visibleAliases.map((target) => animateAlias(id, target, delay)).filter((animation): animation is Animation => Boolean(animation));
    if (started.length === 0) finishEntry(id, aliases);
  };

  const startVisibleTargets = (candidates: readonly HTMLElement[]): void => {
    if (document.hidden || motionPreference.matches) return;
    const selected = new Map<EntryId, HTMLElement>();
    candidates.forEach((target) => {
      const id = entryId(target);
      const stableLanyardTarget = id === 'hero:lanyard' && target.dataset.lanyardState === 'ready';
      const visual = stableLanyardTarget ? target : animationElement(target);
      const visible = stableLanyardTarget
        ? isLanyardHandoffEligible(target.dataset.lanyardState, targetIsVisible(target))
        : Boolean(visual && targetIsVisible(visual));
      if (!id || ledger?.state(id) !== 'unseen' || !visual || !visible || selected.has(id)) return;
      selected.set(id, target);
    });
    Array.from(selected.entries())
      .sort((left, right) => left[1].getBoundingClientRect().top - right[1].getBoundingClientRect().top)
      .forEach(([id, target], index) => {
        const specified = Number.parseFloat(target.dataset.v6Delay ?? '');
        const delay = Number.isFinite(specified) ? Math.min(240, Math.max(0, specified)) : Math.min(180, index * 36);
        startEntry(id, delay);
      });
  };

  const scanVisible = (): void => {
    scanFrame = undefined;
    if (document.hidden || motionPreference.matches) return;
    startVisibleTargets(targets);
  };

  const queueVisibleScan = (): void => {
    if (scanFrame !== undefined || document.hidden) return;
    scanFrame = window.requestAnimationFrame(scanVisible);
  };
  scheduleVisibleScanCallback = queueVisibleScan;

  const refreshObserver = (): void => {
    if (!('IntersectionObserver' in window)) return;
    const margin = '0px';
    if (entranceObserver && margin === observerMargin) return;
    entranceObserver?.disconnect();
    observerMargin = margin;
    entranceObserver = new IntersectionObserver((entries) => {
      if (document.hidden || motionPreference.matches) return;
      startVisibleTargets(entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement));
    }, { threshold: [0, 0.12], rootMargin: margin });
    targets.forEach((target) => {
      const id = entryId(target);
      if (id && ledger?.state(id) === 'unseen') entranceObserver?.observe(target);
    });
  };

  if (motionPreference.matches || !('IntersectionObserver' in window)) finishAll();
  else {
    refreshObserver();
    const header = document.querySelector<HTMLElement>('.site-header');
    if (header && 'ResizeObserver' in window) {
      headerObserver = new ResizeObserver(() => {
        refreshObserver();
        queueVisibleScan();
      });
      headerObserver.observe(header);
    }
    queueVisibleScan();
  }

  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) finishAll();
    else {
      refreshObserver();
      queueVisibleScan();
    }
  }, { signal: abort.signal });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finishActive();
    else queueVisibleScan();
  }, { signal: abort.signal });

  const finishInteractedEntry = (event: Event): void => {
    const origin = event.target instanceof Element ? event.target : null;
    if (!origin?.closest('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [role="button"], [role="tab"], [tabindex]:not([tabindex="-1"])')) return;
    const marker = origin?.closest<HTMLElement>('[data-v6-enter]');
    const id = marker && root.contains(marker) ? entryId(marker) : undefined;
    if (id && ledger?.state(id) === 'entering') finishEntry(id, aliases);
  };
  root.addEventListener('pointerdown', finishInteractedEntry, { capture: true, signal: abort.signal });
  root.addEventListener('focusin', finishInteractedEntry, { capture: true, signal: abort.signal });
  root.addEventListener('click', finishInteractedEntry, { capture: true, signal: abort.signal });
  root.addEventListener('v6:lanyard-statechange', queueVisibleScan, { signal: abort.signal });
  window.addEventListener('scroll', queueVisibleScan, { passive: true, signal: abort.signal });

  const safeHashTarget = (): HTMLElement | null => {
    if (!window.location.hash || window.location.hash === '#') return null;
    try {
      return document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    } catch {
      return null;
    }
  };
  window.addEventListener('hashchange', () => {
    if (safeHashTarget()) queueVisibleScan();
  }, { signal: abort.signal });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      finishActive();
      queueVisibleScan();
    }
  }, { signal: abort.signal });
  window.addEventListener('resize', () => {
    refreshObserver();
    queueVisibleScan();
  }, { passive: true, signal: abort.signal });
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) {
      finishActive();
      return;
    }
    finishActive();
    entranceObserver?.disconnect();
    headerObserver?.disconnect();
    if (scanFrame !== undefined) window.cancelAnimationFrame(scanFrame);
    if (scheduleVisibleScanCallback === queueVisibleScan) scheduleVisibleScanCallback = undefined;
    abort.abort();
  }, { signal: abort.signal });
}
