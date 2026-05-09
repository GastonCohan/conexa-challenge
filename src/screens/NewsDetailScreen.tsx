/**
 * Detalle de noticia seleccionado por ID en rutas (`newsId`).
 *
 * ¿Qué hace? Busca la noticia en memoria (`AppContext.news`); permite toggle favorito desde header/embed.
 *
 * ¿Por qué así? Resolver por ID evita pasar payloads grandes por params del stack tipado en `RootStackParamList`.
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, radius, spacing } from '../theme/tokens';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

export const NewsDetailScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { news, isFavorite, toggleFavorite } = useAppContext();
  const { newsId } = route.params;

  const item = news.find((entry) => entry.id === newsId);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>{t('newsDetail.notFound')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Pressable
            style={[styles.favoriteButton, isFavorite(item.id) && styles.favoriteButtonActive]}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={isFavorite(item.id) ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isFavorite(item.id) ? colors.surface : colors.primaryDark}
            />
          </Pressable>
        </View>
        <View style={styles.metaBadge}>
          <Ionicons name="flash-outline" size={14} color={colors.primaryDark} />
          <Text style={styles.metaBadgeText}>{t('newsDetail.breaking')}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.screenContainer,
  },
  content: {
    paddingBottom: spacing.xxl - 2,
  },
  heroWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 240,
  },
  metaBadge: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
  },
  metaBadgeText: {
    color: colors.primaryDark,
    fontSize: fontSize.md - 2,
    fontWeight: '700',
  },
  title: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '800',
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    fontSize: fontSize.lg,
    lineHeight: 24,
    color: colors.textMuted,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
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
  centered: {
    ...globalStyles.centeredState,
  },
  notFound: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
