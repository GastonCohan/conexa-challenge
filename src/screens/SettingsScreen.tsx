import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { persistLanguage } from '../i18n';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, radius, spacing } from '../theme/tokens';

export const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const current = i18n.language?.startsWith('es') ? 'es' : 'en';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        <View style={styles.rowCard}>
          <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
          <Text style={styles.email}>{user?.email ?? '—'}</Text>
        </View>
        <Text style={styles.note}>{t('settings.mockNote')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.langRow}>
          <Pressable
            style={[styles.langChip, current === 'en' && styles.langChipActive]}
            onPress={() => persistLanguage('en')}
          >
            <Text style={[styles.langLabel, current === 'en' && styles.langLabelActive]}>
              {t('settings.english')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.langChip, current === 'es' && styles.langChipActive]}
            onPress={() => persistLanguage('es')}
          >
            <Text style={[styles.langLabel, current === 'es' && styles.langLabelActive]}>
              {t('settings.spanish')}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.logout} onPress={() => logout()}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>{t('settings.logout')}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.screenContainer,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rowCard: {
    ...globalStyles.cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  email: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  note: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  langChipActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.surfaceMuted,
  },
  langLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textMuted,
  },
  langLabelActive: {
    color: colors.primaryDark,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.danger,
  },
});
