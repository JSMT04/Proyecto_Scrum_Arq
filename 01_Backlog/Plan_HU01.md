# [APROBADO]

# HU-01 — Consulta de Disponibilidad en Tiempo Real

> **Veredicto del Revisor Técnico Senior — 2026-08-31**
>
> El plan del Planificador es **viable y bien estructurado**. La arquitectura es adecuada para un prototipo HTML/CSS/JS puro y realizable dentro del Sprint de 8 días.
> Se aplican las siguientes **correcciones menores** para eliminar sobreingeniería y reducir riesgo de retraso.

---

## Hallazgos de la auditoría

### ✅ Fortalezas del plan original
- Separación clara de responsabilidades (datos, lógica, UI).
- Modelo de datos simple, bien tipado y alineado con la HU.
- Wireframe ASCII explícito — reduce ambigüedad para el desarrollador.
- Criterios de aceptación verificables y concretos.
- Polling simulado con arquitectura preparada para `fetch()` real.

### ⚠️ Correcciones aplicadas

| # | Observación | Corrección |
|---|-------------|------------|
| 1 | `BloqueHorario.disponible` (boolean) es **redundante** con `BloqueHorario.estado` | **Eliminado.** El campo `estado` es suficiente. Menos confusión para el desarrollador. |
| 2 | Archivo `ui.js` separado de `app.js` añade un archivo extra con solo 1 función exportada | **Fusionado.** Las funciones de renderizado van dentro de `app.js`. Se reduce de 6 a **5 archivos**. |
| 3 | 8 tareas es excesivo para una HU de consulta — la Tarea 8 (pruebas responsivas) se diluye | **Consolidada** con la Tarea 2 (CSS). Las pruebas responsivas son parte natural del styling. Se reduce a **6 tareas**. |
| 4 | No se especifica prioridad cuando un bloque tiene reservas con estado mixto (confirmada + pendiente) | **Añadida regla:** `confirmada` > `pendiente`. Si un bloque tiene ambas, se muestra como "Ocupado". |
| 5 | RF-02 menciona "rango horario" pero el diseño solo muestra bloques fijos de 1h | **Aclarado:** En esta HU la consulta es visual por bloques fijos. No se implementa selector de rango personalizado (eso sería otra HU). |

---

## Plan Pulido — Versión Final para el Desarrollador

---

## Historia de Usuario

**Como** vecino del barrio,
**quiero** consultar la disponibilidad en tiempo real del salón comunal, la cancha y la sala de juntas,
**para** saber si puedo usarlos en el horario deseado.

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | El sistema debe mostrar los **tres espacios** disponibles: Salón Comunal, Cancha y Sala de Juntas. |
| RF-02 | Para cada espacio, el vecino puede seleccionar una **fecha** para consultar la disponibilidad en **bloques fijos de 1 hora** (7:00 – 22:00). |
| RF-03 | El sistema debe indicar visualmente si un bloque horario está **Disponible**, **Ocupado** o **Pendiente de confirmación**. |
| RF-04 | La consulta debe reflejar el **estado actual** de los datos (sin recargar la página manualmente). |
| RF-05 | El vecino puede visualizar la disponibilidad en una **vista de cuadrícula** de 15 bloques de 1h. |
| RF-06 | Cada bloque ocupado o pendiente muestra un **tooltip** al pasar el cursor (ej. "Reservado", sin datos privados). |
| RF-07 | El sistema debe permitir filtrar por espacio desde **pestañas (tabs)**. |

### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | La consulta de disponibilidad debe responder en **menos de 2 segundos**. |
| RNF-02 | La interfaz debe ser **responsiva** (mobile-first), funcional desde 320px. Touch targets mínimos de 44×44px. |
| RNF-03 | Actualización automática cada **30 segundos** (polling con `setInterval`). |
| RNF-04 | Sin autenticación (consulta pública). |
| RNF-05 | Datos simulados en `data.js`; la función de obtención debe ser reemplazable por `fetch()`. |

### Criterios de Aceptación

- [ ] Dado que el vecino selecciona "Salón Comunal" y la fecha de hoy, el sistema muestra los 15 bloques horarios coloreados por estado.
- [ ] Un bloque marcado como "Ocupado" no puede mostrarse como disponible.
- [ ] Al cambiar la fecha con las flechas, la cuadrícula se actualiza sin recargar la página.
- [ ] En móvil (≤480px), los bloques se muestran en columna única y son activables con touch.

