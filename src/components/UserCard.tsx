/**
 * Tarjeta de usuario: nombre, email, teléfono y avatar.
 *
 * ¿Qué hace? Presenta un ítem de la lista de usuarios usando el tipo `User`.
 *
 * ¿Por qué así? Mantiene markup y estilos de la fila aislados para reutilizar sólo layout en UsersScreen sin lógica extra.
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import { fontSize, radius, spacing } from '../theme/tokens';
import { User } from '../types';

type Props = {
  item: User;
};

export const UserCard = ({ item }: Props) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
      </View>
      <Text style={styles.name}>{`${item.firstname} ${item.lastname}`.trim()}</Text>
    </View>
    <View style={styles.row}>
      <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
      <Text style={styles.info}>{item.email}</Text>
    </View>
    <View style={styles.row}>
      <Ionicons name="call-outline" size={14} color={colors.textMuted} />
      <Text style={styles.info}>{item.phone}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    ...globalStyles.cardBase,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
  },
  info: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});
