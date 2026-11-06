import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ambientGradientWeights,
  ambientOrbPositions,
  clampScrollProgress,
} from '../src/lib/ambient-gradient.ts';
import {
  classifyCoverflowGesture,
  coverflowPose,
  coverflowPositionFromDrag,
  nearestCoverflowTarget,
  normalizeCoverflowPosition,
  retargetCoverflowTransition,
  sampleCoverflowTransition,
  settleCoverflowAfterPendingInput,
  wrapCoverflowOffset,
} from '../src/lib/experience-coverflow.ts';
import { updateExperienceCaptionState } from '../src/lib/experience-caption-state.mjs';
import { createFrameOwner } from '../src/lib/raf-owner.ts';
import {
  beginProjectTransition,
  createProjectMotionState,
  getProjectIndex,
  isProjectMotionAllowed,
  mapProjectMotionToSelection,
  PROJECT_SPEED_PX_PER_MS,
  scaleProjectMotion,
  setProjectPauseReason,
  tickProjectMotion,
  toggleProjectPaused,
} from '../src/lib/project-motion.ts';
import {
  resolveSkillSelection,
  toggleTouchSkillSelection,
} from '../src/lib/skills-state.ts';
import { loadV3Content } from '../scripts/v3-content-validation.mjs';

test('rapid project toggle parity never reconstructs phase from a rounded card index', () => {
  for (const count of [1, 2, 9, 10]) {
    const state = createProjectMotionState();
    state.phase = 404 * 1.75;
    const phase = state.phase;
    for (let click = 0; click < count; click += 1) toggleProjectPaused(state);
    assert.equal(state.phase, phase);
    assert.equal(state.userPaused, count % 2 === 1);
    assert.equal(getProjectIndex(state.phase, 404, 5), 2);
  }
});

test('project motion resets its monotonic clock after suspension and keeps manual arrow intent', () => {
  const state = createProjectMotionState();
  state.phase = 200;
  setProjectPauseReason(state, 'offscreen', true);
  tickProjectMotion(state, 1000, 2020, isProjectMotionAllowed(state, 5, false, true));
  setProjectPauseReason(state, 'offscreen', false);
  tickProjectMotion(state, 31000, 2020, isProjectMotionAllowed(state, 5, false, true));
  assert.equal(state.phase, 200);
  tickProjectMotion(state, 31016, 2020, isProjectMotionAllowed(state, 5, false, true));
  assert.ok(state.phase > 200 && state.phase < 202);

  beginProjectTransition(state, 1, 404, 31016);
  toggleProjectPaused(state);
  tickProjectMotion(state, 31236, 2020, isProjectMotionAllowed(state, 5, false, true));
  assert.ok(state.phase > 400);
  assert.ok(state.transition);
  assert.ok(state.phase > 550 && state.phase < 560);
  tickProjectMotion(state, 31456, 2020, isProjectMotionAllowed(state, 5, false, true));
  assert.equal(state.transition, undefined);
  assert.ok(Math.abs(state.phase - 605.408) < 0.01);
});

test('project autoplay keeps 88px/s phase when temporary blockers clear and user pause remains explicit', () => {
  const state = createProjectMotionState();
  const allowed = () => isProjectMotionAllowed(state, 5, false, true);
  assert.equal(PROJECT_SPEED_PX_PER_MS, 0.088);
  tickProjectMotion(state, 1000, 2020, allowed());
  tickProjectMotion(state, 1016, 2020, allowed());
  assert.ok(Math.abs(state.phase - 1.408) < 1e-9);

  setProjectPauseReason(state, 'drag', true);
  setProjectPauseReason(state, 'dialog', true);
  tickProjectMotion(state, 1100, 2020, allowed());
  const blockedPhase = state.phase;
  setProjectPauseReason(state, 'drag', false);
  tickProjectMotion(state, 1200, 2020, allowed());
  assert.equal(state.phase, blockedPhase);
  setProjectPauseReason(state, 'dialog', false);
  tickProjectMotion(state, 1300, 2020, allowed());
  assert.equal(state.phase, blockedPhase);
  tickProjectMotion(state, 1316, 2020, allowed());
  assert.ok(Math.abs(state.phase - (blockedPhase + 1.408)) < 1e-9);

  state.userPaused = true;
  tickProjectMotion(state, 1400, 2020, allowed());
  setProjectPauseReason(state, 'drag', true);
  setProjectPauseReason(state, 'drag', false);
  tickProjectMotion(state, 1416, 2020, allowed());
  assert.ok(Math.abs(state.phase - (blockedPhase + 1.408)) < 1e-9);
});

