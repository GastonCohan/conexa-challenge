/**
 * Persistencia de IDs de noticias favoritas.
 *
 * ¿Qué hace? Guarda/recupera un array numérico en AsyncStorage tras serializar/deserializar con validación ligera.
 *
 * ¿Por qué así? Desacoplado de React permite probar persistencia sólo en Jest/AppContext efectos sin tocar UI.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites:news';

export const loadFavoriteIds = async (): Promise<number[]> => {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) {
    return [];
  }

  const ids = JSON.parse(raw) as number[];
  return Array.isArray(ids) ? ids : [];
};

export const saveFavoriteIds = async (ids: number[]) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};
