# React Native News Challenge

Aplicacion mobile desarrollada con React Native + Expo para el challenge tecnico.

## Requisitos cumplidos

- Lista de noticias con buscador por titulo o contenido.
- Pantalla de detalle para cada noticia.
- Lista de usuarios.
- Seccion de favoritas.
- Estado global de la app.
- Persistencia local de favoritas.
- Cards de noticias con titulo, contenido e imagen.
- Cards de usuarios con nombre/apellido, email y telefono.

## Stack y decisiones tecnicas

- **Expo + React Native + TypeScript**
- **React Navigation**
  - `Bottom Tabs` para `Noticias`, `Favoritas`, `Usuarios`.
  - `Native Stack` para pantalla de detalle.
- **Context API + useReducer**
  - Estado global centralizado para noticias, usuarios, favoritos, loading y error.
- **AsyncStorage**
  - Persistencia de favoritos.
  - Cache con TTL de 5 minutos.

## Arquitectura de carpetas

```txt
src/
  api/            # cliente HTTP, normalizacion y cache
  components/     # componentes reutilizables
  context/        # estado global
  navigation/     # tabs y stack
  screens/        # Home, NewsDetail, Users
  storage/        # persistencia local
  theme/          # colores, tokens y estilos globales
  types.ts        # tipos compartidos
```

## Fuentes de datos

- Noticias y usuarios:
  - [JSONPlaceholder.org](https://www.jsonplaceholder.org/)
  - Endpoints: `/posts`, `/users`
- Imagenes de noticias:
  - [JSONPlaceholder Photos](https://jsonplaceholder.typicode.com/photos) + fallback a `picsum.photos`
- Avatares de usuarios:
  - [Random User API](https://randomuser.me/)

## Funcionalidades implementadas

### Noticias

- Busqueda local por titulo y contenido.
- Paginado incremental (infinite scroll) para mejorar render/performance.
- Loading visual al cargar mas items.
- Pull to refresh.
- Accion de favorito por icono.
- Badge `Top Story` en noticias destacadas.

### Detalle de noticia

- Imagen principal, titulo y contenido completo.
- Toggle de favorito en la esquina superior derecha.
- Header con boton de volver personalizado.

### Usuarios

- Lista con datos principales y avatar.
- Paginado incremental con loading de "cargando mas usuarios".

### Favoritas

- Tab dedicado que reutiliza la pantalla de noticias filtrando solo favoritas.

## UI y estilos

- Sistema de tema centralizado en:
  - `src/theme/colors.ts`
  - `src/theme/tokens.ts`
  - `src/theme/globalStyles.ts`
- Safe areas aplicadas para respetar margenes en dispositivos con notch/bordes.

## Como ejecutar

```bash
npm install
npx expo start -c
```

Luego abrir en:

- Emulador Android (`a` en consola Expo)
- iOS Simulator (solo macOS)
- Expo Go (QR)

## Scripts disponibles

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`

## Calidad y buenas practicas aplicadas

- Arquitectura por capas y separacion de responsabilidades.
- Tipado estricto en TypeScript.
- Componentes reutilizables.
- Normalizacion defensiva de datos de APIs.
- Manejo de estados de carga/error.
- Cache local + paginado para experiencia mas fluida.

## Extra points cubiertos

- **Data caching**: implementado con AsyncStorage + TTL.
- **Performance UX**: paginado incremental en noticias y usuarios.

## Mejoras futuras

- Tests unitarios (reducers, mappers y componentes).
- Login flow.
- Multi-idioma (i18n).
- Skeleton loaders y micro-animaciones.
