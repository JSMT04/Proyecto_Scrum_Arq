# Evidencia de Sprint 3 — Daily Scrum e Incremento (HU-07, HU-08 y HU-09)

**Fecha:** 15 de Septiembre de 2026  
**Historias de Usuario Completadas en el Sprint 3:**  
- HU-07: Historial de Reservas Activas y Pasadas del Vecino  
- HU-08: Reglamento de Uso de Instalaciones  
- HU-09: Bloqueo de Horarios por Mantenimiento (Modo Administrador)  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Consulta Personal de Historial (HU-07):** Permite a cualquier vecino consultar su historial de reservas activas y pasadas mediante su número telefónico de contacto en un modal interactivo.
2. **Consulta de Reglamento Comunitario (HU-08):** Incorpora un panel modal con acordeón accesible para consultar las normas oficiales de convivencia y uso de espacios.
3. **Gestión de Bloqueo por Mantenimiento (HU-09):** Permite al administrador conmutar al **Modo Admin** (`🛡️ Modo Admin`) para bloquear o desbloquear horarios con un solo clic por motivos de mantenimiento, impidiendo que los vecinos realicen reservas en dichos bloques.

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se diseñaron, desarrollaron, auditaron y validaron las Historias de Usuario **HU-07**, **HU-08** y **HU-09**.
- En `index.html`, se agregaron los botones `#btn-mis-reservas`, `#btn-reglamento` y el conmutador `#btn-modo-admin` en la cabecera, además del estado `Mantenimiento 🛠️` en la leyenda.
- En `data.js`, se añadieron las funciones `bloquearHorarioMantenimiento` y `desbloquearHorarioMantenimiento` con persistencia en `localStorage`.
- En `availability.js`, se otorgó la máxima prioridad al estado `bloqueado` en el cálculo de disponibilidad horaria.
- En `styles.css`, se diseñaron los estilos visuales para slots en mantenimiento (`.slot-bloqueado`), la leyenda y los resaltados interactivos en Modo Admin (`.admin-active`, `body.admin-mode-on`).
- En `app.js`, se programó el conmutador `alternarModoAdmin()`, la captura de clics en la cuadrícula para bloquear/liberar slots en Modo Admin y la exclusión de franjas bloqueadas en filtros.
- QA auditó la entrega de la HU-09 y emitió dictamen **`PASÓ`** aprobando los 3 criterios de la Definition of Done.

### ¿Qué se hará después?
- Presentar la demostración en vivo de la solución completa (HU-01 a HU-09) en la sesión de Sprint Review.
- Consolidar la entrega final del proyecto Scrum.

### ¿Existe algún impedimento?
- Ninguno. El prototipo SPA es 100% funcional, retrocompatible y sin dependencias externas.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en cualquier navegador web moderno.

### Parte A: Demostración de HU-09 (Bloqueo de Mantenimiento por Administrador)
1. **Activar Modo Admin:** En la barra superior (header), hacer clic en el botón **"🛡️ Modo Admin"**.
2. **Verificación:** El botón se resalta en tono naranja/ámbar (**🛡️ Admin Activo**), aparece un borde sutil indicando el modo con privilegios y se emite la notificación Toast *"🛡️ Modo Administrador Activado"*.
3. **Bloquear un Horario:** Seleccionar el espacio **Cancha** y hacer clic en un slot disponible (ej. `12:00`).
4. **Verificación:** El slot cambia instantáneamente a estado **Mantenimiento 🛠️** con fondo rayado distintivo y notificación Toast *"🛠️ Horario 12:00 bloqueado por mantenimiento"*.
5. **Probar Vista de Vecino:** Hacer clic de nuevo en **"🛡️ Admin Activo"** para desactivar el Modo Admin.
6. **Verificación:** Al hacer clic sobre el slot `12:00`, no se abre el modal de reserva y el sistema notifica *"🛠️ Horario bloqueado por mantenimiento"*.
7. **Probar Filtro "Solo Disponibles":** Marcar la casilla **"Solo disponibles"**.
8. **Verificación:** El slot en mantenimiento `12:00` se oculta automáticamente de la cuadrícula.
9. **Desbloquear Horario:** Volver a activar **Modo Admin** y hacer clic sobre el slot `12:00` (Mantenimiento).
10. **Verificación:** El bloqueo se elimina de inmediato y el slot vuelve a estar disponible (`🟢 Disponible`).

### Parte B: Demostración de HU-07 y HU-08
1. **Historial de Reservas (HU-07):** Hacer clic en **"📋 Mis Reservas"**, ingresar el número `3001112233` y presionar Buscar para ver las reservas próximas y pasadas.
2. **Reglamento de Uso (HU-08):** Hacer clic en **"📜 Reglamento"** y navegar por las secciones del acordeón interactivo.
