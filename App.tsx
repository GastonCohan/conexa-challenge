/**
 * Raíz de la app Expo: monta navegación, i18n, áreas seguras y autenticación.
 *
 * ¿Qué hace? Muestra un loader hasta hidratar idioma; luego hasta hidratar la sesión;
 * si no hay usuario muestra Login; si hay usuario monta AppProvider + MainNavigator bajo NavigationContainer.
 *
 * ¿Por qué así? Separa bootstrap (i18n/auth) del estado de datos (AppContext) para no cargar noticias
 * ni favoritos hasta que el usuario esté “dentro”, y mantiene un solo árbol de navegación activo.
 */
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import i18n, { hydrateLanguagePreference } from './src/i18n';
import { MainNavigator } from './src/navigation/MainNavigator';
import { LoginScreen } from './src/screens/LoginScreen';
import { colors } from './src/theme/colors';

const AppNavigationGate = () => {
  const { hydrated, user } = useAuth();

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
};

export default function App() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    void hydrateLanguagePreference().finally(() => setI18nReady(true));
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          {!i18nReady ? (
            <View style={styles.boot}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigationGate />
            </NavigationContainer>
          )}
        </AuthProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
