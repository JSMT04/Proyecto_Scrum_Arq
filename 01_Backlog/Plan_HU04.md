[APROBADO]

# HU-04 — Mensaje de Confirmación con Código Único de Reserva

## Veredicto del Revisor Técnico

El plan es **viable y bien estructurado**. Se detectaron 3 observaciones menores que se incorporan directamente al plan pulido. No hay sobreingeniería: el modal de comprobante reutiliza clases CSS existentes (`.modal-overlay`, `.modal-card`, `.modal-summary`, `.btn`) y la lógica de generación de código es una función pura de 4 líneas. La estimación de 2 días es razonable.

### Observaciones Incorporadas

| # | Observación | Corrección aplicada |
|---|-------------|---------------------|
| 1 | El `localStorage` puede tener reservas antiguas del Sprint anterior **sin** el campo `codigoConfirmacion`. El operador `?? 'N/D'` en la Tarea 6 ya cubre este caso — se formaliza como requisito explícito. | Se añade nota de retrocompatibilidad en Tarea 1. |
| 2 | Las Tareas 4 y 5 de `app.js` son interdependientes y pequeñas; pueden consolidarse en una sola tarea sin perder claridad. | Fusionadas en **Tarea 4** (Lógica completa del modal de comprobante + integración en submit). |
| 3 | El plan no especificaba el `aria-labelledby` del nuevo modal, necesario para cumplir accesibilidad al igual que los modales existentes. | Añadido en Tarea 2 (Markup). |

---

## Plan Pulido — Listo para Desarrollador

### Historia de Usuario

**Como** vecino del barrio,  
**quiero** recibir un mensaje de confirmación con un código único en pantalla,  
**para** validar y tener un comprobante de mi reserva.

---

### 1. Requerimientos Funcionales y No Funcionales

#### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | Al registrar una nueva reserva exitosamente (flujo HU-02), el sistema debe generar automáticamente un **código único de comprobante** alfanumérico. |
| RF-02 | El código debe tener el formato: `CC-[ABREV]-[MMDD]-[4DIG]`. Ejemplo: `CC-SAL-0903-4821`. Abreviaturas: `SAL` = Salón Comunal, `CAN` = Cancha, `JUN` = Sala de Juntas. |
| RF-03 | El código generado se persiste en la propiedad `codigoConfirmacion` del objeto `Reserva` en `data.js` y en `localStorage`. |
| RF-04 | Inmediatamente tras el submit exitoso del formulario de reserva, debe aparecer un **modal de comprobante** mostrando: espacio, fecha, horario, nombre del vecino y el código único resaltado. |
| RF-05 | El modal de comprobante incluye un botón **"Entendido"** y un botón **[X]** que lo cierran y disparan el re-render de la cuadrícula. |
| RF-06 | Al abrir el **modal de gestión** (HU-03) de cualquier reserva, se muestra su `codigoConfirmacion`. Si la reserva es antigua y no tiene código, se muestra `N/D`. |
| RF-07 | Las reservas del mock data (`RESERVAS_MOCK`) deben incluir el campo `codigoConfirmacion` con valores estáticos representativos. |

#### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | Reutilizar clases CSS existentes: `.modal-overlay`, `.modal-card`, `.modal-header`, `.modal-summary`, `.btn`, `.btn-primary`. No crear clases redundantes. |
| RNF-02 | El código debe destacarse visualmente con fuente monoespaciada, fondo oscuro contrastante y tamaño mayor al cuerpo (`≥ 1.5rem`). |
| RNF-03 | El modal de comprobante debe aparecer en la misma llamada síncrona del submit (< 200ms, sin `setTimeout` innecesarios). |
| RNF-04 | El modal de comprobante debe incluir `role="dialog"`, `aria-modal="true"` y `aria-labelledby` apuntando a su `<h2>`, igual que los modales existentes. |

#### Criterios de Aceptación

- [ ] Al completar el formulario de reserva, aparece automáticamente un modal de comprobante con los datos y el código único.
- [ ] El código tiene el formato `CC-[ABREV]-[MMDD]-[4DIG]` y es único en la sesión.
- [ ] El código se almacena en el objeto de reserva en `localStorage`.
- [ ] Al abrir el modal de gestión (HU-03) de cualquier reserva, se muestra su código (o `N/D` si es retrocompatible).
- [ ] Las reservas del mock data muestran su código estático (no `undefined`).

---

### 2. Modelo de Datos y Estado

#### Entidad `Reserva` — Campo Añadido

```json
{
  "id": "rsv-001",
  "espacioId": "salon_comunal",
  "fecha": "2026-09-03",
  "horaInicio": "09:00",
  "horaFin": "11:00",
  "estado": "confirmada",
  "vecinoId": "vec-011",
  "codigoConfirmacion": "CC-SAL-0903-7342",
  "datosContacto": {
    "nombre": "Carlos Ruiz",
    "telefono": "3001112233"
  }
}
```

#### Lógica de Generación del Código

