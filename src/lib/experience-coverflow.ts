export type CoverflowPose = {
  xFraction: number;
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

export type CoverflowTransition = {
  from: number;
  to: number;
  started: number;
  duration: number;
};

export type CoverflowMotion = {
  position: number;
  transition: CoverflowTransition | undefined;
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

export function sampleCoverflowTransition(
  position: number,
  transition: CoverflowTransition | undefined,
  timestamp: number,
): CoverflowMotion {
  if (!transition) return { position, transition: undefined };
  const duration = Math.max(1, transition.duration);
  const progress = Math.min(1, Math.max(0, (timestamp - transition.started) / duration));
  const eased = 1 - Math.pow(1 - progress, 3);
  if (progress >= 1) return { position: transition.to, transition: undefined };
  return {
    position: transition.from + (transition.to - transition.from) * eased,
    transition,
  };
}

export function retargetCoverflowTransition(
  position: number,
  transition: CoverflowTransition | undefined,
  targetIndex: number,
  count: number,
  timestamp: number,
  duration = 360,
): CoverflowMotion {
  if (count < 1) return { position: 0, transition: undefined };
  const sampled = sampleCoverflowTransition(position, transition, timestamp);
  if (count === 1) return { position: 0, transition: undefined };
  const normalized = normalizeCoverflowPosition(targetIndex, count);
  const unroundedTarget = sampled.position + wrapCoverflowOffset(normalized, sampled.position, count);
  const nearestInteger = Math.round(unroundedTarget);
  const target = Math.abs(unroundedTarget - nearestInteger) < 1e-9 ? nearestInteger : unroundedTarget;
  if (Math.abs(target - sampled.position) < 1e-6 || duration <= 0) {
    return { position: target, transition: undefined };
  }
  return {
    position: sampled.position,
    transition: { from: sampled.position, to: target, started: timestamp, duration },
  };
}

export function settleCoverflowAfterPendingInput(
  position: number,
  transition: CoverflowTransition | undefined,
  timestamp: number,
  count: number,
  duration = 360,
): CoverflowMotion {
  const sampled = sampleCoverflowTransition(position, transition, timestamp);
  if (sampled.transition || count < 2) return sampled;
  return retargetCoverflowTransition(
    sampled.position,
    undefined,
    nearestCoverflowTarget(sampled.position),
    count,
    timestamp,
    duration,
  );
}

export function classifyCoverflowGesture(deltaX: number, deltaY: number, threshold = 6): 'pending' | 'horizontal' | 'vertical' {
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) <= threshold) return 'pending';
  return Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
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
