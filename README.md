# React Native News Challenge

Aplicación móvil desarrollada con React Native + Expo (SDK ~54) para el challenge técnico.

## Requisitos cumplidos

- Lista de noticias con buscador por título o contenido.
- Pantalla de detalle para cada noticia.
- Lista de usuarios.
- Sección de favoritas.
- Estado global de la app.
- Persistencia local de favoritas.
- Cards de noticias con título, contenido e imagen.
- Cards de usuarios con nombre/apellido, email y teléfono.

## Stack y decisiones técnicas

- **Expo + React Native + TypeScript** (React 19)
- **React Navigation**
  - `Bottom Tabs` para `Noticias`, `Favoritas`, `Usuarios`, `Ajustes`.
  - `Native Stack` para pantalla de detalle (tras iniciar sesión).
- **Context API + useReducer** (`AppContext`)
  - Estado global centralizado para noticias, usuarios, favoritos, loading y error.
- **`AuthContext`**
  - Sesión demo (mock) persistida; la app muestra login hasta hidratar y validar usuario.
- **AsyncStorage**
  - Persistencia de favoritos, preferencia de idioma y sesión de login (demo).
  - Caché de listas de noticias y usuarios con TTL de 5 minutos; invalidación en pull-to-refresh.
- **i18n**: `i18next` + `react-i18next` + `expo-localization`; español e inglés con preferencia guardada.
- **Metro** (`metro.config.js`): alias de `react-i18next` a CommonJS para compatibilidad con el bundler de Expo.

## Arquitectura de carpetas

```txt
src/
  api/            # cliente HTTP, normalización y caché
  components/     # componentes reutilizables
  context/        # AppContext (estado global) y AuthContext (sesión demo)
  i18n/           # traducciones (en/es) e inicialización
  navigation/     # MainNavigator (tabs + stack principal)
  screens/        # Home, NewsDetail, Users, Login, Settings
  storage/        # favoritos y sesión mock
  theme/          # colores, tokens y estilos globales
  types.ts        # tipos compartidos
```

## Fuentes de datos

- Noticias y usuarios:
  - [JSONPlaceholder.org](https://www.jsonplaceholder.org/)
  - Endpoints: `/posts`, `/users`
- Imágenes de noticias:
  - [JSONPlaceholder Photos](https://jsonplaceholder.typicode.com/photos) + fallback a `picsum.photos`
- Avatares de usuarios:
  - [Random User API](https://randomuser.me/)

## Funcionalidades implementadas

### Arranque de la app

- Hidratación del idioma guardado y de la sesión antes de mostrar la UI principal.
- Pantalla de carga mientras se resuelve i18n y el estado de autenticación.

### Noticias

- Búsqueda local por título y contenido.
- Paginado incremental (infinite scroll) para mejorar render/performance.
- Loading visual al cargar más items.
- Pull to refresh.
- Acción de favorito por icono.
- Badge `Top Story` en noticias destacadas.

### Detalle de noticia

- Imagen principal, título y contenido completo.
- Toggle de favorito en la esquina superior derecha.
- Header con botón de volver personalizado.

### Usuarios

- Lista con datos principales y avatar.
- Paginado incremental con loading de "cargando más usuarios".
- Pull to refresh con invalidación de caché (misma petición que en noticias).

### Favoritas

- Tab dedicado que reutiliza la pantalla de noticias filtrando solo favoritas.

### Login (extra)

- Pantalla inicial de acceso con validación de **correo** (formato `usuario@dominio.ext`) y **contraseña** (mínimo 8 caracteres, al menos una letra y un número).
- La sesión se guarda en AsyncStorage; **Cerrar sesión** en la pestaña Ajustes.

### Multi-idioma (extra)

- Textos de UI en **español** e **inglés** (tabs, búsqueda, errores, login, ajustes).
- Detección según idioma del dispositivo; cambio manual en **Ajustes** y persistencia.

### Ajustes

- Selector de idioma y cierre de sesión.

## UI y estilos

- Sistema de tema centralizado en:
  - `src/theme/colors.ts`
  - `src/theme/tokens.ts`
  - `src/theme/globalStyles.ts`
- Safe areas aplicadas para respetar márgenes en dispositivos con notch/bordes.

## Cómo ejecutar

```bash
npm install
npx expo start -c
```

Luego abrir en:

- Emulador Android (`a` en consola Expo)
- iOS Simulator (solo macOS)
- Expo Go (QR)

## Scripts disponibles

- `npm run start` — servidor de desarrollo Expo
- `npm run android` / `npm run ios` / `npm run web`
- `npm run test` — suite Jest (`jest-expo`)
- `npm run test:watch` — Jest en modo watch

## Tests

- **Reducer de app**: `src/__tests__/appContext.reducer.test.ts`
- **Validación de login**: `src/__tests__/loginValidation.test.ts`
- **Almacenamiento de favoritos**: `src/__tests__/favoritesStorage.test.ts`

## Calidad y buenas prácticas aplicadas

- Arquitectura por capas y separación de responsabilidades.
- Tipado estricto en TypeScript.
- Componentes reutilizables.
- Normalización defensiva de datos de APIs.
- Manejo de estados de carga/error.
- Caché local + paginado para experiencia más fluida.

## Extra points cubiertos

- **Data caching**: AsyncStorage + TTL (5 min) para noticias y usuarios; **pull-to-refresh** fuerza nueva petición (`invalidateNewsUsersCache`).
- **Login flow**: flujo demo con sesión persistida y navegación condicional antes del contenido principal (`AppProvider` solo tras login).
- **Multi-idioma (i18n)**: ES/EN con `i18next`, recursos en `src/i18n/locales/` y preferencia en AsyncStorage.
- **Performance UX**: paginado incremental en noticias y usuarios.

## Mejoras futuras

- Ampliar cobertura de tests (pantallas con navegación e i18n).
- Skeleton loaders y micro-animaciones.
- OAuth o backend real para login.
