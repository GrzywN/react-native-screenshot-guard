import { useScreenshotGuard } from '../index';

jest.mock('../NativeScreenshotGuard', () => ({
  __esModule: true,
  default: {
    enableProtectionAsync: jest.fn(),
    disableProtectionAsync: jest.fn(),
    isProtectionEnabled: jest.fn(),
  },
}));

describe('index exports', () => {
  it('exports useScreenshotGuard as a function', () => {
    expect(typeof useScreenshotGuard).toBe('function');
  });
});
