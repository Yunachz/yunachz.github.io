import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldRehangLanyardOnFrameChange, shouldRevealLanyardFrame } from '../src/lib/lanyard-startup-state.mjs';
import { createOnceLedger, headingTiming, headingVisibleCount, isLanyardHandoffEligible, segmentGraphemes } from '../src/lib/v6-entrance-state.mjs';

test('entrance states can be consumed only once', () => {
  const ledger = createOnceLedger(['hero', 'project:sentinel', 'project:sentinel', 'projects']);
  assert.equal(ledger.state('hero'), 'unseen');
  assert.equal(ledger.begin('hero'), true);
  assert.equal(ledger.state('hero'), 'entering');
  assert.equal(ledger.begin('hero'), false);
  ledger.finish('hero');
  assert.equal(ledger.state('hero'), 'done');
  assert.equal(ledger.begin('hero'), false);
  assert.equal(ledger.state('projects'), 'unseen');
  assert.equal(ledger.state('project:sentinel'), 'unseen');
  assert.equal(ledger.begin('project:sentinel'), true);
  assert.equal(ledger.begin('project:sentinel'), false);
});

test('lanyard handoff uses ready state and stable figure visibility, not animated stage opacity', () => {
  assert.equal(isLanyardHandoffEligible('ready', true), true);
  assert.equal(isLanyardHandoffEligible('ready', false), false);
  assert.equal(isLanyardHandoffEligible('loading', true), false);
  assert.equal(isLanyardHandoffEligible('error', true), false);
});

test('lanyard stays on the fallback until its first intro simulation step has rendered', () => {
  const state = {
    imagesReady: true,
    hasRenderedScene: true,
    introPending: false,
    introStarted: true,
    introAdvanced: false,
  };
  assert.equal(shouldRevealLanyardFrame({ ...state, introPending: true }), false);
  assert.equal(shouldRevealLanyardFrame(state), false);
  assert.equal(shouldRevealLanyardFrame({ ...state, introAdvanced: true }), true);
  assert.equal(shouldRevealLanyardFrame({ ...state, introAdvanced: true, hasRenderedScene: false }), false);
  assert.equal(shouldRevealLanyardFrame({ ...state, imagesReady: false, introAdvanced: true }), false);
  assert.equal(shouldRevealLanyardFrame({
    ...state,
    introStarted: true,
    introAdvanced: true,
  }), true, 'a no-intro or reduced-motion scene can reveal its first rendered frame immediately');
});

test('lanyard rehangs after viewport reframing but preserves an active pointer grab', () => {
  assert.equal(shouldRehangLanyardOnFrameChange({ framingChanged: false, placed: true, grabbed: false }), false);
  assert.equal(shouldRehangLanyardOnFrameChange({ framingChanged: true, placed: false, grabbed: false }), false);
  assert.equal(shouldRehangLanyardOnFrameChange({ framingChanged: true, placed: true, grabbed: true }), false);
  assert.equal(shouldRehangLanyardOnFrameChange({ framingChanged: true, placed: true, grabbed: false }), true);
});

test('grapheme segmentation keeps combining marks, emoji modifiers and ZWJ sequences intact', () => {
  assert.deepEqual(segmentGraphemes('a\u0301👩🏽‍💻🇮🇩', 'id'), ['a\u0301', '👩🏽‍💻', '🇮🇩']);
});

test('heading timing stays readable and includes the final grapheme fade', () => {
  assert.deepEqual(headingTiming(0), { interval: 0, duration: 0 });
  assert.deepEqual(headingTiming(1), { interval: 0, duration: 120 });
  assert.equal(headingTiming(14).duration, 560);
  assert.equal(headingTiming(20, true).duration, 800);
  assert.equal(headingTiming(40).duration, 1000);
  assert.equal(headingTiming(20).interval * 19 + 120, headingTiming(20).duration);
});

test('heading reveal count grows monotonically, preserves the first grapheme, and finishes at every text length', () => {
  for (const count of [1, 2, 14, 20, 40]) {
    const timing = headingTiming(count, count === 20);
    const elapsed = [...new Set([0, 8, timing.interval, timing.interval * 2, timing.duration / 2, timing.duration, timing.duration + 100])]
      .sort((left, right) => left - right);
    const progress = elapsed.map((time) => headingVisibleCount(time, timing.interval, count));
    assert.equal(progress[0], 1);
    assert.deepEqual(progress, [...progress].sort((left, right) => left - right));
    assert.equal(progress.at(-1), count);
  }
  assert.equal(headingVisibleCount(0, 0, 0), 0);
});
