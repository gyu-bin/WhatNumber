import { Divider, HStack, Image, Link, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  containerBackground,
  containerRelativeFrame,
  cornerRadius,
  font,
  foregroundStyle,
  frame,
  lineLimit,
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

  // Keep all values inside this function: the widget runs in an isolated runtime.
  const accent = '#FF5A55';
  const softAccent = '#FFF0EF';
  const bg = '#FCFBFA';
  const ink = '#171717';
  const muted = '#777777';
  const divider = '#F0ECE9';
  const items = props.items ?? [];
  const family = environment.widgetFamily;
  const brand = (
    <Text
      modifiers={[
        font({ weight: 'bold', size: 12 }),
        foregroundStyle('#FFFFFF'),
        padding({ vertical: 6, horizontal: 10 }),
        background(accent),
        cornerRadius(12),
      ]}
    >
      몇번이야?
    </Text>
  );

  if (items.length === 0) {
    const emptyTitle = family === 'systemSmall' ? '즐겨찾기가 없어요' : '즐겨찾기를 추가해보세요';
    return (
      <VStack
        spacing={7}
        alignment="center"
        modifiers={[
          padding({ all: 14 }),
          containerBackground(bg, 'widget'),
          widgetURL('whatnumber://'),
        ]}
      >
        <HStack>
          {brand}
          <Spacer />
          <Image systemName="star" size={16} color={muted} />
        </HStack>
        <Spacer />
        <Image systemName="star.fill" size={family === 'systemSmall' ? 28 : 32} color={accent} />
        <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(ink)]}>
          {emptyTitle}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>
          앱에서 즐겨찾기를 추가하면
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>
          여기서 바로 전화할 수 있어요.
        </Text>
        <Spacer />
      </VStack>
    );
  }

  if (family === 'systemSmall') {
    const item = items[0];
    return (
      <Link destination={item.tel}>
        <VStack
          spacing={6}
          alignment="leading"
          modifiers={[padding({ all: 14 }), containerBackground(bg, 'widget')]}
        >
          <HStack>
            {brand}
            <Spacer />
            <Image systemName="star" size={16} color={muted} />
          </HStack>
          <Spacer />
          <HStack spacing={8} alignment="center">
            <Text modifiers={[font({ size: 26 })]}>{item.icon}</Text>
            <VStack spacing={1} alignment="leading">
              <Text
                modifiers={[
                  font({ weight: 'semibold', size: 15 }),
                  foregroundStyle(ink),
                  lineLimit(1),
                ]}
              >
                {item.title}
              </Text>
              <Text modifiers={[font({ weight: 'bold', size: 27 }), foregroundStyle(accent)]}>
                {item.num}
              </Text>
            </VStack>
          </HStack>
          <Spacer />
          <HStack
            spacing={7}
            alignment="center"
            modifiers={[
              padding({ vertical: 10, horizontal: 12 }),
              background(accent),
              cornerRadius(15),
              frame({ maxWidth: 999 }),
            ]}
          >
            <Spacer />
            <Image systemName="phone.fill" size={14} color="#FFFFFF" />
            <Text modifiers={[font({ weight: 'bold', size: 14 }), foregroundStyle('#FFFFFF')]}>바로 전화</Text>
            <Spacer />
          </HStack>
        </VStack>
      </Link>
    );
  }

  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];

  if (family === 'systemMedium') {
    return (
      <VStack
        spacing={8}
        alignment="leading"
        modifiers={[padding({ all: 14 }), containerBackground(bg, 'widget')]}
      >
        <HStack>
          {brand}
          <Spacer />
          <Text modifiers={[font({ weight: 'semibold', size: 13 }), foregroundStyle(muted)]}>즐겨찾기</Text>
        </HStack>
        <Link destination={a.tel}>
          <HStack spacing={10} alignment="center">
            <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent), frame({ width: 48 })]}>
              {a.num}
            </Text>
            <Text modifiers={[font({ weight: 'semibold', size: 15 }), foregroundStyle(ink), lineLimit(1)]}>
              {a.title}
            </Text>
            <Spacer />
            <Image
              systemName="phone.fill"
              size={13}
              color={accent}
              modifiers={[padding({ all: 9 }), background(softAccent), cornerRadius(16)]}
            />
          </HStack>
        </Link>
        {b ? <Divider modifiers={[background(divider)]} /> : null}
        {b ? (
          <Link destination={b.tel}>
            <HStack spacing={10} alignment="center">
              <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent), frame({ width: 48 })]}>
                {b.num}
              </Text>
              <Text modifiers={[font({ weight: 'semibold', size: 15 }), foregroundStyle(ink), lineLimit(1)]}>
                {b.title}
              </Text>
              <Spacer />
              <Image
                systemName="phone.fill"
                size={13}
                color={accent}
                modifiers={[padding({ all: 9 }), background(softAccent), cornerRadius(16)]}
              />
            </HStack>
          </Link>
        ) : null}
        {c ? <Divider modifiers={[background(divider)]} /> : null}
        {c ? (
          <Link destination={c.tel}>
            <HStack spacing={10} alignment="center">
              <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent), frame({ width: 48 })]}>
                {c.num}
              </Text>
              <Text modifiers={[font({ weight: 'semibold', size: 15 }), foregroundStyle(ink), lineLimit(1)]}>
                {c.title}
              </Text>
              <Spacer />
              <Image
                systemName="phone.fill"
                size={13}
                color={accent}
                modifiers={[padding({ all: 9 }), background(softAccent), cornerRadius(16)]}
              />
            </HStack>
          </Link>
        ) : null}
      </VStack>
    );
  }

  return (
    <VStack
      spacing={9}
      alignment="leading"
      modifiers={[padding({ all: 14 }), containerBackground(bg, 'widget')]}
    >
      <HStack>
        {brand}
        <Spacer />
        <Text modifiers={[font({ weight: 'semibold', size: 13 }), foregroundStyle(muted)]}>즐겨찾기</Text>
      </HStack>
      <HStack spacing={8}>
        <Link destination={a.tel}>
          <VStack
            spacing={5}
            alignment="leading"
            modifiers={[
              padding({ all: 10 }),
              background(softAccent),
              cornerRadius(16),
              frame({ minHeight: 76 }),
              containerRelativeFrame({ axes: 'horizontal', count: 2, span: 1, spacing: 8 }),
            ]}
          >
            <HStack>
              <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent)]}>{a.num}</Text>
              <Spacer />
              <Image systemName="phone.fill" size={13} color={accent} />
            </HStack>
            <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink), lineLimit(1)]}>
              {a.title}
            </Text>
          </VStack>
        </Link>
        {b ? (
          <Link destination={b.tel}>
            <VStack
              spacing={5}
              alignment="leading"
              modifiers={[
                padding({ all: 10 }),
                background(softAccent),
                cornerRadius(16),
                frame({ minHeight: 76 }),
                containerRelativeFrame({ axes: 'horizontal', count: 2, span: 1, spacing: 8 }),
              ]}
            >
              <HStack>
                <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent)]}>{b.num}</Text>
                <Spacer />
                <Image systemName="phone.fill" size={13} color={accent} />
              </HStack>
              <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink), lineLimit(1)]}>
                {b.title}
              </Text>
            </VStack>
          </Link>
        ) : (
          <Spacer />
        )}
      </HStack>
      {c || d ? (
        <HStack spacing={8}>
          {c ? (
            <Link destination={c.tel}>
              <VStack
                spacing={5}
                alignment="leading"
                modifiers={[
                  padding({ all: 10 }),
                  background(softAccent),
                  cornerRadius(16),
                  frame({ minHeight: 76 }),
                  containerRelativeFrame({ axes: 'horizontal', count: 2, span: 1, spacing: 8 }),
                ]}
              >
                <HStack>
                  <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent)]}>{c.num}</Text>
                  <Spacer />
                  <Image systemName="phone.fill" size={13} color={accent} />
                </HStack>
                <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink), lineLimit(1)]}>
                  {c.title}
                </Text>
              </VStack>
            </Link>
          ) : (
            <Spacer />
          )}
          {d ? (
            <Link destination={d.tel}>
              <VStack
                spacing={5}
                alignment="leading"
                modifiers={[
                  padding({ all: 10 }),
                  background(softAccent),
                  cornerRadius(16),
                  frame({ minHeight: 76 }),
                  containerRelativeFrame({ axes: 'horizontal', count: 2, span: 1, spacing: 8 }),
                ]}
              >
                <HStack>
                  <Text modifiers={[font({ weight: 'bold', size: 23 }), foregroundStyle(accent)]}>{d.num}</Text>
                  <Spacer />
                  <Image systemName="phone.fill" size={13} color={accent} />
                </HStack>
                <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(ink), lineLimit(1)]}>
                  {d.title}
                </Text>
              </VStack>
            </Link>
          ) : (
            <Spacer />
          )}
        </HStack>
      ) : null}
      <Spacer />
      <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>필요할 때, 바로 몇번이야?</Text>
    </VStack>
  );
};

export default createWidget('FavoritesWidget', FavoritesWidgetLayout);
