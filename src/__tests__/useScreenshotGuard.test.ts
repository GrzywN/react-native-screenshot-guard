import { act, renderHook } from '@testing-library/react-native';

import { useScreenshotGuard } from '../useScreenshotGuard';

jest.mock('../NativeScreenshotGuard', () => ({
  __esModule: true,
  default: {
    enableProtectionAsync: jest.fn(),
    disableProtectionAsync: jest.fn(),
    isProtectionEnabled: jest.fn().mockReturnValue(false),
  },
}));

const mockModule = jest.requireMock('../NativeScreenshotGuard').default;
const mockEnableProtectionAsync = mockModule.enableProtectionAsync as jest.Mock;
const mockDisableProtectionAsync =
  mockModule.disableProtectionAsync as jest.Mock;

describe('useScreenshotGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnableProtectionAsync.mockResolvedValue(undefined);
    mockDisableProtectionAsync.mockResolvedValue(undefined);
  });

  it('enables protection on mount', () => {
    const { unmount } = renderHook(() => useScreenshotGuard());

    expect(mockEnableProtectionAsync).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('disables protection on unmount', () => {
    const { unmount } = renderHook(() => useScreenshotGuard());

    unmount();

    expect(mockDisableProtectionAsync).toHaveBeenCalledTimes(1);
  });

  it('does not enable or disable when enabled=false', () => {
    const { unmount } = renderHook(() => useScreenshotGuard(false));

    unmount();

    expect(mockEnableProtectionAsync).not.toHaveBeenCalled();
    expect(mockDisableProtectionAsync).not.toHaveBeenCalled();
  });

  it('only enables on first mount and only disables on last unmount', () => {
    const { unmount: unmount1 } = renderHook(() => useScreenshotGuard());
    const { unmount: unmount2 } = renderHook(() => useScreenshotGuard());

    expect(mockEnableProtectionAsync).toHaveBeenCalledTimes(1);

    unmount1();
    expect(mockDisableProtectionAsync).not.toHaveBeenCalled();

    unmount2();
    expect(mockDisableProtectionAsync).toHaveBeenCalledTimes(1);
  });

  it('enables when enabled changes from false to true', () => {
    const { rerender, unmount } = renderHook(
      ({ enabled }: { enabled: boolean }) => useScreenshotGuard(enabled),
      { initialProps: { enabled: false } }
    );

    expect(mockEnableProtectionAsync).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(mockEnableProtectionAsync).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('disables when enabled changes from true to false', () => {
    const { rerender, unmount } = renderHook(
      ({ enabled }: { enabled: boolean }) => useScreenshotGuard(enabled),
      { initialProps: { enabled: true } }
    );

    rerender({ enabled: false });

    expect(mockDisableProtectionAsync).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('calls custom onError when enableProtectionAsync rejects', async () => {
    const error = new Error('enable failed');
    mockEnableProtectionAsync.mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { unmount } = renderHook(() => useScreenshotGuard(true, { onError }));

    await act(async () => {});

    expect(onError).toHaveBeenCalledWith(error);

    unmount();
  });

  it('calls custom onError when disableProtectionAsync rejects', async () => {
    const error = new Error('disable failed');
    mockDisableProtectionAsync.mockRejectedValueOnce(error);

    const onError = jest.fn();
    const { unmount } = renderHook(() => useScreenshotGuard(true, { onError }));

    unmount();

    await act(async () => {});

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('uses console.error as default onError', async () => {
    const error = new Error('test error');
    mockEnableProtectionAsync.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { unmount } = renderHook(() => useScreenshotGuard());

    await act(async () => {});

    expect(consoleSpy).toHaveBeenCalledWith(error);

    unmount();
    consoleSpy.mockRestore();
  });
});
