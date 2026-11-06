export function updateExperienceCaptionState(copies, activeIndex, finishEntry) {
  copies.forEach((copy, index) => {
    const active = index === activeIndex;
    const wasActive = copy.dataset.active === 'true';
    if (wasActive && !active && copy.dataset.v6State === 'entering') {
      const id = copy.dataset.v6Enter;
      if (id) finishEntry(id);
    }
    copy.hidden = !active;
    copy.setAttribute('aria-hidden', String(!active));
    copy.inert = !active;
    copy.dataset.active = String(active);
  });
}
