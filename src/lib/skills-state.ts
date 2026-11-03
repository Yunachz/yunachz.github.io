export type SkillSelection = {
  keyboardFocusId: string | null;
  touchSelectionId: string | null;
  pointerHoverId: string | null;
};

export function resolveSkillSelection(selection: SkillSelection): string | null {
  return selection.keyboardFocusId
    ?? selection.touchSelectionId
    ?? selection.pointerHoverId;
}

export function toggleTouchSkillSelection(currentId: string | null, selectedId: string): string | null {
  return currentId === selectedId ? null : selectedId;
}