---

## 2. Modelo de Datos y Estado

### `Espacio`
```json
{
  "id": "salon_comunal",
  "nombre": "Salón Comunal",
  "icono": "🏛️",
  "capacidad": 80,
  "descripcion": "Salón principal para eventos y reuniones grandes"
}
```

### `Reserva`
```json
{
  "id": "rsv-001",
  "espacioId": "salon_comunal",
  "fecha": "2026-09-05",
  "horaInicio": "09:00",
  "horaFin": "11:00",
  "estado": "confirmada",
  "vecinoId": "vec-042"
}
```
> `estado`: `"confirmada"` | `"pendiente"` | `"cancelada"`

### `BloqueHorario` (derivado en UI)
```json
{
  "hora": "09:00",
  "estado": "ocupado",
  "reservaId": "rsv-001"
}
```
> `estado`: `"disponible"` | `"ocupado"` | `"pendiente"`

### `AppState` (estado global en memoria)
```json
{
  "espacios": [],
  "reservas": [],
  "filtros": {
    "espacioSeleccionado": "salon_comunal",
    "fechaSeleccionada": "2026-09-05"
  },
  "ui": {
    "cargando": false,
    "ultimaActualizacion": "2026-09-05T14:00:00"
  }
}
```

### Reglas de derivación de disponibilidad
1. Generar 15 bloques de 1h: `07:00`, `08:00`, …, `21:00` (cada uno cubre `[HH:00, HH+1:00)`).
2. Para cada bloque, buscar reservas donde `espacioId` coincida, `fecha` coincida, y el rango `[horaInicio, horaFin)` se solape con el bloque.
3. **Prioridad de estado:** `confirmada` > `pendiente`. Si un bloque tiene al menos una reserva confirmada → `"ocupado"`. Si solo tiene pendientes → `"pendiente"`. Sin reservas activas → `"disponible"`.
4. Las reservas con `estado === "cancelada"` se ignoran.

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

### Wireframe

```
┌──────────────────────────────────────────────┐
│  HEADER: 🏠 Centro Comunitario               │
├──────────────────────────────────────────────┤
│  TABS DE ESPACIO:                             │
│  [🏛️ Salón Comunal] [⚽ Cancha] [📋 Sala]    │
├──────────────────────────────────────────────┤
│  SELECTOR DE FECHA:                           │
│  [ ◀ ]  Lunes, 05 Sep 2026  [ ▶ ]            │
├──────────────────────────────────────────────┤
│  LEYENDA:  🟢 Disponible  🔴 Ocupado  🟡 Pend│
├──────────────────────────────────────────────┤
│  CUADRÍCULA:                                  │
│  07:00  ████████████████████  Disponible      │
│  08:00  ████████████████████  Disponible      │
│  09:00  ████████████████████  Ocupado  ←tip   │
│  10:00  ████████████████████  Ocupado         │
│  11:00  ████████████████████  Disponible      │
│  ...                                          │
│  21:00  ████████████████████  Disponible      │
├──────────────────────────────────────────────┤
│  FOOTER: Actualizado hace 12s  [🔄 Actualizar]│
└──────────────────────────────────────────────┘
```

### Tabla de interacciones

| Acción del usuario | Respuesta del sistema |
|---|---|
| Clic en tab de espacio | Actualiza `espacioSeleccionado`, re-renderiza cuadrícula |
| Clic en flecha de fecha | Suma/resta 1 día a `fechaSeleccionada`, re-renderiza |
| Hover sobre bloque Ocupado | Tooltip: "Reservado" |
| Hover sobre bloque Pendiente | Tooltip: "Pendiente de confirmación" |
| Clic en bloque Disponible | Resalta visualmente (sin acción funcional en esta HU) |
| Cada 30 segundos | Re-lectura de datos, actualización de cuadrícula y timestamp |
| Clic en "Actualizar" | Fuerza re-lectura inmediata, reinicia el contador de 30s |

### Paleta de colores

| Estado | Fondo | Texto |
|--------|-------|-------|
| Disponible | `#22c55e` | `#fff` |
| Ocupado | `#ef4444` | `#fff` |
| Pendiente | `#f59e0b` | `#fff` |

