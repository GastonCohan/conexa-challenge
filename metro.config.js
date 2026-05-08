const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Metro + react-i18next v17 ESM (explicit .js specifiers) fails to resolve on some setups.
// Point the package entry at CommonJS so Metro follows require()-based graph instead.
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
