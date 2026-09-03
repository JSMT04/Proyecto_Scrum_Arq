[APROBADO]
# HU-03 — Confirmar o Cancelar Reserva

## Historia de Usuario

**Como** vecino del barrio,  
**quiero** confirmar o cancelar una reserva previa,  
**para** liberar el espacio si mis planes cambian.

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | El sistema debe permitir al usuario hacer clic en un bloque horario en estado **Pendiente** u **Ocupado (Confirmado)**. |
| RF-02 | Al hacer clic, se debe desplegar un **formulario modal de gestión** indicando el espacio, fecha y horario de la reserva. |
| RF-03 | Para proteger la reserva (simulación de autenticación), el modal debe solicitar el **Teléfono de contacto** ingresado originalmente. |
| RF-04 | Si el teléfono ingresado coincide con el de la reserva, el sistema debe permitir realizar la acción seleccionada (Confirmar o Cancelar). |
| RF-05 | **Acción Cancelar:** Cambia el estado de la reserva a `cancelada`. El bloque debe volver a quedar **Disponible** en la cuadrícula. |
| RF-06 | **Acción Confirmar:** (Aplica si estaba en `pendiente`). Cambia el estado a `confirmada`. El bloque pasa a verse **Ocupado**. |
| RF-07 | Tras una gestión exitosa, el modal debe cerrarse y mostrar una notificación (toast) de éxito. |

### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | Reutilizar la estética y componentes del modal creado en la HU-02. |
| RNF-02 | Validar en el frontend (controlador UI) que el teléfono coincida antes de mutar los datos en `data.js`. |
| RNF-03 | Las actualizaciones deben reflejarse en el estado y renderizarse sin recargar la página. |

### Criterios de Aceptación

- [ ] Un bloque "Pendiente" u "Ocupado" ahora es clickeable y abre el modal de "Gestionar Reserva".
- [ ] El modal exige ingresar el teléfono para validar la identidad. Si el teléfono no coincide, muestra un error visual.
- [ ] Al cancelar, el bloque se libera (verde/disponible) de inmediato.
- [ ] Al confirmar una reserva pendiente, el bloque pasa a ser ocupado (rojo) de inmediato.

---

## 2. Modelo de Datos y Estado

### Entidades Afectadas

No hay cambios estructurales en la entidad `Reserva`. Se utilizarán las propiedades existentes: `estado` (pasando de `pendiente` a `confirmada` o `cancelada`) y `datosContacto.telefono` para la validación.

### Estado Global (`AppState`)

Se añadirá un nuevo estado para controlar el modal de gestión en la propiedad `ui` de `app.js`:

```json
{
  "ui": {
    "modalGestion": {
      "abierto": false,
      "reservaId": null,      // ID de la reserva a gestionar
      "horaSeleccionada": null
    }
  }
}
```

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

### Wireframe Modal de Gestión de Reserva

```
┌──────────────────────────────────────────────┐
│  Fondo oscuro semi-transparente (Overlay)    │
│  ┌────────────────────────────────────────┐  │
│  │ Gestionar Reserva                  [X] │  │
│  ├────────────────────────────────────────┤  │
│  │ 📍 Espacio: Cancha                     │  │
│  │ 📅 Fecha: 05 de Sep 2026               │  │
│  │ ⏰ Horario: 14:00 a 15:00              │  │
│  │                                        │  │
│  │ Para gestionar esta reserva, ingresa   │  │
│  │ el teléfono con el que fue creada:     │  │
│  │                                        │  │
│  │ Teléfono de contacto *                 │  │
│  │ [____________________________________] │  │
│  │ [! Error: El teléfono no coincide]     │  │
│  │                                        │  │
│  │ [ Cancelar Reserva ]  [ Confirmar ]    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```
*(Nota: El botón "Confirmar" solo debería mostrarse/habilitarse si la reserva está en estado "pendiente").*

### Interacciones clave

| Acción del usuario | Respuesta del sistema |
|---|---|
| Clic en bloque Pendiente/Ocupado | Identifica la reserva correspondiente, abre modal de gestión. |
| Ingresa teléfono erróneo y acciona | Muestra borde rojo y mensaje "El teléfono no coincide". |
| Ingresa teléfono correcto + Clic Cancelar | Busca la reserva, cambia estado a `cancelada`, guarda en storage, cierra modal, notifica y re-renderiza. |
| Ingresa teléfono correcto + Clic Confirmar | Busca la reserva, cambia estado a `confirmada`, guarda en storage, cierra modal, notifica y re-renderiza. |

---

## 4. Desglose de Tareas de Desarrollo

> Estimación: Cada tarea toma menos de 4 horas (1 día de desarrollo en total).

### Tarea 1 — Actualizar HTML (`index.html`)
- Añadir el markup para el nuevo `#modal-gestion-overlay`.
- Incluir la cabecera, el resumen de datos, un input `<input type="tel" id="input-telefono-gestion">`, y dos botones de acción: `#btn-cancelar-reserva` (rojo) y `#btn-confirmar-reserva` (primario).
- **Entregable:** Estructura HTML del nuevo modal integrada y oculta.

### Tarea 2 — Estilos CSS (`styles.css`)
- Reutilizar clases base del modal (`modal-overlay`, `modal-card`).
- Quitar `cursor: not-allowed` de `.slot-ocupado` y `.slot-pendiente`, y añadir `cursor: pointer`. Añadir efectos `:hover`.
- Crear estilo para botón destructivo (rojo) para la acción de cancelar.
- **Entregable:** Modal de gestión estilizado y slots no-disponibles interactivos.

### Tarea 3 — Capa de Datos (`data.js`)
- Implementar función `actualizarEstadoReserva(id, nuevoEstado)` que busque la reserva por su `id`, modifique su propiedad `estado`, y llame a `guardarReservasStorage(RESERVAS)`.
- Exportar esta función para que el controlador pueda usarla.
- **Entregable:** Lógica pura de mutación de estado de reservas existente.

### Tarea 4 — Lógica de Controlador UI (`app.js`) - Apertura y cierre
- Extender `renderCuadricula` para agregar `data-action="gestionar"` en bloques `ocupado` y `pendiente`.
- Al hacer clic en un bloque para gestionar, encontrar la reserva exacta en `AppState.reservas` que coincida con el espacio, fecha y hora.
- Función `abrirModalGestion(reserva)`: inyecta datos en el modal, muestra/oculta el botón de "Confirmar" según si es `pendiente`, y muestra el modal.
- Función `cerrarModalGestion()` para limpiar y ocultar.
- **Entregable:** Modal se abre al hacer clic en un bloque ocupado/pendiente con los datos correctos.

### Tarea 5 — Procesamiento de Acciones (`app.js`)
- Añadir listeners a los botones de Confirmar y Cancelar del modal de gestión.
- Al hacer clic, validar que el valor de `#input-telefono-gestion` coincida exactamente con `reservaActual.datosContacto.telefono` (ignorar espacios si se desea, o comparación estricta).
- Si no coincide: mostrar error visual.
- Si coincide: llamar a `actualizarEstadoReserva` con `confirmada` o `cancelada` según el botón clickeado.
- Cerrar modal, disparar `actualizarDatos()` para re-renderizar la cuadrícula y lanzar `mostrarToast` de éxito.
- **Entregable:** Flujo completo de gestión de reserva funcional y reactivo.
