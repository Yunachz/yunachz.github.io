export type ProjectTransition = {
  from: number;
  to: number;
  started: number;
  duration: number;
};

export type ProjectMotionState = {
  phase: number;
  previousFrame: number;
  userPaused: boolean;
  pauseReasons: Set<string>;
  transition: ProjectTransition | undefined;
};

export const PROJECT_SPEED_PX_PER_MS = 0.088;

export function createProjectMotionState(): ProjectMotionState {
  return {
    phase: 0,
    previousFrame: 0,
    userPaused: false,
    pauseReasons: new Set(),
    transition: undefined,
  };
}

export function positiveModulo(value: number, modulus: number): number {
  return modulus > 0 ? ((value % modulus) + modulus) % modulus : 0;
}

export function getProjectIndex(phase: number, step: number, count: number): number {
  if (count < 1 || step <= 0) return 0;
  return positiveModulo(Math.round(phase / step), count);
}

export function toggleProjectPaused(state: ProjectMotionState): boolean {
  state.userPaused = !state.userPaused;
  state.previousFrame = 0;
  return state.userPaused;
}

export function setProjectPauseReason(state: ProjectMotionState, reason: string, paused: boolean): void {
  const changed = paused ? !state.pauseReasons.has(reason) : state.pauseReasons.has(reason);
  if (!changed) return;
  if (paused) state.pauseReasons.add(reason);
  else state.pauseReasons.delete(reason);
  state.previousFrame = 0;
}

export function isProjectMotionAllowed(
  state: ProjectMotionState,
  count: number,
  reducedMotion: boolean,
  hasStage: boolean,
): boolean {
  return hasStage
    && count > 3
    && !state.userPaused
    && !reducedMotion
    && state.pauseReasons.size === 0;
}

export function beginProjectTransition(
  state: ProjectMotionState,
  direction: number,
  step: number,
  started: number,
  duration = 440,
): void {
  if (step <= 0 || direction === 0) return;
  state.transition = {
    from: state.phase,
    to: state.phase + direction * step,
    started,
    duration,
  };
  state.previousFrame = 0;
}

export function scaleProjectMotion(state: ProjectMotionState, ratio: number): void {
  if (!Number.isFinite(ratio) || ratio <= 0) return;
  state.phase *= ratio;
  if (state.transition) {
    state.transition.from *= ratio;
    state.transition.to *= ratio;
  }
}

export function mapProjectMotionToSelection(state: ProjectMotionState, index: number, step: number): void {
  state.phase = Math.max(0, index) * step;
  state.transition = undefined;
  state.previousFrame = 0;
}

export function tickProjectMotion(
  state: ProjectMotionState,
  timestamp: number,
  cycle: number,
  automaticMotionAllowed: boolean,
): void {
  const elapsed = state.previousFrame
    ? Math.max(0, Math.min(48, timestamp - state.previousFrame))
    : 0;
  state.previousFrame = timestamp;

  const transition = state.transition;
  if (transition) {
    const progress = Math.min(1, Math.max(0, (timestamp - transition.started) / transition.duration));
    const eased = 1 - Math.pow(1 - progress, 3);
    state.phase = transition.from + (transition.to - transition.from) * eased;
    if (progress >= 1) {
      state.phase = transition.to;
      state.transition = undefined;
    }
  } else if (automaticMotionAllowed) {
    state.phase += elapsed * PROJECT_SPEED_PX_PER_MS;
  }

  if (!state.transition && cycle > 0) state.phase = positiveModulo(state.phase, cycle);
}

export function resetProjectMotionClock(state: ProjectMotionState): void {
  state.previousFrame = 0;
}
