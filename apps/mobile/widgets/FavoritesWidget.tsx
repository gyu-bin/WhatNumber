import { HStack, Link, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type FavoriteWidgetItem = {
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
  const bg = '#FCFBFA';
  const muted = '#6B6B6B';
  const ink = '#171717';
  const items = props.items ?? [];
  const family = environment.widgetFamily;

  if (items.length === 0) {
    return (
      <VStack
        spacing={6}
        alignment="leading"
        modifiers={[
          padding({ all: 14 }),
          containerBackground(bg, 'widget'),
          widgetURL('whatnumber://'),
        ]}
      >
        <Text modifiers={[font({ weight: 'bold', size: 15 }), foregroundStyle(accent)]}>
          몇번이야
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>
          앱에서 즐겨찾기를 추가하면 여기서 바로 전화할 수 있어요
        </Text>
      </VStack>
    );
  }

  if (family === 'systemSmall') {
    const item = items[0];
    return (
      <Link destination={item.tel}>
        <VStack
          spacing={4}
          alignment="leading"
          modifiers={[padding({ all: 14 }), containerBackground(bg, 'widget')]}
        >
          <Text modifiers={[font({ weight: 'bold', size: 12 }), foregroundStyle(accent)]}>
            즐겨찾기
          </Text>
          <Spacer />
          <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(ink)]}>
            {item.title}
          </Text>
          <Text modifiers={[font({ weight: 'bold', size: 22 }), foregroundStyle(accent)]}>
            {item.num}
          </Text>
          <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>탭해서 전화</Text>
        </VStack>
      </Link>
    );
  }

  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];
  const showExtra = family === 'systemLarge';

  return (
    <VStack
      spacing={6}
      alignment="leading"
      modifiers={[padding({ all: 12 }), containerBackground(bg, 'widget')]}
    >
      <Text modifiers={[font({ weight: 'bold', size: 13 }), foregroundStyle(accent)]}>
        즐겨찾기 · 탭하면 전화
      </Text>
      {a ? (
        <Link destination={a.tel}>
          <HStack>
            <VStack spacing={2} alignment="leading">
              <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink)]}>
                {a.title}
              </Text>
              <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(accent)]}>
                {a.num}
              </Text>
            </VStack>
            <Spacer />
            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>전화</Text>
          </HStack>
        </Link>
      ) : null}
      {b ? (
        <Link destination={b.tel}>
          <HStack>
            <VStack spacing={2} alignment="leading">
              <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink)]}>
                {b.title}
              </Text>
              <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(accent)]}>
                {b.num}
              </Text>
            </VStack>
            <Spacer />
            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>전화</Text>
          </HStack>
        </Link>
      ) : null}
      {c ? (
        <Link destination={c.tel}>
          <HStack>
            <VStack spacing={2} alignment="leading">
              <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink)]}>
                {c.title}
              </Text>
              <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(accent)]}>
                {c.num}
              </Text>
            </VStack>
            <Spacer />
            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>전화</Text>
          </HStack>
        </Link>
      ) : null}
      {showExtra && d ? (
        <Link destination={d.tel}>
          <HStack>
            <VStack spacing={2} alignment="leading">
              <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink)]}>
                {d.title}
              </Text>
              <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(accent)]}>
                {d.num}
              </Text>
            </VStack>
            <Spacer />
            <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>전화</Text>
          </HStack>
        </Link>
      ) : null}
      {showExtra ? (
        <HStack>
          <Spacer />
          <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>몇번이야</Text>
        </HStack>
      ) : null}
    </VStack>
  );
};

export default createWidget('FavoritesWidget', FavoritesWidgetLayout);
