import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ambientGradientWeights,
  ambientOrbPositions,
  clampScrollProgress,
} from '../src/lib/ambient-gradient.ts';
import {
  coverflowPose,
  coverflowPositionFromDrag,
  nearestCoverflowTarget,
  normalizeCoverflowPosition,
  wrapCoverflowOffset,
} from '../src/lib/experience-coverflow.ts';
import {
  beginProjectTransition,
  createProjectMotionState,
  getProjectIndex,
  isProjectMotionAllowed,
  mapProjectMotionToSelection,
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
