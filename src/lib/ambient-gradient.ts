export type AmbientGradientWeights = {
  top: number;
  middle: number;
  bottom: number;
};

export type AmbientOrbPosition = {
  x: number;
  y: number;
};

export function clampScrollProgress(progress: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
}

export function ambientGradientWeights(progress: number): AmbientGradientWeights {
  const normalized = clampScrollProgress(progress);
  return {
    top: Math.max(0, 1 - normalized * 2),
    middle: Math.max(0, 1 - Math.abs(normalized - 0.5) * 2),
    bottom: Math.max(0, (normalized - 0.5) * 2),
  };
}

export function ambientOrbPositions(progress: number): { first: AmbientOrbPosition; second: AmbientOrbPosition } {
  const normalized = clampScrollProgress(progress);
  const bend = Math.sin(Math.PI * normalized);
  return {
    first: { x: 18 + 14 * bend, y: 20 + 60 * normalized },
    second: { x: 82 - 16 * bend, y: 24 + 55 * normalized },
  };
}
