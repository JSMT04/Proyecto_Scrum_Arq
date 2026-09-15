[APROBADO]

# Plan de Arquitectura — HU07: Historial de Reservas del Vecino

> **Revisado por:** Revisor Técnico Senior
> **Fecha de revisión:** 2026-09-14
> **Veredicto:** ✅ APROBADO con correcciones menores de simplificación

---

## Observaciones de la Revisión

1. **Sobreingeniería eliminada — Botón "Cancelar Reserva" en historial:** El plan original proponía agregar un botón de cancelación dentro de las tarjetas activas. Esto ya está implementado en la HU-03 (Modal de Gestión). Duplicar esa lógica aquí es scope creep y se elimina del alcance de esta HU.
2. **Campo `status` redundante eliminado:** El modelo de datos original propone un campo `status` con valor "activa" o "pasada". Esto es innecesario: el estado se puede **derivar comparando la fecha de la reserva con la fecha actual**. El modelo de datos en `data.js` ya tiene un campo `estado` con valores `pendiente`, `confirmada`, `cancelada`. Reutilizaremos esos valores y calcularemos si la reserva es "futura" o "pasada" por fecha.
3. **Modelo de datos alineado con `data.js` existente:** El esquema propuesto no coincidía con la estructura real de las reservas en `data.js`. El plan pulido usa la estructura existente sin cambios al modelo.
4. **Simplificación del filtrado por usuario:** El prototipo actual no tiene un sistema de autenticación real. Se simulará el filtrado por `vecinoId` usando un valor fijo de prueba, o mejor aún, se mostrará un campo de búsqueda simple por teléfono para identificar las reservas del vecino (coherente con el flujo de la HU-03).

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales

- **RF-01:** El vecino podrá acceder a una vista "Mis Reservas" desde la navegación principal.
- **RF-02:** El sistema solicitará un dato de identificación (teléfono de contacto) para recuperar las reservas asociadas al vecino.
- **RF-03:** Las reservas se mostrarán categorizadas en dos secciones: **Próximas** (fecha ≥ hoy) y **Pasadas** (fecha < hoy).
- **RF-04:** Cada tarjeta de reserva mostrará: espacio (con icono), fecha formateada, horario, código de confirmación, y estado (`pendiente`, `confirmada`, `cancelada`).
- **RF-05:** Si no hay reservas asociadas al teléfono ingresado, se mostrará un mensaje de estado vacío.

### No Funcionales

- **RNF-01 (Usabilidad):** La vista debe ser responsive y coherente con el diseño visual existente (variables CSS, tipografía Inter, cards con glassmorphism).
- **RNF-02 (Rendimiento):** El filtrado de reservas es en memoria (array ya cargado en `data.js`), por lo que la respuesta será instantánea.
- **RNF-03 (Consistencia):** Reutilizar los componentes visuales existentes (`.card`, `.modal-overlay`, `.btn`, `.toast`).

---

## 2. Modelo de Datos y Estado

### Estructura existente de reserva (sin cambios a `data.js`)

```json
{
  "id": "rsv-001",
  "espacioId": "salon_comunal",
  "fecha": "2026-09-14",
  "horaInicio": "09:00",
  "horaFin": "11:00",
  "estado": "confirmada",
  "codigoConfirmacion": "CC-SAL-0903-7342",
  "vecinoId": "vec-011",
  "datosContacto": {
    "nombre": "Carlos Ruiz",
    "telefono": "3001112233"
  }
}
```

### Lógica de categorización (derivada, no almacenada)

```
Si reserva.fecha >= fechaHoy() → Categoría "Próximas"
Si reserva.fecha <  fechaHoy() → Categoría "Pasadas"
```

### Nuevo estado en `AppState` (agregar a `app.js`)

```javascript
// Dentro de AppState.ui:
historial: {
  abierto: false,
  telefonoBusqueda: '',
  reservasFiltradas: []
}
```

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

1. **Punto de entrada:** Se agrega un botón "📋 Mis Reservas" en el `<header>` junto al indicador de estado.
2. **Panel/Sección de Historial:** Al hacer clic, se muestra una sección (o modal de pantalla completa) con:
   - Un campo de texto para ingresar el **teléfono de contacto**.
   - Un botón "Buscar".
3. **Resultados:** Tras la búsqueda:
   - Se filtran las reservas de `RESERVAS` cuyo `datosContacto.telefono` coincida.
   - Se dividen en dos grupos con encabezados: **"📅 Próximas"** y **"📁 Pasadas"**.
   - Cada reserva se renderiza como un Card con:
     - Icono + nombre del espacio.
     - Fecha formateada (ej. "Lunes, 20 de septiembre de 2026").
     - Horario (ej. "09:00 a 11:00").
     - Código de confirmación.
     - Badge de estado con color: 🟡 Pendiente, 🟢 Confirmada, 🔴 Cancelada.
4. **Estado vacío:** Mensaje: *"No se encontraron reservas para este número."*
5. **Cierre:** Botón para volver a la vista principal.

---

## 4. Desglose de Tareas de Desarrollo

| # | Tarea | Archivos | Estimación |
|---|-------|----------|------------|
| 1 | **Agregar botón "Mis Reservas" al header** del HTML y su estilo CSS. | `index.html`, `styles.css` | 1 hora |
| 2 | **Crear la sección HTML del historial:** contenedor oculto con formulario de búsqueda por teléfono, contenedores para las listas "Próximas" y "Pasadas", y el estado vacío. | `index.html` | 2 horas |
| 3 | **Estilos CSS del historial:** Cards de reserva con badge de estado, layout responsivo de la sección, pestañas visuales de categoría. Reutilizar variables y clases existentes. | `styles.css` | 2 horas |
| 4 | **Lógica JS de búsqueda y renderizado:** Función que filtra `RESERVAS` por teléfono, clasifica por fecha (próximas/pasadas), y genera dinámicamente las tarjetas en el DOM. Agregar estado `historial` a `AppState`. | `app.js` | 3 horas |
| 5 | **Prueba integral:** Verificar búsqueda con teléfonos existentes en los mocks, validar clasificación correcta próximas/pasadas, verificar estado vacío, y confirmar diseño responsive. | — | 1 hora |

**Tiempo total estimado:** ~9 horas (≈ 1.5 días de trabajo) ✅ Viable dentro del Sprint.

---

## Dependencias

- Reutiliza funciones existentes: `formatearFecha()`, `obtenerDatos()`, constantes de `ESPACIOS`.
- Reutiliza estilos: `.card`, `.btn`, `.modal-overlay`, `.form-input`, `.toast`.
- No requiere cambios a `data.js` ni a `availability.js`.
