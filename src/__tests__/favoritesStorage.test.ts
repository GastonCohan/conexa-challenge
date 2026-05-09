/**
 * Contrato smoke de favoritesStorage sobre el mock global de AsyncStorage.
 *
 * ¿Qué hace? Serializa/leer lista de IDs antes/después del clear en cada caso.
 *
 * ¿Por qué así? Cubre formato JSON real que AppContext espera antes de efectos asíncronos de guardado favoritos.
 */
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
