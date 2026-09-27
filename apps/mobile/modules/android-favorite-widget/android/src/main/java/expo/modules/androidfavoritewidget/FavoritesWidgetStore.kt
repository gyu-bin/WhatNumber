package expo.modules.androidfavoritewidget

import android.content.Context
import org.json.JSONArray

object FavoritesWidgetStore {
  private const val PREFS_NAME = "whatnumber_favorite_widget"
  private const val KEY_FAVORITES_JSON = "favorites_json"

  fun save(context: Context, json: String) {
    context
      .applicationContext
      .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString(KEY_FAVORITES_JSON, json)
      .apply()
  }

  fun load(context: Context): List<FavoriteWidgetItem> {
    val raw =
      context
        .applicationContext
        .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .getString(KEY_FAVORITES_JSON, null)
        ?: return emptyList()

    return parse(raw)
  }

  private fun parse(raw: String): List<FavoriteWidgetItem> {
    return try {
      val array = JSONArray(raw)
      buildList {
        for (i in 0 until array.length()) {
          val obj = array.optJSONObject(i) ?: continue
          val id = obj.optString("id").orEmpty()
          val title = obj.optString("title").orEmpty()
          val phone = obj.optString("phone").orEmpty()
          if (id.isBlank() || phone.isBlank()) continue
          add(
            FavoriteWidgetItem(
              id = id,
              title = title.ifBlank { phone },
              phone = phone,
              category = obj.optString("category").orEmpty(),
            ),
          )
        }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }
}
