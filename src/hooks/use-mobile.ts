import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    onChange(); // Call immediately to set initial value
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
