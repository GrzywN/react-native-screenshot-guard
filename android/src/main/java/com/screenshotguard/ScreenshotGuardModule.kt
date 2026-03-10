package com.screenshotguard

import com.facebook.react.bridge.ReactApplicationContext

class ScreenshotGuardModule(reactContext: ReactApplicationContext) :
  NativeScreenshotGuardSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeScreenshotGuardSpec.NAME
  }
}
