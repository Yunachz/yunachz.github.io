import { createFrameOwner } from '../lib/raf-owner';

const about = document.querySelector<HTMLElement>('#about');
const canvas = about?.querySelector<HTMLCanvasElement>('[data-about-grid]');
const marquee = about?.querySelector<HTMLElement>('[data-about-marquee]');
const track = about?.querySelector<HTMLElement>('[data-marquee-track]');
const groups = marquee ? [...marquee.querySelectorAll<HTMLElement>('[data-marquee-group]')] : [];
const background = about?.querySelector<HTMLElement>('[data-about-motion-background]');
let context: CanvasRenderingContext2D | null = null;
try { context = canvas?.getContext('2d') ?? null; } catch { context = null; }
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reducedMotion.matches;
const coarsePointer = window.matchMedia('(pointer: coarse)');
const smallViewport = window.matchMedia('(max-width: 48rem)');
const pauseReasons = new Set<string>();
let marqueeAnimation: Animation | undefined;
let marqueePhase = 0;
let marqueeDuration = 26000;
let cachedBounds: DOMRect | undefined;
let cssWidth = 0;
let cssHeight = 0;
let dpr = 1;
let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;
let lastPointerClientX: number | undefined;
let lastPointerClientY: number | undefined;
let intensity = 0;
let targetIntensity = 0;
let lastFrame = 0;
let lanyardPointerDown = new Set<number>();
let lanyardCaptured = new Set<number>();
const abort = new AbortController();
let aboutObserver: IntersectionObserver | undefined;
let dialogObserver: MutationObserver | undefined;
let sizeObserver: ResizeObserver | undefined;
let themeObserver: MutationObserver | undefined;

const frameOwner = createFrameOwner(
  (callback) => window.requestAnimationFrame(callback),
  (handle) => window.cancelAnimationFrame(handle),
  (timestamp) => drawFrame(timestamp),
);

function motionPaused(): boolean {
  return pauseReasons.size > 0;
}

function gridPaused(): boolean {
  return motionPaused() || prefersReducedMotion || coarsePointer.matches || smallViewport.matches || lanyardPointerDown.size > 0 || lanyardCaptured.size > 0;
}

function syncPauseReasons(reducedOverride?: boolean): void {
  prefersReducedMotion = reducedOverride ?? reducedMotion.matches;
  if (prefersReducedMotion) pauseReasons.add('reduced');
  else pauseReasons.delete('reduced');
  const shouldPause = motionPaused();
  if (shouldPause) {
    if (marqueeAnimation) {
      const time = Number(marqueeAnimation.currentTime ?? 0);
      marqueePhase = marqueeDuration > 0 ? ((time % marqueeDuration) + marqueeDuration) % marqueeDuration / marqueeDuration : 0;
      marqueeAnimation.pause();
    }
    if (marquee) marquee.dataset.static = prefersReducedMotion ? 'true' : 'false';
  } else {
    if (marquee) marquee.dataset.static = 'false';
    if (marqueeAnimation) marqueeAnimation.play();
    else measureMarquee(true);
  }
  targetIntensity = gridPaused() ? 0 : targetIntensity;
  const staticGrid = gridPaused() || !context;
  if (background) background.dataset.gridStatic = String(staticGrid);
  if (staticGrid) clearCanvas();
  else frameOwner.schedule();
}

