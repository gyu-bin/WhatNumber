import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct FavoritesWidget: Widget {
  let name: String = "FavoritesWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      WidgetsEntryView(entry: entry)
    }
    .configurationDisplayName("즐겨찾기 전화")
    .description("즐겨찾기 번호를 탭하면 바로 전화할 수 있어요")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}