test('project resize preserves fractional phase and filter selection resets only by choice', () => {
  const state = createProjectMotionState();
  state.phase = 404 * 2.75;
  const ratio = 460 / 404;
  scaleProjectMotion(state, ratio);
  assert.ok(Math.abs(state.phase / 460 - 2.75) < 1e-9);
  mapProjectMotionToSelection(state, 3, 460);
  assert.equal(state.phase, 1380);
  assert.equal(state.transition, undefined);
});

test('experience drag follows the held pointer one-to-one and settles to the nearest wrapped item', () => {
  const start = 0.25;
  const pitch = 280;
  const afterLeftDrag = coverflowPositionFromDrag(start, -84, pitch);
  const afterReverse = coverflowPositionFromDrag(start, -84 + 56, pitch);
  assert.equal(afterLeftDrag, 0.55);
  assert.equal(afterReverse, 0.35);
  assert.equal(nearestCoverflowTarget(afterLeftDrag), 1);
  assert.equal(nearestCoverflowTarget(afterReverse), 0);
  assert.equal(normalizeCoverflowPosition(-1, 9), 8);
  assert.equal(wrapCoverflowOffset(8, 0, 9), -1);
  assert.equal(wrapCoverflowOffset(1, 0, 9), 1);
  assert.equal(wrapCoverflowOffset(2, 0.5, 9), 1.5);

  const halfway = coverflowPose(0.5);
  assert.equal(halfway.xFraction, 0.31);
  assert.ok(halfway.scale < 1 && halfway.scale > 0.84);
  assert.ok(halfway.opacity < 1 && halfway.opacity > 0.72);
});

test('pending gallery presses preserve settle ownership and semantic retargets reach an integer', () => {
  let motion = retargetCoverflowTransition(0, undefined, 1, 9, 0);
  const firstSettle = motion.transition;
  assert.ok(firstSettle);

  motion = settleCoverflowAfterPendingInput(motion.position, motion.transition, 70, 9);
  assert.equal(motion.transition, firstSettle);
  assert.ok(motion.position > 0 && motion.position < 1);

  motion = settleCoverflowAfterPendingInput(motion.position, motion.transition, 110, 9);
  assert.equal(motion.transition, firstSettle);
  motion = retargetCoverflowTransition(motion.position, motion.transition, 1, 9, 120);
  assert.ok(motion.transition);
  motion = sampleCoverflowTransition(motion.position, motion.transition, 480);
  assert.equal(motion.position, 1);
  assert.equal(motion.transition, undefined);

  motion = retargetCoverflowTransition(motion.position, motion.transition, 0, 9, 500);
  motion = sampleCoverflowTransition(motion.position, motion.transition, 860);
  assert.equal(motion.position, 0);
  assert.equal(motion.transition, undefined);
});

test('gallery gesture ownership waits for horizontal intent and preserves vertical scrolling', () => {
  assert.equal(classifyCoverflowGesture(4, 2), 'pending');
  assert.equal(classifyCoverflowGesture(12, 2), 'horizontal');
  assert.equal(classifyCoverflowGesture(2, 12), 'vertical');
});

test('only the leaving active caption finishes its entrance and every other copy is hidden', () => {
  const makeCopy = (active, state, id) => {
    const attributes = {};
    return {
      hidden: false,
      inert: false,
      dataset: { active: String(active), v6State: state, v6Enter: id },
      setAttribute: (name, value) => { attributes[name] = value; },
      attributes,
    };
  };
  const previous = makeCopy(true, 'entering', 'experience-copy:previous');
  const next = makeCopy(false, 'unseen', 'experience-copy:next');
  const untouched = makeCopy(false, 'unseen', 'experience-copy:untouched');
  const copies = [previous, next, untouched];
  const finished = [];

  updateExperienceCaptionState(copies, 1, (id) => {
    finished.push(id);
    const copy = copies.find((candidate) => candidate.dataset.v6Enter === id);
    copy.dataset.v6State = 'done';
  });

  assert.deepEqual(finished, ['experience-copy:previous']);
  assert.equal(previous.hidden, true);
  assert.equal(previous.inert, true);
  assert.equal(previous.attributes['aria-hidden'], 'true');
  assert.equal(previous.dataset.v6State, 'done');
  assert.equal(next.hidden, false);
  assert.equal(next.inert, false);
  assert.equal(next.attributes['aria-hidden'], 'false');
  assert.equal(untouched.hidden, true);
  assert.equal(untouched.dataset.v6State, 'unseen');
  assert.equal(copies.filter((copy) => !copy.hidden).length, 1);
});

