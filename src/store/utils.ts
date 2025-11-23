import type { Store } from '@reduxjs/toolkit';
import { throttle } from '@shared-utils';

export function persistSlice<State, K extends keyof State>(
  store: Store<State>,
  sliceKey: K,
  saveFn: (sliceState: State[K]) => void,
  wait = 500
) {
  let prev = store.getState()[sliceKey];

  store.subscribe(
    throttle(() => {
      const state = store.getState();
      const current = state[sliceKey];

      if (current !== prev) {
        saveFn(current);
        prev = current;
      }
    }, wait)
  );
}
