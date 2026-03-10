import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  enableProtectionAsync(): Promise<void>;
  disableProtectionAsync(): Promise<void>;
  isProtectionEnabled(): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ScreenshotGuard');
