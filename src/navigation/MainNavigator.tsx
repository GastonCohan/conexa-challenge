/**
 * Navegación principal tras login: Bottom Tabs + Stack para detalle de noticia.
 *
 * ¿Qué hace? Define Home/Favorites (misma pantalla con params), Users, Settings en tabs; empila `NewsDetail` con header custom.
 *
 * ¿Por qué así? Stack raíz permite navegar al detalle preservando tabs; títulos/i18n desde `useTranslation` evitan strings fijos.
 */
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { NewsDetailScreen } from '../screens/NewsDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UsersScreen } from '../screens/UsersScreen';
import { colors } from '../theme/colors';
import { radius } from '../theme/tokens';
import { HomeTabParamList, RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 64,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="newspaper-outline" size={size} color={color} />;
          }
          if (route.name === 'Favorites') {
            return <Ionicons name="bookmark-outline" size={size} color={color} />;
          }
          if (route.name === 'Users') {
            return <Ionicons name="people-outline" size={size} color={color} />;
          }
          return <Ionicons name="settings-outline" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.news') }} />
      <Tab.Screen
        name="Favorites"
        component={HomeScreen}
        initialParams={{ onlyFavorites: true }}
        options={{ title: t('tabs.favorites') }}
      />
      <Tab.Screen name="Users" component={UsersScreen} options={{ title: t('tabs.users') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('tabs.settings') }} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={({ navigation }) => ({
          title: t('newsDetail.headerTitle'),
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: () => (
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color={colors.primaryDark} />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
