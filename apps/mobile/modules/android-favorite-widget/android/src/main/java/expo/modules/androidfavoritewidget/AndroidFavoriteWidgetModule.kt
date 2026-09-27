package expo.modules.androidfavoritewidget

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AndroidFavoriteWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidFavoriteWidget")

    Function("syncFavorites") { json: String ->
      val context = appContext.reactContext?.applicationContext ?: return@Function
      FavoritesWidgetStore.save(context, json)
      FavoritesWidgetUpdater.updateAll(context)
    }
  }
}
