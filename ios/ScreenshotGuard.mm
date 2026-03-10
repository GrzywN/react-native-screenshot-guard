#import "ScreenshotGuard.h"
#import <UIKit/UIKit.h>

@implementation ScreenshotGuard {
  UITextField *_protectionTextField;
  CALayer *_originalParent;
}

- (UIWindow *)keyWindow {
  UIWindow *keyWindow = nil;

  for (UIWindowScene *scene in UIApplication.sharedApplication.connectedScenes) {
    if (![scene isKindOfClass:[UIWindowScene class]]) {
      continue;
    }

    for (UIWindow *window in scene.windows) {
      if (window.isKeyWindow) {
        keyWindow = window;
      }
    }
  }

  return keyWindow;
}

- (void)preventScreenshots {
  if (_protectionTextField != nil) {
    return;
  }

  UIWindow *window = [self keyWindow];

  if (window == nil) {
    return;
  }

  UITextField *textField = [[UITextField alloc] init];
  textField.secureTextEntry = YES;
  textField.userInteractionEnabled = NO;
  textField.backgroundColor = UIColor.clearColor;
  textField.frame = UIScreen.mainScreen.bounds;

  _originalParent = window.layer.superlayer;

  [window.layer.superlayer addSublayer:textField.layer];

  CALayer *firstSublayer = textField.layer.sublayers.firstObject;

  if (firstSublayer != nil) {
    [window.layer removeFromSuperlayer];
    [firstSublayer addSublayer:window.layer];
  }

  _protectionTextField = textField;
}

- (void)allowScreenshots {
  if (_protectionTextField == nil || _originalParent == nil) {
    return;
  }

  UIWindow *window = [self keyWindow];

  if (window == nil) {
    return;
  }

  [window.layer removeFromSuperlayer];
  [_originalParent addSublayer:window.layer];
  [_protectionTextField.layer removeFromSuperlayer];

  _protectionTextField = nil;
  _originalParent = nil;
}

- (void)enableProtectionAsync:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [self preventScreenshots];
      resolve(nil);
    } @catch (NSException *exception) {
      reject(@"ScreenshotGuard.error", exception.reason, nil);
    }
  });
}

- (void)disableProtectionAsync:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [self allowScreenshots];
      resolve(nil);
    } @catch (NSException *exception) {
      reject(@"ScreenshotGuard.error", exception.reason, nil);
    }
  });
}

- (NSNumber *)isProtectionEnabled {
  return @(_protectionTextField != nil);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeScreenshotGuardSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ScreenshotGuard";
}

@end
