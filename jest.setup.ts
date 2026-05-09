/**
 * Configuración global de Jest antes de ejecutar los tests del proyecto.
 *
 * ¿Qué hace? Sustituye AsyncStorage por el mock oficial y fija expo-localization a inglés estable.
 *
 * ¿Por qué así? Los tests deben ser deterministas sin leer disco real ni depender del locale del equipo.
 */
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', regionCode: 'US' }],
}));
