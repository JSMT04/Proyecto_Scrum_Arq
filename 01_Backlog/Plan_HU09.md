[APROBADO]

# Plan de Arquitectura Pulido — HU09: Bloqueo de Horarios por Mantenimiento

## 1. Veredicto del Revisor Técnico
El plan es viable, respeta la arquitectura ligera del prototipo SPA en Vanilla JS y no añade sobreingeniería (evita implementar sistemas complejos de autenticación o backends externos innecesarios). Reutiliza eficazmente el modelo de datos de `RESERVAS` incorporando el estado `bloqueado` y se integra de forma no disruptiva en el renderizado de la cuadrícula.

---

## 2. Requerimientos Funcionales y No Funcionales

### Funcionales
- **RF-01:** El sistema debe incluir un toggle de "Modo Admin" en la barra de controles/filtros para alternar entre la vista de vecino y la vista de administración.
- **RF-02:** En Modo Admin, al hacer clic en un slot disponible, este se marca de inmediato como "Bloqueado por Mantenimiento" (`estado: 'bloqueado'`).
- **RF-03:** En Modo Normal (vecino), los horarios bloqueados se muestran como no disponibles (deshabilitados) y no permiten ser seleccionados para reservar.
- **RF-04:** En Modo Admin, al hacer clic en un slot bloqueado por mantenimiento, este se libera (se elimina el bloqueo y vuelve a estar disponible).
- **RF-05:** Distinción visual inequívoca: los bloques de mantenimiento deben identificarse claramente (etiqueta "Mantenimiento 🛠️" y estilos específicos como fondo sombreado o rayado) diferenciándose de reservas confirmadas o pendientes.

### No Funcionales
- **RNF-01 (Usabilidad):** Acción directa y fluida a un solo clic para bloquear o desbloquear horarios estando en Modo Admin.
- **RNF-02 (Arquitectura Limpia):** Almacenar los bloqueos directamente en el arreglo global `RESERVAS` con `estado: 'bloqueado'` y `vecinoId: 'admin'`, persistiendo en `localStorage`.
- **RNF-03 (Feedback Visual):** Indicador visible (badge o botón activo) cuando el Modo Admin esté activado.

---

## 3. Modelo de Datos y Estado

### Objeto de Reserva para Mantenimiento
```javascript
{ 
  id: 'mtn-' + Date.now(), // Identificador único con prefijo mtn
  espacioId: 'cancha', 
  fecha: '2026-09-15', 
  horaInicio: '10:00', 
  horaFin: '11:00', 
  estado: 'bloqueado', // Estado clave para la exclusión
  vecinoId: 'admin',
  nombreVecino: 'Administración (Mantenimiento)',
  datosContacto: 'admin@centro.com'
}
```

### Estado Global (`AppState`)
```javascript
// En AppState.ui:
modoAdmin: false
```

---

## 4. Flujo de Interfaz y Comportamiento (UI/UX)

1. **Control de Modo Admin:**
   - Botón toggle `#btn-modo-admin` con icono 🛡️ en la barra superior o panel de filtros.
   - Cambia clase CSS activa para reflejar claramente cuando el usuario está operando como Administrador.

2. **Interacción con Slots en la Cuadrícula:**
   - **Modo Vecino (`modoAdmin === false`):**
     - Slot disponible: abre modal de reserva (`HU-02`).
     - Slot reservado: abre modal de detalle (`HU-03`).
     - Slot bloqueado: inerte o tooltip "Horario bloqueado por mantenimiento 🛠️".
   - **Modo Admin (`modoAdmin === true`):**
     - Clic en slot disponible: bloquea inmediatamente el slot agregando la reserva con `estado: 'bloqueado'`. Muestra notificación Toast.
     - Clic en slot bloqueado: desbloquea el slot eliminando el registro correspondiente. Muestra notificación Toast.
     - Clic en slot reservado por vecino: permite consultar o gestionar la reserva.

3. **Estilos y Renderizado:**
   - Clase `.slot-bloqueado` con fondo grisáceo/ámbar tenue y patrón distintivo.
   - Texto visible: "Mantenimiento 🛠️".

---

## 5. Tareas Técnicas Detalladas para el Desarrollador

| # | Tarea | Archivos |
|---|-------|----------|
| 1 | **Toggle Modo Admin en UI:** Agregar botón `#btn-modo-admin` en `index.html` y estilos `.admin-active` en `styles.css`. | `index.html`, `styles.css` |
| 2 | **Lógica de Estado Modo Admin:** Añadir `AppState.ui.modoAdmin` y listener para conmutar el estado, alternar clases visuales y refrescar la grilla si aplica. | `app.js` |
| 3 | **Funciones de Bloqueo/Desbloqueo:** Implementar `bloquearHorarioMantenimiento(espacioId, fecha, hora)` y `desbloquearHorarioMantenimiento(id)` persistiendo en `localStorage`. | `data.js`, `app.js` |
| 4 | **Gestión de Eventos en Cuadrícula:** Condicionar el click en los slots según `AppState.ui.modoAdmin`. Si es admin y el slot está libre, bloquear; si está bloqueado, liberar. | `app.js` |
| 5 | **Renderizado de Slots Bloqueados:** Añadir soporte en el renderizador de la grilla para slots con `estado === 'bloqueado'`. Asignar clase `.slot-bloqueado` y tooltip descriptivo. | `app.js`, `styles.css` |
| 6 | **Integración con Filtros y Disponibilidad:** Asegurar que las funciones de conteo de horas y espacios disponibles computen los slots bloqueados como no disponibles para vecinos. | `app.js` |

---

## 6. Criterios de Aceptación y Validación
- [x] Con Modo Admin inactivo, el usuario vecino ve los slots bloqueados pero no puede seleccionarlos ni reservarlos.
- [x] Con Modo Admin activo, hacer clic en un slot disponible lo convierte en bloqueado por mantenimiento de inmediato.
- [x] Con Modo Admin activo, hacer clic en un slot bloqueado lo elimina y lo devuelve al estado disponible.
- [x] Los bloqueos persisten tras recargar la página (`localStorage`).
