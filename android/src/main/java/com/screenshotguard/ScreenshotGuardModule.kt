package com.screenshotguard

import android.app.Activity
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

class ScreenshotGuardModule(reactContext: ReactApplicationContext) :
  NativeScreenshotGuardSpec(reactContext) {

  private val requireActivity: Activity
    get() = reactApplicationContext.currentActivity
      ?: throw IllegalStateException("$NAME: No current activity")

  override fun enableProtectionAsync(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        requireActivity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)

        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("$NAME.error", e.message ?: e.toString(), e)
      }
    }
  }

  override fun disableProtectionAsync(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        requireActivity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)

        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("$NAME.error", e.message ?: e.toString(), e)
      }
    }
  }

  override fun isProtectionEnabled(): Boolean {
    val activity = reactApplicationContext.currentActivity ?: return false

    val allWindowFlags = activity.window.attributes.flags
    val secureFlagMask = WindowManager.LayoutParams.FLAG_SECURE
    val isSecureFlagSet = (allWindowFlags and secureFlagMask) != 0

    return isSecureFlagSet
  }

  companion object {
    const val NAME = NativeScreenshotGuardSpec.NAME
  }
}