```
generarCodigoConfirmacion(espacioId, fecha):
  abrevMap = { salon_comunal: 'SAL', cancha: 'CAN', sala_juntas: 'JUN' }
  abrev    = abrevMap[espacioId] ?? 'XXX'
  mmdd     = fecha.slice(5).replace('-', '')        // "2026-09-03" → "0903"
  sufijo   = String(Math.floor(Math.random() * 9000) + 1000)
  return   `CC-${abrev}-${mmdd}-${sufijo}`
```

#### Estado Global (`AppState`) — Adición

```json
{
  "ui": {
    "modalComprobante": {
      "abierto": false,
      "reserva": null
    }
  }
}
```

---

### 3. Flujo de Interfaz de Usuario (UI/UX)

#### Flujo Principal

```
[Usuario envía formulario de reserva válido]
          ↓
[Generar código → construir nuevaReserva con codigoConfirmacion]
          ↓
[agregarReserva(nuevaReserva) → guardar en localStorage]
          ↓
[cerrarModalReserva()]
          ↓
[abrirModalComprobante(nuevaReserva)]  ← NUEVO
          ↓
[Usuario lee código → pulsa "Entendido" o [X]]
          ↓
[cerrarModalComprobante() → actualizarDatos() → re-render cuadrícula]
```

#### Wireframe — Modal de Comprobante

```
┌──────────────────────────────────────────────────┐
│  Fondo oscuro semi-transparente (Overlay)         │
│  ┌──────────────────────────────────────────────┐ │
│  │  ✅ ¡Reserva Registrada!               [X]   │ │
│  ├──────────────────────────────────────────────┤ │
│  │  Tu reserva fue registrada exitosamente.     │ │
│  │                                              │ │
│  │  📍 Espacio:  Salón Comunal                  │ │
│  │  📅 Fecha:    3 de septiembre de 2026        │ │
│  │  ⏰ Horario:  09:00 a 10:00 (1 hora)         │ │
│  │  👤 Nombre:   Carlos Ruiz                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │        Código de Comprobante           │  │ │
│  │  │   ╔══════════════════════════════╗     │  │ │
│  │  │   ║    CC-SAL-0903-7342          ║     │  │ │
│  │  │   ╚══════════════════════════════╝     │  │ │
│  │  │   Guarda este código para consultas    │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                              │ │
│  │                  [ Entendido ]               │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

#### Integración en Modal de Gestión (HU-03)

```
┌──────────────────────────────────────────────┐
│  Gestionar Reserva                       [X] │
├──────────────────────────────────────────────┤
│ 📍 Espacio:  Cancha                          │
│ 📅 Fecha:    3 de septiembre de 2026         │
│ ⏰ Horario:  15:00 a 16:00 (1 hora)          │
│ 🔑 Código:   CC-CAN-0903-5531  ← NUEVO       │
│                                              │
│ Para gestionar esta reserva ingresa          │
│ el teléfono de contacto:                     │
│ [____________________________________]       │
│ [ Cancelar Reserva ]      [ Confirmar ]      │
└──────────────────────────────────────────────┘
```

---

### 4. Desglose de Tareas de Desarrollo

> Estimación total: **5 tareas · ≤ 4h cada una · 2 días de desarrollo.**

---

#### Tarea 1 — `data.js`: Generador de Código y Actualización del Mock

**Archivos:** `02_Codigo/data.js`

- Implementar la función pura `generarCodigoConfirmacion(espacioId, fecha)` con el algoritmo descrito en la sección 2.
- Actualizar los 10 objetos de `RESERVAS_MOCK` añadiendo `codigoConfirmacion` con valores estáticos representativos (ej. `"CC-SAL-0903-7342"`). Esto garantiza que el mock nunca muestre `undefined`.
- **Nota de retrocompatibilidad:** Si el usuario ya tiene datos en `localStorage` de sprints anteriores sin `codigoConfirmacion`, el operador `?? 'N/D'` en la Tarea 3 lo cubre sin necesidad de migración.
- **Entregable:** Función `generarCodigoConfirmacion` disponible globalmente en el scope de los scripts, mock data con códigos.

---

#### Tarea 2 — `index.html`: Markup del Modal de Comprobante

**Archivos:** `02_Codigo/index.html`

- Añadir el siguiente bloque después del `<!-- Modal Gestionar Reserva (HU-03) -->` y antes del `<div id="toast-notificacion">`:

```html
<!-- Modal Comprobante de Reserva (HU-04) -->
<div id="modal-comprobante-overlay" class="modal-overlay hidden"
     role="dialog" aria-modal="true" aria-labelledby="modal-comprobante-title">
  <div class="modal-card">
    <div class="modal-header">
      <h2 id="modal-comprobante-title" class="modal-title">✅ ¡Reserva Registrada!</h2>
      <button id="modal-comprobante-btn-close" class="modal-close-btn" aria-label="Cerrar">&#x00D7;</button>
    </div>
    <p class="comprobante-intro">Tu reserva fue registrada exitosamente.</p>
    <div class="modal-summary">
      <p><strong>📍 Espacio:</strong>  <span id="comprobante-espacio">-</span></p>
      <p><strong>📅 Fecha:</strong>    <span id="comprobante-fecha">-</span></p>
      <p><strong>⏰ Horario:</strong>  <span id="comprobante-horario">-</span></p>
      <p><strong>👤 Nombre:</strong>   <span id="comprobante-nombre">-</span></p>
    </div>
    <div class="comprobante-codigo-box">
      <p class="comprobante-codigo-label">Código de Comprobante</p>
      <span id="comprobante-codigo" class="comprobante-codigo"></span>
      <p class="comprobante-codigo-hint">Guarda este código para futuras consultas.</p>
    </div>
    <div class="modal-actions">
      <button type="button" id="btn-comprobante-cerrar" class="btn btn-primary">Entendido</button>
    </div>
  </div>
