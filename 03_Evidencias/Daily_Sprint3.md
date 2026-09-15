# Evidencia de Sprint 3 — Daily Scrum e Incremento (HU-07)

**Fecha:** 14 de Septiembre de 2026  
**Historias de Usuario Completadas:**  
- HU-07: Historial de Reservas Activas y Pasadas del Vecino  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Consulta Personal de Historial (HU-07):** Permite a cualquier vecino registrado consultar su historial personal de reservas activas y pasadas mediante su número telefónico de contacto desde un modal dedicado accesible en la barra principal.
2. **Clasificación Automática por Fecha:** El sistema categoriza dinámicamente las reservas en dos secciones bien diferenciadas: **Próximas** (`fecha >= hoy`) y **Pasadas** (`fecha < hoy`), facilitando el control personal del usuario.
3. **Detalle Visual y Badges Semánticos:** Cada tarjeta del historial exhibe el icono y nombre del espacio, la fecha completa formateada, la franja horaria, el código único de confirmación y una insignia de estado coloreada (`🟡 Pendiente`, `🟢 Confirmada`, `🔴 Cancelada`).

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se diseñó, auditó, desarrolló y validó la Historia de Usuario **HU-07** (Historial de Reservas).
- En `index.html`, se incorporó el botón **📋 Mis Reservas** en el header y la estructura overlay/modal `#historial-overlay` con buscador por teléfono y contenedores de listas.
- En `styles.css`, se definieron los estilos responsivos (`.btn-historial`, `.historial-panel`, `.historial-card`, `.badge`, `.historial-vacio`) adaptables a móviles (≤480px).
- En `app.js`, se añadieron `renderTarjetaReserva()`, `renderHistorial()`, `buscarHistorial()`, `abrirHistorial()`, `cerrarHistorial()` y la sincronización con `AppState.ui.historial`.
- Se verificó el cumplimiento del 100% de los criterios de la Definition of Done por QA con resultado **`PASÓ`**.

### ¿Qué se hará después?
- Presentar la demostración en vivo del prototipo SPA completado ante el Product Owner durante el Sprint Review.
- Cerrar el backlog del proyecto y preparar la entrega final del prototipo.

### ¿Existe algún impedimento?
- Ninguno. La funcionalidad está libre de regresiones y es 100% compatible con el estado guardado en `localStorage`.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en un navegador web moderno.

### Paso 1: Acceso al Historial de Reservas (HU-07)
1. En la barra superior (header), hacer clic en el botón **"📋 Mis Reservas"**.
2. **Verificación:** Se despliega suavemente la ventana modal del historial y el cursor se posiciona automáticamente en el campo de entrada de teléfono.

### Paso 2: Búsqueda de Reservas por Teléfono
1. Ingresar un número telefónico con reservas registradas (ej. `3001112233` o `3104445566`) y presionar la tecla **Enter** o el botón **"Buscar"**.
2. **Verificación:** Se despliegan dos secciones claramente divididas:
   - **📅 Próximas:** Muestra las reservas con fecha de hoy en adelante.
   - **📁 Pasadas:** Muestra el historial de reservas anteriores.
3. Verificar que cada tarjeta exhiba el icono del espacio, nombre, fecha en formato legible, horario, código de comprobante y badge de estado.

### Paso 3: Validación de Estado Vacío
1. Ingresar un número telefónico sin reservas (ej. `3000000000`) y hacer clic en **"Buscar"**.
2. **Verificación:** El sistema oculta las listas y muestra el mensaje con icono de buzón vacío *"No se encontraron reservas para este número."*

### Paso 4: Cierre del Modal
1. Hacer clic en el botón de cierre **"✕"**, hacer clic fuera del panel o presionar la tecla **Escape**.
2. **Verificación:** El modal se oculta correctamente devolviendo el control a la pantalla principal.
