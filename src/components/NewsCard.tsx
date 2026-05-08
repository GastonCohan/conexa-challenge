import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, radius, spacing } from '../theme/tokens';
import { News } from '../types';

type Props = {
  item: News;
  isFavorite: boolean;
  isTopStory?: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export const NewsCard = ({
  item,
  isFavorite,
  isTopStory = false,
  onPress,
  onToggleFavorite,
}: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.overlayActions}>
      {isTopStory ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Top Story</Text>
        </View>
      ) : null}
      <Pressable
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={isFavorite ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={isFavorite ? colors.surface : colors.primaryDark}
        />
      </Pressable>
    </View>
    <View style={styles.content}>
      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>
      <Text numberOfLines={3} style={styles.body}>
        {item.content}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    ...globalStyles.cardBase,
    borderRadius: radius.xl,
    padding: 0,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 190,
  },
  overlayActions: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 2,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.surface,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md + 2,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg + 1,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 20,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
});
