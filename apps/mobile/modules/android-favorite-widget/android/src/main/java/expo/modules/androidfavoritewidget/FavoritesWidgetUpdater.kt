package expo.modules.androidfavoritewidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.RemoteViews
import kotlin.math.abs

object FavoritesWidgetUpdater {
  private enum class Size { SMALL, MEDIUM, LARGE }

  private data class RowIds(
    val row: Int,
    val phone: Int,
    val title: Int,
    val call: Int,
  )

  private val MEDIUM_ROWS =
    listOf(
      RowIds(R.id.row_0, R.id.phone_0, R.id.title_0, R.id.call_0),
      RowIds(R.id.row_1, R.id.phone_1, R.id.title_1, R.id.call_1),
      RowIds(R.id.row_2, R.id.phone_2, R.id.title_2, R.id.call_2),
    )

  private val LARGE_ROWS =
    listOf(
      RowIds(R.id.row_0, R.id.phone_0, R.id.title_0, R.id.call_0),
      RowIds(R.id.row_1, R.id.phone_1, R.id.title_1, R.id.call_1),
      RowIds(R.id.row_2, R.id.phone_2, R.id.title_2, R.id.call_2),
      RowIds(R.id.row_3, R.id.phone_3, R.id.title_3, R.id.call_3),
      RowIds(R.id.row_4, R.id.phone_4, R.id.title_4, R.id.call_4),
      RowIds(R.id.row_5, R.id.phone_5, R.id.title_5, R.id.call_5),
    )

  fun updateAll(context: Context) {
    val manager = AppWidgetManager.getInstance(context)
    val ids =
      manager.getAppWidgetIds(
        ComponentName(context, FavoritesWidgetProvider::class.java),
      )
    if (ids.isEmpty()) return
    for (id in ids) {
      updateAppWidget(context, manager, id)
    }
  }

  fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int,
  ) {
    val options = appWidgetManager.getAppWidgetOptions(appWidgetId)
    val views = buildRemoteViews(context, appWidgetId, options)
    appWidgetManager.updateAppWidget(appWidgetId, views)
  }

  private fun buildRemoteViews(
    context: Context,
    appWidgetId: Int,
    options: Bundle,
  ): RemoteViews {
    val items = FavoritesWidgetStore.load(context)
    if (items.isEmpty()) {
      return buildEmpty(context, appWidgetId)
    }

    return when (resolveSize(options)) {
      Size.SMALL -> buildSmall(context, appWidgetId, items)
      Size.MEDIUM -> buildListLayout(context, appWidgetId, items, Size.MEDIUM)
      Size.LARGE -> buildListLayout(context, appWidgetId, items, Size.LARGE)
    }
  }

  private fun resolveSize(options: Bundle): Size {
    val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110)
    val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110)

    return when {
      minWidth >= 250 && minHeight >= 250 -> Size.LARGE
      minWidth >= 250 || minHeight >= 180 -> Size.MEDIUM
      else -> Size.SMALL
    }
  }

  private fun buildEmpty(context: Context, appWidgetId: Int): RemoteViews {
    val views = RemoteViews(context.packageName, R.layout.favorite_widget_empty)
    val openApp = openAppPendingIntent(context, appWidgetId, requestSalt = 1)
    views.setOnClickPendingIntent(R.id.widget_brand, openApp)
    views.setOnClickPendingIntent(R.id.widget_open_app, openApp)
    return views
  }

  private fun buildSmall(
    context: Context,
    appWidgetId: Int,
    items: List<FavoriteWidgetItem>,
  ): RemoteViews {
    val item = items.first()
    val views = RemoteViews(context.packageName, R.layout.favorite_widget_small)
    views.setTextViewText(R.id.widget_phone, "★ ${item.phone}")
    views.setTextViewText(R.id.widget_title, item.title)

    views.setOnClickPendingIntent(
      R.id.widget_brand,
      openAppPendingIntent(context, appWidgetId, requestSalt = 1),
    )

    val dial = dialPendingIntent(context, appWidgetId, item)
    views.setOnClickPendingIntent(R.id.widget_dial_area, dial)
    views.setOnClickPendingIntent(R.id.widget_call, dial)
    return views
  }

  private fun buildListLayout(
    context: Context,
    appWidgetId: Int,
    items: List<FavoriteWidgetItem>,
    size: Size,
  ): RemoteViews {
    val layoutId =
      if (size == Size.LARGE) R.layout.favorite_widget_large else R.layout.favorite_widget_medium
    val rows = if (size == Size.LARGE) LARGE_ROWS else MEDIUM_ROWS
    val visibleCount =
      when (size) {
        Size.MEDIUM -> minOf(items.size, 3)
        Size.LARGE -> minOf(items.size, 6)
        Size.SMALL -> 1
      }

    val views = RemoteViews(context.packageName, layoutId)
    val openApp = openAppPendingIntent(context, appWidgetId, requestSalt = 1)
    views.setOnClickPendingIntent(R.id.widget_brand, openApp)
    views.setOnClickPendingIntent(R.id.widget_header, openApp)
    if (size == Size.LARGE) {
      views.setOnClickPendingIntent(R.id.widget_manage, openApp)
    }

    for (index in rows.indices) {
      val row = rows[index]
      if (index < visibleCount) {
        val item = items[index]
        views.setViewVisibility(row.row, View.VISIBLE)
        views.setTextViewText(row.phone, item.phone)
        views.setTextViewText(row.title, item.title)
        val dial = dialPendingIntent(context, appWidgetId, item)
        views.setOnClickPendingIntent(row.row, dial)
        views.setOnClickPendingIntent(row.call, dial)
      } else {
        views.setViewVisibility(row.row, View.GONE)
      }
    }

    return views
  }

  private fun dialPendingIntent(
    context: Context,
    appWidgetId: Int,
    item: FavoriteWidgetItem,
  ): PendingIntent {
    val digits = item.phone.replace(Regex("[^0-9+]"), "")
    val intent =
      Intent(Intent.ACTION_DIAL).apply {
        data = Uri.parse("tel:$digits")
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
    val requestCode = stableRequestCode(appWidgetId, "dial", item.id)
    return PendingIntent.getActivity(context, requestCode, intent, pendingIntentFlags())
  }

  private fun openAppPendingIntent(
    context: Context,
    appWidgetId: Int,
    requestSalt: Int,
  ): PendingIntent {
    val launch =
      context.packageManager.getLaunchIntentForPackage(context.packageName)
        ?: Intent(Intent.ACTION_VIEW, Uri.parse("whatnumber://")).apply {
          setPackage(context.packageName)
        }
    launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    val requestCode = stableRequestCode(appWidgetId, "open", requestSalt.toString())
    return PendingIntent.getActivity(context, requestCode, launch, pendingIntentFlags())
  }

  private fun pendingIntentFlags(): Int {
    var flags = PendingIntent.FLAG_UPDATE_CURRENT
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      flags = flags or PendingIntent.FLAG_IMMUTABLE
    }
    return flags
  }

  private fun stableRequestCode(
    appWidgetId: Int,
    kind: String,
    key: String,
  ): Int {
    val seed = "$appWidgetId:$kind:$key"
    return abs(seed.hashCode())
  }
}
