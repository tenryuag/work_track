# Guía de Internacionalización (i18n) - WorkTrack

Esta guía explica cómo usar y extender el sistema de internacionalización implementado en WorkTrack.

## Características

- ✅ Soporte para Japonés (ja) y English (en)
- ✅ Selector de idioma en el header de la aplicación
- ✅ Selector de idioma en la pantalla de login
- ✅ Persistencia del idioma seleccionado en localStorage
- ✅ Cambio de idioma en tiempo real sin recargar
- ✅ Sistema extensible para agregar más idiomas

## Archivos del Sistema

### 1. Traducciones
**Ubicación**: `src/i18n/translations.ts`

Este archivo contiene todas las traducciones organizadas por idioma:

```typescript
export const translations = {
  ja: {
    // Traducciones en japonés
    appName: 'WorkTrack',
    login: 'ログイン',
    email: 'メールアドレス',
    // ...más traducciones
  },
  en: {
    // Traducciones en inglés
    appName: 'WorkTrack',
    login: 'Login',
    email: 'Email Address',
    // ...más traducciones
  },
};
```

### 2. Context de Idioma
**Ubicación**: `src/context/LanguageContext.tsx`

Proporciona el contexto global del idioma y la función de traducción `t()`.

### 3. Helpers de Traducción
**Ubicación**: `src/utils/translationHelpers.ts`

Funciones auxiliares para traducir valores dinámicos como prioridades y estados.

## Cómo Usar las Traducciones

### En Componentes Funcionales

```typescript
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('appName')}</h1>
      <p>{t('email')}</p>
      {/* Con parámetros */}
      <p>{t('totalOrders', { count: 5 })}</p>
    </div>
  );
};
```

### API del Hook `useLanguage`

```typescript
const { t, language, setLanguage } = useLanguage();
```

- **`t(key, params?)`**: Función de traducción
  - `key`: Clave de la traducción (ej: 'login', 'email')
  - `params`: Objeto opcional con parámetros para reemplazar en el texto

- **`language`**: Idioma actual ('ja' | 'en')

- **`setLanguage(lang)`**: Cambiar el idioma actual

## Componentes Ya Actualizados

Los siguientes componentes ya están usando el sistema de traducciones:

1. ✅ **Layout** (`src/components/Layout.tsx`)
   - Selector de idioma en el header (dropdown)
   - Título de la aplicación
   - Nombre del rol del usuario
   - Botón de logout

2. ✅ **Login** (`src/pages/Login.tsx`)
   - Selector de idioma (botón toggle)
   - Todos los labels y botones
   - Mensajes de error

## Actualizar Otros Componentes

### Ejemplo: Actualizar HomePage

**Paso 1**: Importar el hook useLanguage

```typescript
import { useLanguage } from '../context/LanguageContext';
```

**Paso 2**: Usar el hook en el componente

```typescript
const HomePage = () => {
  const { t } = useLanguage();
  // ... resto del código
```

**Paso 3**: Reemplazar textos estáticos con llamadas a `t()`

**Antes:**
```typescript
<h2>生産注文</h2>
<button>新規注文</button>
```

**Después:**
```typescript
<h2>{t('productionOrders')}</h2>
<button>{t('newOrder')}</button>
```

### Para Valores Dinámicos (Prioridad, Estado)

**Opción 1**: Usar `translationHelpers.ts`

```typescript
import { getPriorityLabel, getStatusLabel } from '../utils/translationHelpers';

const OrderCard = ({ order }) => {
  const { t } = useLanguage();

  return (
    <div>
      <span>{getPriorityLabel(order.priority, t)}</span>
      <span>{getStatusLabel(order.status, t)}</span>
    </div>
  );
};
```

**Opción 2**: Actualizar `helpers.ts`

Puedes modificar `src/utils/helpers.ts` para recibir la función `t`:

```typescript
// Antes
export const getPriorityLabel = (priority: OrderPriority): string => {
  const labels: Record<OrderPriority, string> = {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低',
  };
  return labels[priority];
};

// Después
export const getPriorityLabel = (priority: OrderPriority, t: (key: string) => string): string => {
  const labels: Record<OrderPriority, string> = {
    HIGH: t('high'),
    MEDIUM: t('medium'),
    LOW: t('low'),
  };
  return labels[priority];
};
```

