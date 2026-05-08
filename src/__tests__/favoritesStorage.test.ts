import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFavoriteIds, saveFavoriteIds } from '../storage/favoritesStorage';

describe('favoritesStorage', () => {
  beforeEach(() => {
    (AsyncStorage as any).clear();
  });

  it('returns empty array when no favorites are stored', async () => {
    await expect(loadFavoriteIds()).resolves.toEqual([]);
  });

  it('saves and reads favorite ids', async () => {
    await saveFavoriteIds([1, 5, 9]);
    await expect(loadFavoriteIds()).resolves.toEqual([1, 5, 9]);
  });
});
