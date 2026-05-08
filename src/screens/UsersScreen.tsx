import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCard } from '../components/UserCard';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, spacing } from '../theme/tokens';

const PAGE_SIZE = 12;

export const UsersScreen = () => {
  const { users, loading, error } = useAppContext();
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
      <View style={styles.header}>
        <Ionicons name="people" size={20} color={colors.primary} />
        <Text style={styles.headerTitle}>Comunidad</Text>
        <Text style={styles.headerCount}>{users.length}</Text>
      </View>
      <FlatList
        data={paginatedUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UserCard item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <Text style={styles.footerText}>Cargando mas usuarios...</Text>
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
