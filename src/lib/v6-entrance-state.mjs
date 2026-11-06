const markPattern = /\p{Mark}/u;
const variationPattern = /[\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/u;
const modifierPattern = /[\u{1F3FB}-\u{1F3FF}]/u;
const regionalPattern = /[\u{1F1E6}-\u{1F1FF}]/u;

export function segmentGraphemes(value, locale = 'en') {
  const text = String(value);
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(text), ({ segment }) => segment);
  }

  const points = Array.from(text);
  const graphemes = [];
  for (let index = 0; index < points.length; index += 1) {
    let cluster = points[index];
    if (regionalPattern.test(points[index]) && regionalPattern.test(points[index + 1] ?? '')) {
      cluster += points[++index];
    }
    while (index + 1 < points.length) {
      const next = points[index + 1];
      if (markPattern.test(next) || variationPattern.test(next) || modifierPattern.test(next)) {
        cluster += points[++index];
        continue;
      }
      if (next === '\u200d' && index + 2 < points.length) {
        cluster += points[++index] + points[++index];
        continue;
      }
      break;
    }
    graphemes.push(cluster);
  }
  return graphemes;
}

export function headingTiming(graphemeCount, hero = false) {
  const count = Math.max(0, Math.trunc(Number(graphemeCount) || 0));
  if (count === 0) return { interval: 0, duration: 0 };
  const settle = 120;
  if (count === 1) return { interval: 0, duration: settle };
  const duration = hero
    ? 800
    : Math.min(1000, Math.max(560, (count - 1) * 32 + 80));
  return { interval: (duration - settle) / (count - 1), duration };
}

export function headingVisibleCount(elapsed, interval, graphemeCount) {
  const count = Math.max(0, Math.trunc(Number(graphemeCount) || 0));
  if (count === 0) return 0;
  const time = Math.max(0, Number(elapsed) || 0);
  const step = Math.max(1, Number(interval) || 0);
  return Math.min(count, Math.max(1, Math.floor(time / step) + 1));
}

export function isLanyardHandoffEligible(status, stableFigureVisible) {
  return status === 'ready' && stableFigureVisible;
}

export function createOnceLedger(ids = []) {
  const states = new Map(ids.map((id) => [id, 'unseen']));
  return {
    state(id) {
      return states.get(id);
    },
    begin(id) {
      if (states.get(id) !== 'unseen') return false;
      states.set(id, 'entering');
      return true;
    },
    finish(id) {
      if (states.has(id)) states.set(id, 'done');
    },
  };
}