## Agregar Nuevas Traducciones

### Paso 1: Agregar la clave en `translations.ts`

```typescript
export const translations = {
  ja: {
    // ... traducciones existentes
    myNewKey: '新しいテキスト',
  },
  en: {
    // ... traducciones existentes
    myNewKey: 'New Text',
  },
};
```

### Paso 2: Actualizar el tipo TypeScript

El tipo `TranslationKey` se genera automáticamente, por lo que tu nueva clave estará disponible inmediatamente con autocompletado.

### Paso 3: Usar la nueva traducción

```typescript
<p>{t('myNewKey')}</p>
```

## Traducciones con Parámetros

Algunas traducciones necesitan valores dinámicos:

```typescript
// En translations.ts
totalOrders: '全 {count} 件の注文',  // Japonés
totalOrders: 'Total {count} orders',  // Inglés

// En el componente
<p>{t('totalOrders', { count: orders.length })}</p>
```

El sistema reemplazará `{count}` con el valor proporcionado.

## Componentes Pendientes de Actualizar

Para completar la internacionalización, actualiza los siguientes componentes siguiendo los ejemplos anteriores:

### Alta Prioridad
1. **HomePage** (`src/pages/HomePage.tsx`)
2. **NewOrder** (`src/pages/NewOrder.tsx`)
3. **OrderDetail** (`src/pages/OrderDetail.tsx`)
4. **OrderCard** (`src/components/OrderCard.tsx`)

### Media Prioridad
5. `src/utils/helpers.ts` - Actualizar funciones de formato

## Agregar un Nuevo Idioma

Para agregar soporte para un nuevo idioma (ej: Español):

### Paso 1: Agregar traducciones

```typescript
// En translations.ts
export const translations = {
  ja: { /* ... */ },
  en: { /* ... */ },
  es: {  // Nuevo
    appName: 'WorkTrack',
    login: 'Iniciar sesión',
    email: 'Correo electrónico',
    // ... todas las traducciones
  },
};
```

### Paso 2: Actualizar el tipo Language

```typescript
export type Language = 'ja' | 'en' | 'es';
```

### Paso 3: Actualizar el selector de idioma

En `Layout.tsx` y `Login.tsx`, agregar la opción para español:

```typescript
<button onClick={() => handleLanguageChange('es')}>
  Español
</button>
```

## Mejores Prácticas

1. **Nombres de claves descriptivos**: Usa nombres claros como `productName` en lugar de `prod` o `name1`

2. **Organización**: Agrupa traducciones relacionadas con prefijos comunes:
   ```typescript
   order_create: 'Create Order',
   order_edit: 'Edit Order',
   order_delete: 'Delete Order',
   ```

3. **Consistencia**: Usa el mismo formato para traducciones similares

4. **Valores por defecto**: Siempre proporciona un valor por defecto para `t()`:
   ```typescript
   setError(err.response?.data?.message || t('loginFailed'));
   ```

5. **Evita HTML en traducciones**: Mantén las traducciones como texto plano

## Debugging

Si una traducción no aparece:

1. Verifica que la clave existe en `translations.ts` para ambos idiomas
2. Confirma que estás usando `t()` correctamente
3. Revisa la consola del navegador por errores
4. Verifica que el componente está dentro de `LanguageProvider`

## Estado Actual

### ✅ Completado
- Sistema base de i18n
- Context y Provider
- Selector de idioma en Layout
- Selector de idioma en Login
- Login completamente traducido
- Persistencia en localStorage

### 🚧 En Progreso
- Actualización de componentes restantes
- Traducciones de mensajes de error del backend

### 📋 Por Hacer
- Traducciones de fechas (mantener formato japonés/inglés)
- Tests para el sistema de traducciones
- Documentación adicional si se agregan más idiomas

## Recursos

- [React Context API](https://react.dev/reference/react/useContext)
- [Internacionalización en React](https://react.i18next.com/)
- Formato de fechas: `date-fns` ya incluido en el proyecto

---

**Última actualización**: Octubre 2025
**Idiomas soportados**: Japonés (ja), English (en)
