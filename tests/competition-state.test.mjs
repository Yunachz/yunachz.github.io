import test from 'node:test';
import assert from 'node:assert/strict';
import { easeDeckProgress, interpolatePhotoDeckPose, isCurrentDeckGeneration, photoDeckRestPose, retargetPhotoDeck, settlePhotoDeck, transitionProgress, wrapPhotoIndex } from '../src/lib/competition-state.mjs';

test('photo decks wrap 1 → 2 → 3 → 1 and keep previous navigation symmetric', () => {
  assert.equal(wrapPhotoIndex(0, 3), 0);
  assert.equal(wrapPhotoIndex(3, 3), 0);
  assert.equal(wrapPhotoIndex(-1, 3), 2);
  assert.equal(wrapPhotoIndex(8, 0), 0);
  assert.deepEqual(
    [1, 1, 1].reduce((state) => retargetPhotoDeck(state, 1, 3), { selectedIndex: 0, targetIndex: 0, generation: 0 }),
    { selectedIndex: 0, targetIndex: 0, generation: 3 },
  );
});

test('rapid clicks retarget from the latest logical target and invalidate stale generations', () => {
  const first = retargetPhotoDeck({ selectedIndex: 0, targetIndex: 0, generation: 4 }, 1, 3);
  const second = retargetPhotoDeck(first, 1, 3);
  const third = retargetPhotoDeck(second, -1, 3);
  assert.equal(third.targetIndex, 1);
  assert.equal(third.generation, 7);
  assert.equal(isCurrentDeckGeneration(third.generation, first.generation), false);
  assert.equal(isCurrentDeckGeneration(third.generation, third.generation), true);
});

test('finite shuffle progress clamps at both ends', () => {
  assert.equal(transitionProgress(80, 100, 140), 0);
  assert.equal(transitionProgress(170, 100, 140), 0.5);
  assert.equal(transitionProgress(300, 100, 140), 1);
  assert.equal(transitionProgress(200, 100, 0), 1);
});

test('photo deck rests as a three-card stack with smaller mobile poses and alternating editorial tilt', () => {
  assert.deepEqual(photoDeckRestPose(0), { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
  assert.deepEqual(photoDeckRestPose(1), { x: 12, y: -6, rotate: 3.5, scale: 0.97, opacity: 0.9 });
  assert.deepEqual(photoDeckRestPose(2), { x: -10, y: 8, rotate: -4.5, scale: 0.94, opacity: 0.76 });
  assert.deepEqual(photoDeckRestPose(1, true), { x: 6, y: -3, rotate: 2.2, scale: 0.98, opacity: 0.9 });
  assert.equal(photoDeckRestPose(2, false, true).rotate, 4.5);
  assert.equal(photoDeckRestPose(1, true, true).rotate, -2.2);
});

test('photo deck easing and pose interpolation settle at the requested endpoint', () => {
  assert.equal(easeDeckProgress(0), 0);
  assert.equal(easeDeckProgress(1), 1);
  assert(easeDeckProgress(0.5) > 0.5, 'settle easing should advance the card toward its resting pose');
  assert.equal(easeDeckProgress(-1), 0);
  assert.equal(easeDeckProgress(2), 1);
  assert.deepEqual(
    interpolatePhotoDeckPose({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }, { x: 20, y: -10, rotate: 10, scale: 0.9, opacity: 0.8 }, 0.5),
    { x: 10, y: -5, rotate: 5, scale: 0.95, opacity: 0.9 },
  );
});

test('cancellation settles the latest requested photo and advances the generation', () => {
  const moving = retargetPhotoDeck({ selectedIndex: 0, targetIndex: 0, generation: 8, phase: 'out', startedAt: 120 }, 1, 3);
  const settled = settlePhotoDeck(moving, 3);
  assert.equal(settled.selectedIndex, 1);
  assert.equal(settled.targetIndex, 1);
  assert.equal(settled.generation, 10);
  assert.equal(settled.phase, 'idle');
  assert.equal(settled.startedAt, undefined);
  assert.equal(isCurrentDeckGeneration(settled.generation, moving.generation), false);
});