---

## 4. Desglose de Tareas de Desarrollo

> 6 tareas. Cada una estimada en **≤ 4 horas**. Orden de ejecución secuencial.

---

### Tarea 1 — Estructura HTML base
**Archivo:** `index.html`
- Crear esqueleto semántico: `<header>`, `<main>`, `<footer>`.
- Secciones: tabs de espacio, selector de fecha, contenedor de cuadrícula, leyenda.
- Vincular `styles.css` y los scripts (`data.js`, `availability.js`, `app.js`).
- **Entregable:** página estática visible en navegador.
- **Estimación:** 2h

---

### Tarea 2 — Diseño visual y responsivo
**Archivo:** `styles.css`
- Variables CSS: `--color-disponible`, `--color-ocupado`, `--color-pendiente`, `--bg`, `--text`.
- Layout con CSS Grid (cuadrícula) y Flexbox (tabs, fecha).
- Estilos de tabs activos/inactivos con transición suave.
- Tooltip con CSS puro (pseudo-elemento `::after` + `data-tooltip`).
- Media queries: breakpoint en 480px (móvil columna única, touch targets 44×44px).
- Verificar en 320px, 768px y 1280px.
- **Entregable:** UI estilizada y responsiva sin lógica.
- **Estimación:** 4h

---

### Tarea 3 — Datos mock
**Archivo:** `data.js`
- Array `espacios` con los 3 espacios (id, nombre, icono, capacidad, descripción).
- Array `reservas` con **8–10 reservas** distribuidas entre los 3 espacios, incluyendo:
  - Al menos 2 confirmadas, 2 pendientes y 1 cancelada.
  - Reservas en fechas diferentes para probar cambio de fecha.
- Función `obtenerDatos()` que retorna `{ espacios, reservas }` (reemplazable por `fetch()`).
- **Entregable:** archivo de datos consumible.
- **Estimación:** 1h

---

### Tarea 4 — Lógica de disponibilidad
**Archivo:** `availability.js`
- `generarBloques()` → array de 15 objetos `{ hora, estado: "disponible", reservaId: null }`.
- `calcularDisponibilidad(espacioId, fechaISO, reservas)` → array de `BloqueHorario` con estados resueltos según reglas de prioridad (`confirmada` > `pendiente`).
- Función auxiliar `seSuperponen(reserva, bloqueHora)` → booleano.
- **Entregable:** módulo de lógica pura (testeable con `console.log`).
- **Estimación:** 3h

---

### Tarea 5 — Controlador principal, renderizado y eventos
**Archivo:** `app.js`
- Inicializar `AppState` al cargar la página (espacio por defecto + fecha de hoy).
- Función `renderCuadricula(bloques)` → genera HTML de la cuadrícula y lo inyecta en el contenedor.
- Clase CSS por estado (`slot-disponible`, `slot-ocupado`, `slot-pendiente`).
- Atributo `data-tooltip` para mostrar tooltip.
- Eventos:
  - `click` en tabs de espacio → actualizar filtro → re-renderizar.
  - `click` en flechas de fecha → sumar/restar día → re-renderizar.
  - `click` en "Actualizar ahora" → forzar re-lectura.
- **Entregable:** flujo funcional completo de consulta de disponibilidad.
- **Estimación:** 4h

---

### Tarea 6 — Polling automático y timestamp
**Archivo:** `app.js` (extensión)
- `setInterval` de 30s que llama a `obtenerDatos()` y re-renderiza.
- Actualizar texto del footer: "Actualizado hace X segundos".
- Botón "Actualizar ahora": ejecuta la actualización e reinicia el `setInterval`.
- **Entregable:** actualización en tiempo real simulada.
- **Estimación:** 2h

---

## Resumen de archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `index.html` | Estructura semántica |
| `styles.css` | Variables, layout, responsivo, tooltip |
| `data.js` | Datos mock + función `obtenerDatos()` |
| `availability.js` | Lógica pura de cálculo de disponibilidad |
| `app.js` | Estado, renderizado, eventos, polling |

> **Estimación total:** ~16 horas de desarrollo (2 días de trabajo efectivo).
> Viable dentro del Sprint de 8 días, dejando margen para las demás HU.

---

> **Estado:** `[APROBADO]` — Plan listo para pasar al Agente 03-Desarrollador.
