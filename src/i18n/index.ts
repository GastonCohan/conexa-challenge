/**
 * Inicialización de i18next + bridge React (`react-i18next`) y glue con AsyncStorage / locale nativo.
 *
 * ¿Qué hace? Carga JSON en/es; arranca idioma desde dispositivo; `hydrateLanguagePreference` aplica idioma guardado;
 * `persistLanguage` sincroniza almacén + runtime.
 *
 * ¿Por qué así? Centralizar aquí permite que App.tsx sólo espere hidratación asíncrona y que Settings no conozca claves ni API de i18n.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export const LANGUAGE_STORAGE_KEY = 'app:language:v1';

const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

const resolveDeviceLanguage = (): string => {
  const code = Localization.getLocales()[0]?.languageCode;
  return code === 'es' ? 'es' : 'en';
};

void i18n.use(initReactI18next).init({
  resources,
  lng: resolveDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export async function hydrateLanguagePreference(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'es') {
      await i18n.changeLanguage(stored);
    }
  } catch {
    // ignore read errors
  }
}

export async function persistLanguage(language: 'en' | 'es'): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
}

export default i18n;
