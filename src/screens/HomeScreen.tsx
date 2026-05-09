/**
 * Lista de noticias (home o favoritos): búsqueda, paginación en cliente, pull-to-refresh y navegación al detalle.
 *
 * ¿Qué hace? Lee estado de AppContext; usa `onlyFavorites` vía route para reutilizar pantalla en otro tab.
 *
 * ¿Por qué así? Paginar con `slice` en memoria tras fetch único simplifica UX sin más endpoints; refresh con bypass invalida caché del client.
 */
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsCard } from '../components/NewsCard';
import { SearchInput } from '../components/SearchInput';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, spacing } from '../theme/tokens';

const PAGE_SIZE = 12;

export const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
    news,
    loading,
    refreshing,
    error,
    favoriteNewsIds,
    toggleFavorite,
    isFavorite,
    refreshData,
  } = useAppContext();

  const onlyFavorites =
    Boolean((route.params as { onlyFavorites?: boolean } | undefined)?.onlyFavorites);

  const filteredNews = useMemo(() => {
    const query = search.toLowerCase().trim();
    const baseList = onlyFavorites ? news.filter((item) => favoriteNewsIds.includes(item.id)) : news;
    if (!query) {
      return baseList;
    }
    return baseList.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query),
    );
  }, [search, news, favoriteNewsIds, onlyFavorites]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [search, onlyFavorites, favoriteNewsIds.length, news.length]);

  const topStoryIds = useMemo(() => new Set(filteredNews.slice(0, 3).map((item) => item.id)), [filteredNews]);
  const paginatedNews = useMemo(() => filteredNews.slice(0, visibleCount), [filteredNews, visibleCount]);
  const hasMore = visibleCount < filteredNews.length;

  const loadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredNews.length));
      setIsLoadingMore(false);
    }, 550);
  };

  const showBlockingLoader = loading && !refreshing;
  const showBlockingError = Boolean(error) && news.length === 0 && !loading && !refreshing;

  if (showBlockingLoader) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (showBlockingError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {error && news.length > 0 ? (
        <View style={styles.warnBanner}>
          <Text style={styles.warnText}>{t('errors.banner')}</Text>
        </View>
      ) : null}
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder={onlyFavorites ? t('home.searchFavorites') : t('home.searchNews')}
      />
      <FlatList
        data={paginatedNews}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            isFavorite={isFavorite(item.id)}
            isTopStory={topStoryIds.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>{t('home.empty')}</Text>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <Text style={styles.footerText}>{t('home.loadingMore')}</Text>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshData({ bypassCache: true })}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.screenContainer,
  },
  warnBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.sm + 2,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warnText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  centered: {
    ...globalStyles.centeredState,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.danger,
    textAlign: 'center',
  },
  emptyWrapper: {
    paddingTop: spacing.xxl + spacing.sm,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  footerLoader: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
