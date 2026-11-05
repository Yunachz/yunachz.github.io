import { useCallback, useEffect, useRef, useState } from 'react';

export default function AboutLanyard({ frontImage, backImage, strapImage, settings }) {
  const hostRef = useRef(null);
  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const timeoutRef = useRef();
  const hasStartedRef = useRef(false);
  const [Lanyard, setLanyard] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [intro, setIntro] = useState(true);
  const [status, setStatus] = useState('idle');
  const [sceneSize, setSceneSize] = useState(settings?.size ?? 0.44);
  const [strapLength, setStrapLength] = useState(settings?.strapLength ?? 0.4);

  const publish = useCallback((nextStatus) => {
    if (!mountedRef.current) return;
    if (nextStatus === 'ready' || nextStatus === 'error' || nextStatus === 'reduced') {
      window.clearTimeout(timeoutRef.current);
    }
    if (nextStatus === 'error' || nextStatus === 'reduced') generationRef.current += 1;
    const figure = hostRef.current?.closest('figure.hero-portrait');
    if (figure) {
      figure.dataset.lanyardState = nextStatus;
      figure.dispatchEvent(new CustomEvent('v6:lanyard-statechange', {
        bubbles: true,
        detail: { status: nextStatus },
      }));
    }
    setStatus(nextStatus);
    if (nextStatus === 'error' || nextStatus === 'reduced') {
      setEnabled(false);
      setLanyard(null);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let active = true;
    let importDelayTimer;
    let idleFallbackTimer;
    let idleCallback;

    const cancelScheduledImport = () => {
      window.clearTimeout(importDelayTimer);
      window.clearTimeout(idleFallbackTimer);
      if (idleCallback !== undefined) window.cancelIdleCallback?.(idleCallback);
      importDelayTimer = undefined;
      idleFallbackTimer = undefined;
      idleCallback = undefined;
    };

    const updateSceneSize = () => {
      const width = window.innerWidth;
      const height = Math.max(1, hostRef.current?.clientHeight ?? window.innerHeight);
      const targetHeight = width <= 768
        ? Math.min(180, Math.max(140, width * 0.45))
        : width <= 960
          ? Math.min(280, Math.max(240, width * 0.35))
          : Math.min(430, Math.max(360, width * 0.3));
      const nextSize = Math.max(0.15, Math.min(settings?.size ?? 0.44, targetHeight / height));
      const cardHeight = nextSize * height;
      const targetTop = width <= 768
        ? Math.min(126, Math.max(90, cardHeight * 0.68))
        : width <= 960
          ? cardHeight * 0.43
          : cardHeight * 0.24;
      const framingMix = Math.min(0.42, Math.max(0.12, targetTop / height));
      const nextStrapLength = (framingMix - 0.12) / 0.3;
      setSceneSize((current) => Math.abs(current - nextSize) < 0.002 ? current : nextSize);
      setStrapLength((current) => Math.abs(current - nextStrapLength) < 0.002 ? current : nextStrapLength);
    };

    updateSceneSize();
    const resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(updateSceneSize)
      : undefined;
    if (hostRef.current) resizeObserver?.observe(hostRef.current);
    window.addEventListener('resize', updateSceneSize, { passive: true });

    const updateMotionPreference = () => {
      const generation = ++generationRef.current;
      cancelScheduledImport();
      if (!motionPreference || motionPreference.matches) {
        hasStartedRef.current = true;
        publish('reduced');
        return;
      }

      publish('loading');
      setEnabled(true);
      setIntro(!hasStartedRef.current);
      hasStartedRef.current = true;
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        if (active && generationRef.current === generation) publish('error');
      }, 12000);

      const loadLanyard = () => {
        if (!active || generationRef.current !== generation || motionPreference.matches) return;
        import('./lanyard/Lanyard.jsx')
          .then((module) => {
            if (active && generationRef.current === generation && !motionPreference.matches) {
              setLanyard(() => module.default);
            }
          })
          .catch(() => {
            if (active && generationRef.current === generation) publish('error');
          });
      };
      importDelayTimer = window.setTimeout(() => {
        importDelayTimer = undefined;
        if (typeof window.requestIdleCallback === 'function') {
          idleCallback = window.requestIdleCallback(() => {
            idleCallback = undefined;
            loadLanyard();
          }, { timeout: 1200 });
        } else {
          idleFallbackTimer = window.setTimeout(loadLanyard, 0);
        }
      }, 620);
    };

    updateMotionPreference();
    if (motionPreference?.addEventListener) motionPreference.addEventListener('change', updateMotionPreference);
    else motionPreference?.addListener?.(updateMotionPreference);

    return () => {
      active = false;
      mountedRef.current = false;
      generationRef.current += 1;
      cancelScheduledImport();
      window.clearTimeout(timeoutRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateSceneSize);
      if (motionPreference?.removeEventListener) motionPreference.removeEventListener('change', updateMotionPreference);
      else motionPreference?.removeListener?.(updateMotionPreference);
      const figure = hostRef.current?.closest('figure.hero-portrait');
      if (figure) figure.dataset.lanyardState = 'fallback';
    };
  }, [publish]);

  const reportCanvasStatus = useCallback((nextStatus) => {
    publish(nextStatus);
  }, [publish]);

  return (
    <div ref={hostRef} className="about-lanyard" data-status={status}>
      {enabled && Lanyard ? (
        <Lanyard
          {...settings}
          size={sceneSize}
          strapLength={strapLength}
          frontImage={frontImage}
          backImage={backImage}
          strapImage={strapImage}
          intro={intro}
          onStatus={reportCanvasStatus}
          className="about-lanyard__scene"
        />
      ) : null}
    </div>
  );
}
