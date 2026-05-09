/**
 * Estado global de la app: noticias, usuarios, favoritos y carga/refresco.
 *
 * ¿Qué hace? Expone reducer + efectos para fetch inicial/refresh con caché, carga IDs favoritos desde AsyncStorage
 * y guarda cambios cuando el usuario marca/desmarca favoritos (tras el primer loading).
 *
 * ¿Por qué así? useReducer agrupa transiciones claras (LOAD_SUCCESS, START_REFRESH…); Context evita prop drilling;
 * refresco “silencioso” tras pull usa refreshing en lugar de pantalla bloqueante entera cuando ya hay datos en memoria.
 */
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { fetchNews, fetchUsers, invalidateNewsUsersCache } from '../api/client';
import { loadFavoriteIds, saveFavoriteIds } from '../storage/favoritesStorage';
import { News, User } from '../types';

export type AppState = {
  news: News[];
  users: User[];
  favoriteNewsIds: number[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

type AppContextValue = AppState & {
  refreshData: (options?: { bypassCache?: boolean }) => Promise<void>;
  toggleFavorite: (newsId: number) => void;
  isFavorite: (newsId: number) => boolean;
};

export type Action =
  | { type: 'START_LOADING' }
  | { type: 'START_REFRESH' }
  | { type: 'LOAD_SUCCESS'; payload: { news: News[]; users: User[] } }
  | { type: 'LOAD_FAVORITES'; payload: number[] }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'LOAD_ERROR'; payload: string };

export const initialState: AppState = {
  news: [],
  users: [],
  favoriteNewsIds: [],
  loading: true,
  refreshing: false,
  error: null,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, refreshing: false, error: null };
    case 'START_REFRESH':
      return { ...state, refreshing: true, error: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        refreshing: false,
        error: null,
        news: action.payload.news,
        users: action.payload.users,
      };
    case 'LOAD_FAVORITES':
      return { ...state, favoriteNewsIds: action.payload };
    case 'TOGGLE_FAVORITE': {
      const exists = state.favoriteNewsIds.includes(action.payload);
      return {
        ...state,
        favoriteNewsIds: exists
          ? state.favoriteNewsIds.filter((id) => id !== action.payload)
          : [...state.favoriteNewsIds, action.payload],
      };
    }
    case 'LOAD_ERROR':
      return { ...state, loading: false, refreshing: false, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hasLoadedOnceRef = useRef(false);

  const refreshData = useCallback(async (options?: { bypassCache?: boolean }) => {
    if (options?.bypassCache) {
      await invalidateNewsUsersCache();
    }
    const silent = Boolean(options?.bypassCache && hasLoadedOnceRef.current);
    dispatch({ type: silent ? 'START_REFRESH' : 'START_LOADING' });
    try {
      const [news, users] = await Promise.all([fetchNews(), fetchUsers()]);
      dispatch({ type: 'LOAD_SUCCESS', payload: { news, users } });
      hasLoadedOnceRef.current = true;
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    loadFavoriteIds()
      .then((ids) => dispatch({ type: 'LOAD_FAVORITES', payload: ids }))
      .catch(() => dispatch({ type: 'LOAD_FAVORITES', payload: [] }));
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveFavoriteIds(state.favoriteNewsIds).catch(() => {
        // No-op: favorites persistence failure should not block app usage.
      });
    }
  }, [state.favoriteNewsIds, state.loading]);

  const isFavorite = (newsId: number) => state.favoriteNewsIds.includes(newsId);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      refreshData,
      toggleFavorite: (newsId: number) => dispatch({ type: 'TOGGLE_FAVORITE', payload: newsId }),
      isFavorite,
    }),
    [state, refreshData],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
