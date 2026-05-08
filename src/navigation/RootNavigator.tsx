import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { NewsDetailScreen } from '../screens/NewsDetailScreen';
import { UsersScreen } from '../screens/UsersScreen';
import { colors } from '../theme/colors';
import { radius } from '../theme/tokens';
import { HomeTabParamList, RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabs = () => (
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
        return <Ionicons name="people-outline" size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Noticias' }} />
    <Tab.Screen
      name="Favorites"
      component={HomeScreen}
      initialParams={{ onlyFavorites: true }}
      options={{ title: 'Favoritas' }}
    />
    <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Usuarios' }} />
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTitleStyle: { fontWeight: '700', color: colors.text },
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen
      name="Tabs"
      component={HomeTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewsDetail"
      component={NewsDetailScreen}
      options={({ navigation }) => ({
        title: 'Detalle',
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
