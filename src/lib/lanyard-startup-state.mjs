export function shouldRevealLanyardFrame({
  imagesReady,
  hasRenderedScene,
  introPending,
  introStarted,
  introAdvanced,
}) {
  return Boolean(
    imagesReady
    && hasRenderedScene
    && !introPending
    && introStarted
    && introAdvanced
  );
}

export function shouldRehangLanyardOnFrameChange({ framingChanged, placed, grabbed }) {
  return Boolean(framingChanged && placed && !grabbed);
}
