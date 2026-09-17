import { HStack, Image, Link, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  clipShape,
  containerBackground,
  cornerRadius,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  minimumScaleFactor,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type FavoriteWidgetItem = {
  icon: string;
  title: string;
  num: string;
  tel: string;
};

export type FavoritesWidgetProps = {
  items: FavoriteWidgetItem[];
};

const FavoritesWidgetLayout = (
  props: FavoritesWidgetProps,
  environment: WidgetEnvironment,
) => {
  'widget';

  const accent = '#D94F3D';
  const softIcon = '#FFEDEA';
  const bg = '#F7F4F1';
  const ink = '#1A1A1A';
  const muted = '#8A8581';
  const starYellow = '#F0C419';
  const white = '#FFFFFF';
  const divider = '#EDE8E4';

  const family = environment.widgetFamily;
  const isSmall = family === 'systemSmall';
  const isMedium = family === 'systemMedium';

  // All list: 2×2 → 1, 4×2 → 3, 4×4 → 6
  const maxItems = isSmall ? 1 : isMedium ? 3 : 6;
  const items = (props.items ?? []).slice(0, maxItems);

  // Manual margins (native uses contentMarginsDisabled) — keep content short
  // enough that SwiftUI does not compress this padding away.
  const edgeX = 16;
  const edgeY = isMedium ? 14 : 16;

  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];
  const e = items[4];
  const f = items[5];

  const brandBadge = (
    <Text
      modifiers={[
        font({ weight: 'bold', size: isMedium ? 9 : 10 }),
        foregroundStyle(white),
        padding({ vertical: isMedium ? 3 : 4, horizontal: isMedium ? 7 : 9 }),
        background(accent),
        cornerRadius(9),
      ]}
    >
      몇번이야?
    </Text>
  );

  const favoritesLink = (
    <Link destination="whatnumber://">
      <Text
        modifiers={[
          font({ weight: 'semibold', size: isMedium ? 10 : 11 }),
          foregroundStyle(muted),
        ]}
      >
        즐겨찾기 ›
      </Text>
    </Link>
  );

  /** Full-width list row — 전화 아이콘(및 행 전체)이 tel 링크로 바로 전화앱을 엽니다 */
  const listRow = (
    item: FavoriteWidgetItem,
    opts: { compact: boolean; showDivider: boolean },
  ) => {
    const icon = opts.compact ? 24 : 28;
    const call = opts.compact ? 24 : 28;
    return (
      <VStack spacing={0} alignment="leading">
        <HStack
          spacing={opts.compact ? 7 : 10}
          alignment="center"
          modifiers={[padding({ vertical: opts.compact ? 2 : 5 })]}
        >
          <Link destination={item.tel}>
            <HStack spacing={opts.compact ? 7 : 10} alignment="center">
              <HStack
                alignment="center"
                modifiers={[
                  frame({ width: icon, height: icon }),
                  background(softIcon),
                  clipShape('circle'),
                ]}
              >
                <Text modifiers={[font({ size: opts.compact ? 12 : 14 })]}>
                  {item.icon || '📞'}
                </Text>
              </HStack>

              <Text
                modifiers={[
                  font({ weight: 'bold', size: opts.compact ? 15 : 17 }),
                  foregroundStyle(ink),
                  lineLimit(1),
                  minimumScaleFactor(0.7),
                ]}
              >
                {item.num}
              </Text>

              <Text
                modifiers={[
                  font({ weight: 'medium', size: opts.compact ? 11 : 13 }),
                  foregroundStyle(muted),
                  lineLimit(1),
                  minimumScaleFactor(0.7),
                  frame({ maxWidth: 999 }),
                ]}
              >
                {item.title}
              </Text>
            </HStack>
          </Link>

          <Spacer />

          <Link destination={item.tel}>
            <Image
              systemName="phone.fill"
              size={opts.compact ? 8 : 10}
              color={white}
              modifiers={[
                frame({ width: call, height: call }),
                padding({ all: opts.compact ? 6 : 8 }),
                background(accent),
                clipShape('circle'),
              ]}
            />
          </Link>
        </HStack>
        {opts.showDivider ? (
          <HStack modifiers={[frame({ height: 1, maxWidth: 999 }), background(divider)]}>
            <Text> </Text>
          </HStack>
        ) : null}
      </VStack>
    );
  };

  if (items.length === 0) {
    return (
      <VStack
        spacing={8}
        alignment="center"
        modifiers={[
          padding({ horizontal: edgeX, vertical: edgeY }),
          containerBackground(bg, 'widget'),
          widgetURL('whatnumber://'),
        ]}
      >
        <HStack>
          {brandBadge}
          <Spacer />
          {isSmall ? (
            <Image systemName="star" size={12} color={muted} />
          ) : (
            favoritesLink
          )}
        </HStack>
        <Spacer />
        <HStack
          alignment="center"
          modifiers={[
            frame({ width: 44, height: 44 }),
            background(softIcon),
            clipShape('circle'),
          ]}
        >
          <Image
            systemName={isMedium ? 'star.fill' : 'phone.fill'}
            size={18}
            color={accent}
          />
        </HStack>
        <Text modifiers={[font({ weight: 'bold', size: 13 }), foregroundStyle(ink)]}>
          {isSmall ? '즐겨찾기가 없어요' : '즐겨찾기를 추가해보세요'}
        </Text>
        <Text
          modifiers={[
            font({ size: 11 }),
            foregroundStyle(muted),
            lineLimit(2),
            minimumScaleFactor(0.85),
          ]}
        >
          앱에서 추가하면 여기서 바로 전화해요
        </Text>
        <Spacer />
      </VStack>
    );
  }

  // Small 2×2 → 1
  if (isSmall) {
    return (
      <Link destination={a.tel}>
        <VStack
          spacing={8}
          alignment="leading"
          modifiers={[
            padding({ horizontal: edgeX, vertical: edgeY }),
            containerBackground(bg, 'widget'),
          ]}
        >
          <HStack>
            {brandBadge}
            <Spacer />
            <Image systemName="star.fill" size={12} color={starYellow} />
          </HStack>

          <HStack spacing={10} alignment="center">
            <HStack
              alignment="center"
              modifiers={[
                frame({ width: 36, height: 36 }),
                background(softIcon),
                clipShape('circle'),
              ]}
            >
              <Text modifiers={[font({ size: 18 })]}>{a.icon || '📞'}</Text>
            </HStack>
            <VStack spacing={1} alignment="leading">
              <Text
                modifiers={[
                  font({ weight: 'bold', size: 22 }),
                  foregroundStyle(ink),
                  lineLimit(1),
                  minimumScaleFactor(0.65),
                ]}
              >
                {a.num}
              </Text>
              <Text
                modifiers={[
                  font({ weight: 'medium', size: 11 }),
                  foregroundStyle(muted),
                  lineLimit(2),
                  minimumScaleFactor(0.8),
                ]}
              >
                {a.title}
              </Text>
            </VStack>
          </HStack>

          <HStack
            spacing={5}
            alignment="center"
            modifiers={[
              padding({ vertical: 9, horizontal: 10 }),
              background(accent),
              cornerRadius(12),
              frame({ maxWidth: 999 }),
            ]}
          >
            <Spacer />
            <Image systemName="phone.fill" size={10} color={white} />
            <Text modifiers={[font({ weight: 'bold', size: 11 }), foregroundStyle(white)]}>
              바로 전화
            </Text>
            <Spacer />
          </HStack>
        </VStack>
      </Link>
    );
  }

  // Medium 4×2 → 3 list rows + real top/bottom inset
  // Content stays short so vertical padding is not squeezed away.
  if (isMedium) {
    return (
      <VStack
        spacing={0}
        alignment="leading"
        modifiers={[containerBackground(bg, 'widget')]}
      >
        <VStack
          spacing={3}
          alignment="leading"
          modifiers={[padding({ horizontal: edgeX, vertical: edgeY })]}
        >
          <HStack alignment="center" modifiers={[padding({ bottom: 4 })]}>
            {brandBadge}
            <Spacer />
            {favoritesLink}
          </HStack>
          {a ? listRow(a, { compact: true, showDivider: !!b }) : null}
          {b ? listRow(b, { compact: true, showDivider: !!c }) : null}
          {c ? listRow(c, { compact: true, showDivider: false }) : null}
        </VStack>
      </VStack>
    );
  }

  // Large 4×4 → 6 list rows (no grid — titles stay readable)
  return (
    <VStack spacing={0} alignment="leading" modifiers={[containerBackground(bg, 'widget')]}>
      <VStack
        spacing={2}
        alignment="leading"
        modifiers={[padding({ horizontal: edgeX, vertical: edgeY })]}
      >
        <HStack alignment="center" modifiers={[padding({ bottom: 6 })]}>
          {brandBadge}
          <Spacer />
          {favoritesLink}
        </HStack>
        {a ? listRow(a, { compact: false, showDivider: !!b }) : null}
        {b ? listRow(b, { compact: false, showDivider: !!c }) : null}
        {c ? listRow(c, { compact: false, showDivider: !!d }) : null}
        {d ? listRow(d, { compact: false, showDivider: !!e }) : null}
        {e ? listRow(e, { compact: false, showDivider: !!f }) : null}
        {f ? listRow(f, { compact: false, showDivider: false }) : null}
        <HStack modifiers={[padding({ top: 8 })]}>
          <Text
            modifiers={[
              font({ size: 10 }),
              foregroundStyle(muted),
              lineLimit(1),
              minimumScaleFactor(0.85),
            ]}
          >
            필요할 때, 바로 몇번이야?
          </Text>
          <Spacer />
          <Text
            modifiers={[
              font({ weight: 'medium', size: 11, design: 'serif' }),
              foregroundStyle(accent),
            ]}
          >
            Better Days
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default createWidget('FavoritesWidget', FavoritesWidgetLayout);
