jest.mock('react-native', () => ({
  TurboModuleRegistry: {
    getEnforcing: () => ({
      enableProtectionAsync: jest.fn().mockResolvedValue(undefined),
      disableProtectionAsync: jest.fn().mockResolvedValue(undefined),
      isProtectionEnabled: jest.fn().mockReturnValue(false),
    }),
  },
}));

import NativeScreenshotGuard from '../NativeScreenshotGuard';

describe('NativeScreenshotGuard', () => {
  it('enableProtectionAsync resolves without error', async () => {
    await expect(
      NativeScreenshotGuard.enableProtectionAsync()
    ).resolves.toBeUndefined();
  });

  it('disableProtectionAsync resolves without error', async () => {
    await expect(
      NativeScreenshotGuard.disableProtectionAsync()
    ).resolves.toBeUndefined();
  });

  it('isProtectionEnabled returns false', () => {
    expect(NativeScreenshotGuard.isProtectionEnabled()).toBe(false);
  });
});
