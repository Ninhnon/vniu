import {useCallback, useRef} from 'react';

export const useDebounceSearchValue = (delay = 1000) => {
  const latestValue = useRef<string>('');
  const timeoutId = useRef<NodeJS.Timeout>();

  const debounce = useCallback(
    (callback: (value: string) => void) => {
      return (value: string) => {
        latestValue.current = value;
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
          if (value === latestValue.current) {
            callback(value);
          }
        }, delay);
      };
    },
    [delay],
  );

  return debounce;
};
