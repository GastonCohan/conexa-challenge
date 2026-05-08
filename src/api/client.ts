import AsyncStorage from '@react-native-async-storage/async-storage';
import { News, User } from '../types';

const API_BASE_URL = 'https://www.jsonplaceholder.org';
const PHOTOS_API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const PEOPLE_API_BASE_URL = 'https://randomuser.me/api';
const CACHE_TTL_MS = 5 * 60 * 1000;

type CachedPayload<T> = {
  timestamp: number;
  data: T;
};

const getFallbackImage = (id: number) =>
  `https://picsum.photos/seed/news-${id}/400/240`;
const getFallbackAvatar = (id: number) =>
  `https://i.pravatar.cc/150?img=${(id % 70) + 1}`;

const isLikelyBlockedImageHost = (url: string) =>
  url.includes('dummyimage.com') || url.includes('via.placeholder.com');

const readCache = async <T,>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as CachedPayload<T>;
  if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
    return null;
  }

  return parsed.data;
};

const writeCache = async <T,>(key: string, data: T) => {
  const payload: CachedPayload<T> = {
    timestamp: Date.now(),
    data,
  };
  await AsyncStorage.setItem(key, JSON.stringify(payload));
};

const fetchJson = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

const fetchPhotosJson = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${PHOTOS_API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

const fetchPeopleJson = async <T,>(query: string): Promise<T> => {
  const response = await fetch(`${PEOPLE_API_BASE_URL}${query}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export const fetchNews = async (): Promise<News[]> => {
  const cacheKey = 'cache:news:v2';
  const cached = await readCache<News[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const [posts, photos] = await Promise.all([
    fetchJson<any[]>('/posts'),
    fetchPhotosJson<any[]>('/photos?_limit=100'),
  ]);

  const photosById = new Map<number, string>();
  photos.forEach((photo) => {
    const id = Number(photo.id);
    const url = String(photo.url ?? '');
    if (id && url) {
      photosById.set(id, url);
    }
  });

  const normalized: News[] = posts.map((post) => ({
    // Prefer image from post data, then from photos API, then fallback.
    id: Number(post.id),
    title: String(post.title ?? 'Untitled'),
    content: String(post.content ?? post.body ?? ''),
    image: (() => {
      const postImage = String(post.image ?? '');
      const photoImage = String(photosById.get(Number(post.id)) ?? '');
      if (postImage && !isLikelyBlockedImageHost(postImage)) {
        return postImage;
      }
      if (photoImage && !isLikelyBlockedImageHost(photoImage)) {
        return photoImage;
      }
      return getFallbackImage(Number(post.id));
    })(),
    publishedAt: post.publishedAt ? String(post.publishedAt) : undefined,
  }));

  await writeCache(cacheKey, normalized);
  return normalized;
};

export const fetchUsers = async (): Promise<User[]> => {
  const cacheKey = 'cache:users:v2';
  const cached = await readCache<User[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const [users, peoplePhotos] = await Promise.all([
    fetchJson<any[]>('/users'),
    fetchPeopleJson<any>('?results=100&inc=picture&nat=us,es,br'),
  ]);

  const avatars = Array.isArray(peoplePhotos?.results)
    ? peoplePhotos.results.map((person: any) => String(person?.picture?.large ?? ''))
    : [];

  const normalized: User[] = users.map((user) => ({
    id: Number(user.id),
    firstname: String(user.firstname ?? user.name?.split(' ')[0] ?? ''),
    lastname: String(user.lastname ?? user.name?.split(' ').slice(1).join(' ') ?? ''),
    email: String(user.email ?? ''),
    phone: String(user.phone ?? ''),
    avatar:
      (avatars.length > 0 ? avatars[(Number(user.id) - 1 + avatars.length) % avatars.length] : '') ||
      getFallbackAvatar(Number(user.id)),
  }));

  await writeCache(cacheKey, normalized);
  return normalized;
};
