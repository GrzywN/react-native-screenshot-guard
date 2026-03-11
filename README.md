# react-native-screenshot-guard

Per-screen screenshot and screen recording protection for React Native apps — a React hook that bridges iOS's secure layer API and Android's `FLAG_SECURE` to the JS world.

> **Requires React Native New Architecture.** This package is implemented as a Turbo Module and does not support the legacy bridge.

## Installation

```sh
npm install react-native-screenshot-guard
```

Then run CocoaPods:

```sh
npx pod-install
```

## Usage

```tsx
import { useScreenshotGuard } from 'react-native-screenshot-guard';

function SecretScreen() {
  useScreenshotGuard();

  return <View>...</View>;
}
```

Protection is enabled when the component mounts and disabled when it unmounts. The hook uses reference counting — if multiple components call `useScreenshotGuard()` simultaneously, protection disables only when the last one unmounts.

## `useScreenshotGuard`

```ts
useScreenshotGuard(enabled?: boolean, options?: ScreenshotGuardOptions): void
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Whether protection is active. Toggling this at runtime enables or disables protection immediately. |
| `options.onError` | `(error: unknown) => void` | `console.error` | Called if `enableProtectionAsync` or `disableProtectionAsync` rejects. |

## Tab navigation

Tab navigators (React Navigation, Expo Router) keep all visited screens mounted in the background. This means a screen with `useScreenshotGuard(true)` stays active even when another tab is visible.

Pass your navigator's focus state as `enabled` to scope protection to the focused screen:

```tsx
import { useIsFocused } from '@react-navigation/native';
import { useScreenshotGuard } from 'react-native-screenshot-guard';

function SecretScreen() {
  const isFocused = useIsFocused();
  useScreenshotGuard(isFocused);

  return <View>...</View>;
}
```

The same pattern works with any navigation library that exposes a focus hook — substitute `useIsFocused` with the equivalent from your router.

## Low-level module API

For imperative use cases (e.g. protecting a modal before it animates in), the native module is also exported:

```ts
import NativeScreenshotGuard from 'react-native-screenshot-guard/src/NativeScreenshotGuard';

await NativeScreenshotGuard.enableProtectionAsync();
await NativeScreenshotGuard.disableProtectionAsync();

const isEnabled = NativeScreenshotGuard.isProtectionEnabled();
```

| Method | Returns | Description |
|---|---|---|
| `enableProtectionAsync()` | `Promise<void>` | Enables screenshot and screen recording protection. |
| `disableProtectionAsync()` | `Promise<void>` | Disables protection. |
| `isProtectionEnabled()` | `boolean` | Returns the current protection state synchronously. |

## Platform handling

| Platform | Behavior |
|---|---|
| iOS | Window layer is placed inside a `UITextField` with `isSecureTextEntry = true`. iOS prevents secure text fields from appearing in screenshots and recordings. |
| Android | Sets `FLAG_SECURE` on the activity window, which blocks the system screenshot mechanism and marks the window as non-recordable. |

## Types

```ts
import type { ScreenshotGuardOptions } from 'react-native-screenshot-guard';
```

`ScreenshotGuardOptions` — options bag for `useScreenshotGuard`.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
