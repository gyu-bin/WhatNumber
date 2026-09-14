import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { telHref, type NumberItem } from '@whatnumber/shared';
import type { AppStyles } from '../styles';
import { NumberVisualIcon } from './NumberVisualIcon';

export function NumberRow({
  item,
  isFavorite,
  onToggleFavorite,
  onOpen,
  styles,
  onDrag,
  isActive,
}: {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: NumberItem) => void;
  styles: AppStyles;
  onDrag?: () => void;
  isActive?: boolean;
}) {
  return (
    <Pressable
      style={[styles.card, isActive ? styles.cardDragging : null]}
      onPress={() => onOpen(item)}
      onLongPress={onDrag}
      delayLongPress={220}
      disabled={isActive}
    >
      <NumberVisualIcon item={item} size={44} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>
          {item.desc}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => onToggleFavorite(item.id)}
          hitSlop={8}
          accessibilityLabel={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          <Text style={[styles.favorite, isFavorite && styles.favoriteActive]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void Linking.openURL(telHref(item.num))}
          style={styles.callBtn}
        >
          <Ionicons name="call" size={13} color={styles.callText.color} />
          <Text style={styles.callText}>{item.num}</Text>
        </Pressable>
        {onDrag ? (
          <Pressable
            onLongPress={onDrag}
            delayLongPress={120}
            hitSlop={10}
            accessibilityLabel="순서 변경"
            style={styles.dragHandle}
          >
            <Ionicons name="reorder-three" size={22} color={styles.dragHandleIcon.color} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export function NumberGridCard({
  item,
  isFavorite,
  onToggleFavorite,
  onOpen,
  styles,
}: {
  item: NumberItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: NumberItem) => void;
  styles: AppStyles;
}) {
  return (
    <Pressable style={styles.gridCard} onPress={() => onOpen(item)}>
      <View style={styles.gridCardTop}>
        <NumberVisualIcon item={item} size={40} />
        <Pressable
          onPress={() => onToggleFavorite(item.id)}
          hitSlop={8}
          accessibilityLabel={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={18}
            color={isFavorite ? styles.favoriteActive.color : styles.favorite.color}
          />
        </Pressable>
      </View>
      <Text style={styles.gridCardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.gridCardDesc} numberOfLines={2}>
        {item.desc}
      </Text>
      <Pressable
        onPress={() => void Linking.openURL(telHref(item.num))}
        style={styles.gridCallBtn}
      >
        <Ionicons name="call" size={13} color={styles.gridCallText.color} />
        <Text style={styles.gridCallText}>{item.num}</Text>
      </Pressable>
    </Pressable>
  );
}
