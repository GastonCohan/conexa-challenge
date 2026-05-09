/**
 * Lista paginada de usuarios desde el estado global cargado junto con noticias.
 *
 * ¿Qué hace? FlatList incremental + refresh que reutiliza `refreshData`; resetea página al cambiar el array de usuarios.
 *
 * ¿Por qué así? Misma fuente (`fetchUsers`) compartida con AppContext evita segunda capa de cache por pantalla.
 */
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCard } from '../components/UserCard';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, spacing } from '../theme/tokens';

const PAGE_SIZE = 12;

export const UsersScreen = () => {
  const { t } = useTranslation();
  const { users, loading, refreshing, error, refreshData } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paginatedUsers = useMemo(() => users.slice(0, visibleCount), [users, visibleCount]);
  const hasMore = visibleCount < users.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [users.length]);

  const loadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, users.length));
      setIsLoadingMore(false);
    }, 450);
  };

  const showBlockingLoader = loading && !refreshing;
  const showBlockingError = Boolean(error) && users.length === 0 && !loading && !refreshing;

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
      {error && users.length > 0 ? (
        <View style={styles.warnBanner}>
          <Text style={styles.warnText}>{t('errors.banner')}</Text>
        </View>
      ) : null}
      <View style={styles.header}>
        <Ionicons name="people" size={20} color={colors.primary} />
        <Text style={styles.headerTitle}>{t('users.community')}</Text>
        <Text style={styles.headerCount}>{users.length}</Text>
      </View>
      <FlatList
        data={paginatedUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UserCard item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshData({ bypassCache: true })}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <Text style={styles.footerText}>{t('users.loadingMore')}</Text>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
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
  header: {
    ...globalStyles.sectionHeader,
  },
  headerTitle: {
    ...globalStyles.sectionTitle,
  },
  headerCount: {
    ...globalStyles.sectionCount,
  },
  listContent: {
    paddingBottom: spacing.lg + 2,
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
  centered: {
    ...globalStyles.centeredState,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.danger,
    textAlign: 'center',
  },
});
