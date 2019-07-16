import { useEffect, useState } from 'react';
// rxjs used for debounce
import { fromEvent, isObservable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

/**
 * Determine which breakpoints are active, and name the current breakpoint.
 *
 * @returns {string} breakpoint based on mediaQuery
 * @export
 */

export const useWindowSizeRx = () => {
  const isClient = typeof window === 'object';

  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    };

    const resize$ = fromEvent(window, 'resize');
    // wait .5s between keyups to emit current value
    const RXresize = resize$
      .pipe(
        debounceTime(500),
        tap((i) => {
          handleResize();
        }),
      )
      .subscribe();
    return () => {
      if (isObservable(resize$)) {
        RXresize.unsubscribe();
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};
