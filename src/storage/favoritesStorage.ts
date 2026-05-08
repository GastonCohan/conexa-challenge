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
