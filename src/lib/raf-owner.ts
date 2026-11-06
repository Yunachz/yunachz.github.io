export function createFrameOwner(
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (handle: number) => void,
  runFrame: (timestamp: number) => void,
) {
  let handle: number | undefined;
  let generation = 0;

  return {
    schedule(): void {
      if (handle !== undefined) return;
      const owner = ++generation;
      const nextHandle = requestFrame((timestamp) => {
        if (owner !== generation) return;
        handle = undefined;
        runFrame(timestamp);
      });
      handle = nextHandle;
    },
    cancel(): void {
      generation += 1;
      if (handle !== undefined) cancelFrame(handle);
      handle = undefined;
    },
    pending(): boolean {
      return handle !== undefined;
    },
  };
}
