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
