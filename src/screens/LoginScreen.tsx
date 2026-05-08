import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { validateLoginInput } from '../utils/loginValidation';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, radius, spacing } from '../theme/tokens';

export const LoginScreen = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mapValidationError = (code: string) => {
    if (code === 'INVALID_EMAIL') {
      return t('login.errorEmail');
    }
    if (code === 'INVALID_PASSWORD') {
      return t('login.errorPassword');
    }
    return t('login.errorInvalid');
  };

  const onSubmit = async () => {
    setError(null);
    const issue = validateLoginInput(email, password);
    if (issue) {
      setError(mapValidationError(issue));
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      setError(mapValidationError(code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="newspaper" size={36} color={colors.primaryDark} />
          </View>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('login.emailPlaceholder')}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
            editable={!busy}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('login.passwordPlaceholder')}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, styles.inputSpacing]}
            editable={!busy}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.buttonLabel}>{t('login.submit')}</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.hint}>{t('login.hint')}</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    ...globalStyles.cardBase,
    gap: spacing.xs,
  },
  input: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputSpacing: {
    marginTop: spacing.md,
  },
  error: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md + 2,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  hint: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
