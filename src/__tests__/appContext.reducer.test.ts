/**
 * Tests unitarios del reducer de AppContext (transiciones puras sin React ni efectos).
 *
 * ¿Qué hace? Comprueba que cada acción modifica loading/refresh/error/noticias/favoritos esperados.
 *
 * ¿Por qué así? Al aislar reducer se valida la máquina de estados antes de mocks de AsyncStorage/red de fetch.
 */
import { Action, AppState, initialState, reducer } from '../context/AppContext';

describe('AppContext reducer', () => {
  it('marks loading state on START_LOADING', () => {
    const baseState: AppState = {
      ...initialState,
      loading: false,
      refreshing: false,
      error: 'some error',
    };

    const nextState = reducer(baseState, { type: 'START_LOADING' });

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('stores payload data on LOAD_SUCCESS', () => {
    const action: Action = {
      type: 'LOAD_SUCCESS',
      payload: {
        news: [{ id: 1, title: 'Title', content: 'Content', image: 'img' }],
        users: [{ id: 1, firstname: 'Ada', lastname: 'Lovelace', email: 'ada@mail.com', phone: '123', avatar: 'avatar' }],
      },
    };

    const nextState = reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.news).toHaveLength(1);
    expect(nextState.users).toHaveLength(1);
  });

  it('marks refreshing state on START_REFRESH without clearing lists', () => {
    const loaded: AppState = {
      ...initialState,
      loading: false,
      refreshing: false,
      news: [{ id: 1, title: 'T', content: 'C', image: 'i' }],
      users: [],
    };

    const nextState = reducer(loaded, { type: 'START_REFRESH' });

    expect(nextState.refreshing).toBe(true);
    expect(nextState.loading).toBe(false);
    expect(nextState.news).toHaveLength(1);
  });

  it('toggles favorites ids on TOGGLE_FAVORITE', () => {
    const firstToggle = reducer(initialState, { type: 'TOGGLE_FAVORITE', payload: 7 });
    expect(firstToggle.favoriteNewsIds).toEqual([7]);

    const secondToggle = reducer(firstToggle, { type: 'TOGGLE_FAVORITE', payload: 7 });
    expect(secondToggle.favoriteNewsIds).toEqual([]);
  });
});
