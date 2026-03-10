import { useEffect } from 'react';

import ScreenshotGuard from './NativeScreenshotGuard';

let activeGuardCount = 0;

export type ScreenshotGuardOptions = {
  onError?: (error: unknown) => void;
};

export function useScreenshotGuard(
  enabled: boolean = true,
  { onError = console.error }: ScreenshotGuardOptions = {}
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    activeGuardCount++;

    if (activeGuardCount === 1) {
      ScreenshotGuard.enableProtectionAsync().catch(onError);
    }

    return () => {
      activeGuardCount--;

      if (activeGuardCount === 0) {
        ScreenshotGuard.disableProtectionAsync().catch(onError);
      }
    };
  }, [enabled, onError]);
}