test('frame owner ignores a cancelled callback after a newer motion owns the frame', () => {
  const callbacks = [];
  const cancelled = [];
  const ran = [];
  const owner = createFrameOwner(
    (callback) => { callbacks.push(callback); return callbacks.length; },
    (handle) => cancelled.push(handle),
    (timestamp) => ran.push(timestamp),
  );

  owner.schedule();
  owner.schedule();
  assert.equal(callbacks.length, 1);
  const stale = callbacks[0];
  owner.cancel();
  owner.schedule();
  const current = callbacks[1];
  stale(10);
  assert.equal(owner.pending(), true);
  assert.deepEqual(ran, []);
  current(20);
  assert.equal(owner.pending(), false);
  assert.deepEqual(ran, [20]);
  assert.deepEqual(cancelled, [1]);
});

test('skills select by keyboard focus, touch state, then hover and touch can collapse', () => {
  assert.equal(resolveSkillSelection({ keyboardFocusId: null, touchSelectionId: null, pointerHoverId: null }), null);
  assert.equal(resolveSkillSelection({ keyboardFocusId: null, touchSelectionId: null, pointerHoverId: 'python' }), 'python');
  assert.equal(resolveSkillSelection({ keyboardFocusId: null, touchSelectionId: 'plc', pointerHoverId: 'python' }), 'plc');
  assert.equal(resolveSkillSelection({ keyboardFocusId: 'circuit-analysis', touchSelectionId: 'plc', pointerHoverId: 'python' }), 'circuit-analysis');
  assert.equal(toggleTouchSkillSelection(null, 'python'), 'python');
  assert.equal(toggleTouchSkillSelection('python', 'python'), null);
});

test('ambient scroll interpolation is continuous at page top, midpoint, and bottom', () => {
  assert.equal(clampScrollProgress(-0.2), 0);
  assert.equal(clampScrollProgress(1.2), 1);
  assert.deepEqual(ambientGradientWeights(0), { top: 1, middle: 0, bottom: 0 });
  assert.deepEqual(ambientGradientWeights(0.5), { top: 0, middle: 1, bottom: 0 });
  assert.deepEqual(ambientGradientWeights(1), { top: 0, middle: 0, bottom: 1 });
  assert.deepEqual(ambientGradientWeights(0.25), { top: 0.5, middle: 0.5, bottom: 0 });
  assert.deepEqual(ambientGradientWeights(0.75), { top: 0, middle: 0.5, bottom: 0.5 });
  assert.deepEqual(ambientOrbPositions(0), { first: { x: 18, y: 20 }, second: { x: 82, y: 24 } });
  assert.deepEqual(ambientOrbPositions(1), { first: { x: 18, y: 80 }, second: { x: 82, y: 79 } });
});

test('sample records carry no credential claims and UPN program remains without duplicate summary', async () => {
  const source = await loadV3Content(process.cwd());
  const sampleFields = new Set(['sample', 'media', 'order', 'draft']);
  for (const { data } of source.credentialSamples) {
    assert.equal(data.sample, true);
    assert.deepEqual(Object.keys(data).sort(), [...sampleFields].sort());
  }
  const upnvj = source.education.find(({ id }) => id === 'upnvj')?.data;
  assert.equal(upnvj?.copy.id.program, 'S1 Teknik Elektro');
  assert.equal(upnvj?.copy.en.program, 'Undergraduate Electrical Engineering');
  assert.equal(upnvj?.copy.id.summary, undefined);
  assert.equal(upnvj?.copy.en.summary, undefined);
});

test('four capability groups map each canonical skill once and expose only localized grounded chips', async () => {
  const source = await loadV3Content(process.cwd());
  const groups = source.skillGroups.filter(({ data }) => data.draft === false);
  const skills = source.skills.filter(({ data }) => data.draft === false);
  const mapped = groups.flatMap(({ data }) => data.skillIds);
  assert.equal(groups.length, 4);
  assert.equal(skills.length, 10);
  assert.deepEqual(new Set(mapped), new Set(skills.map(({ id }) => id)));
  assert.equal(mapped.length, new Set(mapped).size);
  for (const { data } of groups) {
    for (const locale of ['id', 'en']) {
      assert.ok(data.copy[locale].title.trim());
      assert.ok(data.copy[locale].summary.trim());
    }
    assert.ok(data.chips.length > 0);
    for (const chip of data.chips) {
      assert.ok(chip.label.id.trim());
      assert.ok(chip.label.en.trim());
      assert.ok(chip.skillIds.every((id) => data.skillIds.includes(id)));
    }
  }
});
