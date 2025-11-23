export const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 300) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const throttle = <F extends (...args: any[]) => void>(
  fn: F,
  wait: number
): F => {
  let lastCallTime = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[] | null = null;
  let lastThis: any = null;

  const invoke = () => {
    fn.apply(lastThis, lastArgs as any[]);
    lastCallTime = Date.now();
    lastArgs = null;
    lastThis = null;
  };

  return ((...args: any[]) => {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);

    lastArgs = args;
    lastThis = null;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      invoke();
    } else if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        invoke();
      }, remaining);
    }
  }) as F;
};
