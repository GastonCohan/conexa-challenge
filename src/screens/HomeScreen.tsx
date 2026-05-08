import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { news, loading, error, favoriteNewsIds, toggleFavorite, isFavorite, refreshData } =
    useAppContext();

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder={onlyFavorites ? 'Buscar en favoritas...' : 'Buscar noticias...'}
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
            <Text style={styles.emptyText}>No se encontraron noticias para ese criterio.</Text>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <Text style={styles.footerText}>Cargando mas noticias...</Text>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={colors.primary} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.screenContainer,
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