function measureMarquee(preservePhase = true): void {
  if (!track || groups.length < 2 || prefersReducedMotion) return;
  const width = groups[0]?.getBoundingClientRect().width ?? 0;
  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  const distance = width + gap;
  if (distance <= 0) return;
  const previousDuration = marqueeDuration;
  if (marqueeAnimation && preservePhase) {
    const time = Number(marqueeAnimation.currentTime ?? 0);
    marqueePhase = previousDuration > 0 ? ((time % previousDuration) + previousDuration) % previousDuration / previousDuration : 0;
  }
  const seconds = Math.max(26, distance / 42);
  marqueeDuration = seconds * 1000;
  marqueeAnimation?.cancel();
  marqueeAnimation = track.animate(
    [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(-${distance}px, 0, 0)` }],
    { duration: marqueeDuration, easing: 'linear', iterations: Infinity },
  );
  marqueeAnimation.currentTime = marqueePhase * marqueeDuration;
  if (motionPaused()) marqueeAnimation.pause();
  else marqueeAnimation.play();
}

function refreshBounds(): void {
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  background?.style.setProperty('--about-viewport-width', `${viewportWidth}px`);
  cachedBounds = background?.getBoundingClientRect() ?? about?.getBoundingClientRect();
  if (canvas && cachedBounds) {
    cssWidth = Math.max(0, cachedBounds.width);
    cssHeight = Math.max(0, cachedBounds.height);
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  if (lastPointerClientX !== undefined && lastPointerClientY !== undefined) {
    updatePointerTarget(lastPointerClientX, lastPointerClientY);
  }
  if (!gridPaused()) frameOwner.schedule();
}

function refreshLayout(): void {
  refreshBounds();
  measureMarquee(true);
}

function drawGrid(): void {
  if (!context || cssWidth <= 0 || cssHeight <= 0) return;
  context.clearRect(0, 0, cssWidth, cssHeight);
  context.lineWidth = 1;
  const spacing = 52;
  const radius = 180;
  const maximum = 16;
  const smoothFalloff = (distance: number) => {
    const ratio = Math.max(0, Math.min(1, 1 - distance / radius));
    return ratio * ratio * (3 - 2 * ratio) * intensity;
  };
  const point = (x: number, y: number): [number, number] => {
    const dx = x - pointerX;
    const dy = y - pointerY;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0.001 || distance >= radius) return [x, y];
    const amount = Math.min(maximum, distance * 0.35) * smoothFalloff(distance);
    return [x - (dx / distance) * amount, y - (dy / distance) * amount];
  };
  const drawGridLines = (deformed: boolean) => {
    for (let x = 0; x <= cssWidth; x += spacing) {
      context.beginPath();
      for (let y = 0; y <= cssHeight; y += spacing) {
        const [px, py] = deformed ? point(x, y) : [x, y];
        if (y === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.stroke();
    }
    for (let y = 0; y <= cssHeight; y += spacing) {
      context.beginPath();
      for (let x = 0; x <= cssWidth; x += spacing) {
        const [px, py] = deformed ? point(x, y) : [x, y];
        if (x === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.stroke();
    }
  };
  context.strokeStyle = theme === 'dark' ? 'rgba(163, 171, 180, .18)' : 'rgba(112, 119, 127, .18)';
  drawGridLines(false);
  context.fillStyle = theme === 'dark' ? 'rgba(163, 171, 180, .25)' : 'rgba(112, 119, 127, .22)';
  for (let x = 0; x <= cssWidth; x += spacing) {
    for (let y = 0; y <= cssHeight; y += spacing) {
      context.beginPath();
      context.arc(x, y, 0.8, 0, Math.PI * 2);
      context.fill();
    }
  }

  if (intensity > 0.01) {
    const gradient = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, radius);
    if (theme === 'dark') {
      gradient.addColorStop(0, `rgba(167, 139, 250, ${0.42 * intensity})`);
      gradient.addColorStop(0.55, `rgba(129, 140, 248, ${0.3 * intensity})`);
      gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');
    } else {
      gradient.addColorStop(0, `rgba(79, 70, 229, ${0.36 * intensity})`);
      gradient.addColorStop(0.55, `rgba(99, 102, 241, ${0.24 * intensity})`);
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    }
    context.strokeStyle = gradient;
    drawGridLines(true);

    context.fillStyle = theme === 'dark' ? `rgba(167, 139, 250, ${0.68 * intensity})` : `rgba(79, 70, 229, ${0.62 * intensity})`;
    for (let x = 0; x <= cssWidth; x += spacing) {
      for (let y = 0; y <= cssHeight; y += spacing) {
        const distance = Math.hypot(x - pointerX, y - pointerY);
        if (distance >= radius) continue;
        const [px, py] = point(x, y);
        const weight = smoothFalloff(distance);
        context.globalAlpha = weight;
        context.beginPath();
        context.arc(px, py, 1 + weight * 0.8, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;

    const halo = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 12);
    if (theme === 'dark') {
      halo.addColorStop(0, `rgba(167, 139, 250, ${0.3 * intensity})`);
      halo.addColorStop(1, 'rgba(167, 139, 250, 0)');
    } else {
      halo.addColorStop(0, `rgba(79, 70, 229, ${0.25 * intensity})`);
      halo.addColorStop(1, 'rgba(79, 70, 229, 0)');
    }
    context.fillStyle = halo;
    context.beginPath();
    context.arc(pointerX, pointerY, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = theme === 'dark'
      ? `rgba(167, 139, 250, ${0.95 * intensity})`
      : `rgba(79, 70, 229, ${0.95 * intensity})`;
    context.beginPath();
    context.arc(pointerX, pointerY, 5, 0, Math.PI * 2);
    context.fill();
  }
}

function clearCanvas(): void {
  if (context && cssWidth > 0 && cssHeight > 0) context.clearRect(0, 0, cssWidth, cssHeight);
}

function drawFrame(timestamp: number): void {
  if (gridPaused()) {
    clearCanvas();
    lastFrame = 0;
    return;
  }
  const dt = Math.min(0.05, (timestamp - (lastFrame || timestamp)) / 1000);
  lastFrame = timestamp;
  const follow = 1 - Math.exp(-dt / 0.065);
  pointerX += (targetX - pointerX) * follow;
  pointerY += (targetY - pointerY) * follow;
  intensity += (targetIntensity - intensity) * (1 - Math.exp(-dt / 0.12));
  drawGrid();
  const unsettled = Math.abs(targetX - pointerX) > 0.15 || Math.abs(targetY - pointerY) > 0.15 || Math.abs(targetIntensity - intensity) > 0.002;
  if (unsettled) frameOwner.schedule();
  else lastFrame = 0;
}

function updatePointerTarget(clientX: number, clientY: number): void {
  if (gridPaused() || !cachedBounds) return;
  const x = clientX - cachedBounds.left;
  const y = clientY - cachedBounds.top;
  if (x < 0 || x > cssWidth || y < 0 || y > cssHeight) {
    pointerLeave();
    return;
  }
  targetX = x;
  targetY = y;
  targetIntensity = 1;
  frameOwner.schedule();
}

function pointerMove(event: PointerEvent): void {
  if (event.pointerType === 'touch') return;
  lastPointerClientX = event.clientX;
  lastPointerClientY = event.clientY;
  updatePointerTarget(event.clientX, event.clientY);
}

function pointerLeave(): void {
  targetIntensity = 0;
  if (!gridPaused()) frameOwner.schedule();
}

function lanyardArea(event: Event): Element | null {
  return event.target instanceof Element ? event.target.closest('.lanyard-hit-area') : null;
}

function pointerId(event: Event): number | undefined {
  return 'pointerId' in event && typeof event.pointerId === 'number' ? event.pointerId : undefined;
}

function syncLanyardState(): void {
  const staticGrid = gridPaused() || !context;
  if (background) background.dataset.gridStatic = String(staticGrid);
  if (staticGrid) {
    targetIntensity = 0;
    frameOwner.schedule();
  } else if (lastPointerClientX !== undefined && lastPointerClientY !== undefined) {
    updatePointerTarget(lastPointerClientX, lastPointerClientY);
  }
}

if (about && canvas && marquee && track) {
  if (!context && background) background.dataset.gridUnavailable = 'true';

  aboutObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio > 0) pauseReasons.delete('offscreen');
      else pauseReasons.add('offscreen');
      syncPauseReasons();
    }, { threshold: [0, 0.01] })
    : undefined;
  aboutObserver?.observe(about);
  if (!aboutObserver) pauseReasons.delete('offscreen');
  if (document.hidden) pauseReasons.add('hidden');
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseReasons.add('hidden');
    else pauseReasons.delete('hidden');
    syncPauseReasons();
  }, { signal: abort.signal });
  reducedMotion.addEventListener('change', (event) => syncPauseReasons(event.matches), { signal: abort.signal });
  coarsePointer.addEventListener('change', () => syncPauseReasons(), { signal: abort.signal });
  smallViewport.addEventListener('change', () => syncPauseReasons(), { signal: abort.signal });

  const dialog = document.querySelector<HTMLDialogElement>('#content-dialog');
  const updateDialogReason = () => {
    if (dialog?.open) pauseReasons.add('dialog');
    else pauseReasons.delete('dialog');
    syncPauseReasons();
  };
  if (dialog) {
    dialogObserver = new MutationObserver(updateDialogReason);
    dialogObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', updateDialogReason, { signal: abort.signal });
    dialog.addEventListener('cancel', updateDialogReason, { signal: abort.signal });
  }

  window.addEventListener('pointermove', pointerMove, { passive: true, signal: abort.signal });
  document.addEventListener('pointerdown', (event) => {
    if (!lanyardArea(event)) return;
    const id = pointerId(event);
    if (id !== undefined) lanyardPointerDown.add(id);
    syncLanyardState();
  }, { capture: true, signal: abort.signal });
  document.addEventListener('gotpointercapture', (event) => {
    if (!lanyardArea(event)) return;
    const id = pointerId(event);
    if (id !== undefined) lanyardCaptured.add(id);
    syncLanyardState();
  }, { capture: true, signal: abort.signal });
  const endLanyardPointer = (event: Event) => {
    const id = pointerId(event);
    if (id !== undefined) {
      lanyardPointerDown.delete(id);
      lanyardCaptured.delete(id);
    }
    syncLanyardState();
  };
  document.addEventListener('lostpointercapture', endLanyardPointer, { capture: true, signal: abort.signal });
  document.addEventListener('pointerup', endLanyardPointer, { capture: true, signal: abort.signal });
  document.addEventListener('pointercancel', endLanyardPointer, { capture: true, signal: abort.signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      lanyardPointerDown.clear();
      lanyardCaptured.clear();
      syncLanyardState();
    }
  }, { capture: true, signal: abort.signal });

  const refreshScrollBounds = () => {
    cachedBounds = undefined;
    refreshBounds();
  };
  window.addEventListener('resize', refreshLayout, { passive: true, signal: abort.signal });
  window.addEventListener('scroll', refreshScrollBounds, { passive: true, signal: abort.signal });
  if ('ResizeObserver' in window) {
    sizeObserver = new ResizeObserver(refreshLayout);
    sizeObserver.observe(about);
  }
  document.fonts?.ready.then(() => { if (!abort.signal.aborted) measureMarquee(true); }).catch(() => {});
  themeObserver = new MutationObserver(() => {
    theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    if (!gridPaused()) frameOwner.schedule();
    else clearCanvas();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const dispose = () => {
    aboutObserver?.disconnect();
    dialogObserver?.disconnect();
    sizeObserver?.disconnect();
    themeObserver?.disconnect();
    marqueeAnimation?.cancel();
    frameOwner.cancel();
    abort.abort();
  };
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) {
      pauseReasons.add('bfcache');
      targetIntensity = 0;
      intensity = 0;
      syncPauseReasons();
      frameOwner.cancel();
      return;
    }
    dispose();
  }, { signal: abort.signal });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    pauseReasons.delete('bfcache');
    refreshLayout();
    syncPauseReasons();
  }, { signal: abort.signal });

  refreshLayout();
  if (prefersReducedMotion) pauseReasons.add('reduced');
  syncPauseReasons();
}