</div>
```

- Añadir campo de código en el resumen del **modal de gestión** existente (dentro de `.modal-summary` de `#modal-gestion-overlay`):

```html
<p><strong>🔑 Código:</strong> <span id="modal-gestion-codigo" class="comprobante-inline">-</span></p>
```

- **Entregable:** Markup del modal de comprobante integrado (oculto por defecto) y campo de código en modal de gestión.

---

#### Tarea 3 — `styles.css`: Estilos del Comprobante

**Archivos:** `02_Codigo/styles.css`

Añadir las siguientes clases al final del archivo (antes del bloque `@media`):

```css
/* === COMPROBANTE DE RESERVA (HU-04) === */

.comprobante-intro {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.comprobante-codigo-box {
  background: rgba(13, 17, 23, 0.9);
  border: 1px solid var(--tab-from);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.comprobante-codigo-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.comprobante-codigo {
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--tab-from);
  text-shadow: 0 0 20px rgba(79, 70, 229, 0.4);
}

.comprobante-codigo-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comprobante-inline {
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--tab-from);
  letter-spacing: 0.05em;
}
```

- **Entregable:** Código de comprobante destacado visualmente; coherente con la paleta y tipografía del sistema.

---

#### Tarea 4 — `app.js`: Lógica del Modal de Comprobante + Integración en Submit

**Archivos:** `02_Codigo/app.js`

**4a. Ampliar `AppState.ui`:**
```js
modalComprobante: { abierto: false, reserva: null }
```

**4b. Implementar `abrirModalComprobante(reserva)`:**
- Obtener el objeto `espacio` desde `AppState.espacios`.
- Calcular `horaFin` a partir de `reserva.horaInicio`.
- Formatear la fecha con `formatearFecha(reserva.fecha).completa`.
- Inyectar datos en: `#comprobante-espacio`, `#comprobante-fecha`, `#comprobante-horario`, `#comprobante-nombre`.
- Inyectar `reserva.codigoConfirmacion` en `#comprobante-codigo`.
- Remover clase `hidden` del overlay.
- Actualizar `AppState.ui.modalComprobante`.

**4c. Implementar `cerrarModalComprobante()`:**
- Añadir clase `hidden` al overlay.
- Resetear `AppState.ui.modalComprobante`.
- Llamar a `actualizarDatos()` e `iniciarPolling()`.

**4d. Registrar listeners:**
- `#modal-comprobante-btn-close` → `cerrarModalComprobante()`.
- `#btn-comprobante-cerrar` → `cerrarModalComprobante()`.
- Clic en `#modal-comprobante-overlay` cuando `e.target.id === 'modal-comprobante-overlay'` → `cerrarModalComprobante()`.
- Extender listener de `Escape` con: `if (AppState.ui.modalComprobante.abierto) cerrarModalComprobante();`

**4e. Modificar listener `submit` del `#form-reserva`:**
- Al construir `nuevaReserva`, añadir:
  ```js
  codigoConfirmacion: generarCodigoConfirmacion(
    AppState.filtros.espacioSeleccionado,
    AppState.filtros.fechaSeleccionada
  )
  ```
- Reemplazar `mostrarToast(...)` por `abrirModalComprobante(nuevaReserva)`.
- Eliminar `actualizarDatos()` e `iniciarPolling()` del submit (quedan solo en `cerrarModalComprobante()`).

- **Entregable:** Modal de comprobante funcional; el comprobante aparece automáticamente al reservar con código único generado.

---

#### Tarea 5 — `app.js`: Integración en Modal de Gestión

**Archivos:** `02_Codigo/app.js`

- En la función `abrirModalGestion(hora)`, tras obtener el objeto `reserva`:
  ```js
  document.getElementById('modal-gestion-codigo').textContent =
    reserva.codigoConfirmacion ?? 'N/D';
  ```
- **Entregable:** El modal de gestión (HU-03) muestra el código de comprobante de la reserva seleccionada, o `N/D` si la reserva es anterior a esta historia.
