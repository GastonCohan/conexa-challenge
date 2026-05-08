import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fontSize, radius, spacing } from './tokens';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  cardBase: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    marginTop: spacing.md + 2,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  sectionCount: {
    marginLeft: 'auto',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.primaryDark,
    fontWeight: '700',
    minWidth: spacing.xxl,
    textAlign: 'center',
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.round,
  },
});
