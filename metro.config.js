/**
 * Configuración de Metro (bundler de React Native / Expo).
 *
 * ¿Qué hace? Intercepta la resolución del paquete `react-i18next` y fuerza la entrada CommonJS.
 *
 * ¿Por qué así? react-i18next v17 puede publicar ESM con especificadores que Metro no resuelve bien;
 * apuntar a `dist/commonjs` evita fallos de bundle en algunos entornos.
 */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const reactI18nextCommonJs = path.resolve(
  __dirname,
  'node_modules/react-i18next/dist/commonjs/index.js',
);

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-i18next') {
    return { type: 'sourceFile', filePath: reactI18nextCommonJs };
  }
  if (typeof upstreamResolveRequest === 'function') {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
