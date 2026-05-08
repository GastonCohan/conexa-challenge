import React, { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';
import { fetchNews, fetchUsers } from '../api/client';
import { loadFavoriteIds, saveFavoriteIds } from '../storage/favoritesStorage';
import { News, User } from '../types';

type AppState = {
  news: News[];
  users: User[];
  favoriteNewsIds: number[];
  loading: boolean;
  error: string | null;
};

type AppContextValue = AppState & {
  refreshData: () => Promise<void>;
  toggleFavorite: (newsId: number) => void;
  isFavorite: (newsId: number) => boolean;
};

type Action =
  | { type: 'START_LOADING' }
  | { type: 'LOAD_SUCCESS'; payload: { news: News[]; users: User[] } }
  | { type: 'LOAD_FAVORITES'; payload: number[] }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'LOAD_ERROR'; payload: string };

const initialState: AppState = {
  news: [],
  users: [],
  favoriteNewsIds: [],
  loading: true,
  error: null,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
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
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshData = async () => {
    dispatch({ type: 'START_LOADING' });
    try {
      const [news, users] = await Promise.all([fetchNews(), fetchUsers()]);
      dispatch({ type: 'LOAD_SUCCESS', payload: { news, users } });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
    [state],
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
