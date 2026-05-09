/**
 * Campo de búsqueda reutilizable para filtrar listas en memoria (p. ej. noticias).
 *
 * ¿Qué hace? Composición de icono + TextInput controlado; desactiva autocorrección para términos exactos.
 *
 * ¿Por qué así? Patrón controlled component: el padre decide el filtro y puede compartir mismo estilo en tabs distintos.
 */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/tokens';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export const SearchInput = ({ value, onChangeText, placeholder = 'Buscar...' }: Props) => (
  <View style={styles.wrapper}>
    <Ionicons name="search-outline" size={20} color={colors.textMuted} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.input}
      clearButtonMode="while-editing"
      placeholderTextColor={colors.textMuted}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 2,
    fontSize: 16,
    color: colors.text,
  },
});
