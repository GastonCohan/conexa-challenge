/**
 * Punto de entrada nativo de Expo: registra el componente raíz con el runtime correcto.
 *
 * ¿Qué hace? Expone `App` como pantalla principal para Expo Go y builds nativas.
 *
 * ¿Por qué así? `registerRootComponent` unifica AppRegistry/config en iOS/Android y web según Expo.
 */
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
