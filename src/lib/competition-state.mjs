export function wrapPhotoIndex(index, count) {
  if (!Number.isInteger(count) || count < 1) return 0;
  const value = Number.isFinite(index) ? Math.trunc(index) : 0;
  return ((value % count) + count) % count;
}

export function retargetPhotoDeck(state, direction, count) {
  const base = Number.isInteger(state.targetIndex) ? state.targetIndex : state.selectedIndex;
  return {
    ...state,
    targetIndex: wrapPhotoIndex(base + (direction < 0 ? -1 : 1), count),
    generation: (Number.isInteger(state.generation) ? state.generation : 0) + 1,
  };
}

export function settlePhotoDeck(state, count) {
  const selectedIndex = wrapPhotoIndex(state.targetIndex ?? state.selectedIndex, count);
  return {
    ...state,
    selectedIndex,
    targetIndex: selectedIndex,
    generation: (Number.isInteger(state.generation) ? state.generation : 0) + 1,
    phase: 'idle',
    startedAt: undefined,
  };
}

export function isCurrentDeckGeneration(currentGeneration, candidateGeneration) {
  return currentGeneration === candidateGeneration;
}

export function transitionProgress(timestamp, startedAt, duration) {
  if (!Number.isFinite(timestamp) || !Number.isFinite(startedAt) || !Number.isFinite(duration) || duration <= 0) return 1;
  return Math.max(0, Math.min(1, (timestamp - startedAt) / duration));
}

const desktopPhotoPoses = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 12, y: -6, rotate: 3.5, scale: 0.97, opacity: 0.9 },
  { x: -10, y: 8, rotate: -4.5, scale: 0.94, opacity: 0.76 },
];

const compactPhotoPoses = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 6, y: -3, rotate: 2.2, scale: 0.98, opacity: 0.9 },
  { x: -5, y: 4, rotate: -2.8, scale: 0.96, opacity: 0.76 },
];

export function photoDeckRestPose(rank, compact = false, alternate = false) {
  const poses = compact ? compactPhotoPoses : desktopPhotoPoses;
  const index = Math.max(0, Math.min(poses.length - 1, Number.isFinite(rank) ? Math.trunc(rank) : 0));
  const pose = poses[index];
  return { ...pose, rotate: pose.rotate * (alternate ? -1 : 1) };
}

export function easeDeckProgress(progress) {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 1;
  return 1 - Math.pow(1 - value, 3);
}

export function interpolatePhotoDeckPose(from, to, progress) {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 1;
  return {
    x: from.x + (to.x - from.x) * value,
    y: from.y + (to.y - from.y) * value,
    rotate: from.rotate + (to.rotate - from.rotate) * value,
    scale: from.scale + (to.scale - from.scale) * value,
    opacity: from.opacity + (to.opacity - from.opacity) * value,
  };
}
