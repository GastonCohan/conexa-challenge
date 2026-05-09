/**
 * Persistencia mínima de sesión demo (email + token mock) en AsyncStorage.
 *
 * ¿Qué hace? Guarda/leer/borrar sesión como JSON para que el usuario permanezca logueado entre reinicios de app.
 *
 * ¿Por qué así? Mantener lectura/escritura en un módulo aparte permite mockear AsyncStorage en tests y no mezclar
 * formato con la lógica de AuthContext.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'auth:session:v1';

export type AuthSession = {
  email: string;
  token: string;
};

export const loadAuthSession = async (): Promise<AuthSession | null> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed?.email && parsed?.token) {
      return parsed;
    }
  } catch {
    // ignore malformed storage
  }
  return null;
};

export const saveAuthSession = async (session: AuthSession): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearAuthSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
