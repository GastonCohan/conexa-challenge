/**
 * Contratos tipados compartidos y rutas tipadas para React Navigation.
 *
 * ¿Qué hace? Define formas News/User y parametrización de stacks/tabs (`RootStackParamList`, `HomeTabParamList`).
 *
 * ¿Por qué así? Tipos únicos garantizan que API, reducer y navegación usen los mismos nombres de campos/rutas.
 */
export type News = {
  id: number;
  title: string;
  content: string;
  image: string;
  publishedAt?: string;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  avatar: string;
};

export type RootStackParamList = {
  Tabs: undefined;
  NewsDetail: { newsId: number };
};

export type HomeTabParamList = {
  Home: { onlyFavorites?: boolean } | undefined;
  Favorites: { onlyFavorites?: boolean } | undefined;
  Users: undefined;
  Settings: undefined;
};
