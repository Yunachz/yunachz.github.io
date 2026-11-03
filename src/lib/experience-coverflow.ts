export type CoverflowPose = {
  xFraction: number;
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

export function normalizeCoverflowPosition(position: number, count: number): number {
  return count > 0 ? ((position % count) + count) % count : 0;
}

export function wrapCoverflowOffset(index: number, position: number, count: number): number {
  if (count < 1) return 0;
  let offset = ((index - position + count / 2) % count + count) % count - count / 2;
  if (offset === -count / 2 && index - position > 0) offset = count / 2;
  return offset;
}

export function coverflowPositionFromDrag(startPosition: number, deltaX: number, pitch: number): number {
  if (!Number.isFinite(pitch) || pitch <= 0) return startPosition;
  return startPosition - deltaX / pitch;
}

export function nearestCoverflowTarget(position: number): number {
  return Math.round(position);
}

export function coverflowPose(offset: number): CoverflowPose {
  const distance = Math.abs(offset);
  let z: number;
  let scale: number;
  let opacity: number;
  if (distance <= 1) {
    z = -60 * distance;
    scale = 1 - 0.16 * distance;
    opacity = 1 - 0.28 * distance;
  } else if (distance <= 2) {
    const progress = distance - 1;
    z = -60 - 60 * progress;
    scale = 0.84 - 0.16 * progress;
    opacity = 0.72 - 0.42 * progress;
  } else {
    z = -120;
    scale = 0.68;
    opacity = 0;
  }
  return {
    xFraction: offset * 0.62,
    z,
    scale,
    opacity,
    zIndex: Math.round(10 - distance * 2),
  };
}
