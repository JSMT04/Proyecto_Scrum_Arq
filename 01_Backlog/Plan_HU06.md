[APROBADO]
# HU-06 — Filtrar Espacios por Fecha u Horario Deseado

## Historia de Usuario

**Como** vecino del barrio,  
**quiero** filtrar los espacios por fecha u horario deseado,  
**para** agilizar la búsqueda de disponibilidad sin tener que recorrer manualmente todos los bloques y días.

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | **Selección Directa de Fecha:** El usuario debe poder elegir directamente cualquier fecha mediante un selector nativo de calendario (`<input type="date">`), además de conservar los botones de navegación día anterior (`<`) y día siguiente (`>`). |
| RF-02 | **Atajo "Hoy":** Debe incluirse un botón de acceso rápido para retornar a la fecha actual (`HOY`) en un solo clic si el usuario navegó a otras fechas. |
| RF-03 | **Filtro por Franja Horaria:** El usuario debe poder filtrar los bloques de la cuadrícula seleccionando entre 4 franjas horarias:  <br>• **Todas:** 07:00 a 22:00 (todos los bloques).  <br>• **Mañana:** 07:00 a 11:59 (`07:00` a `11:00`).  <br>• **Tarde:** 12:00 a 17:59 (`12:00` a `17:00`).  <br>• **Noche:** 18:00 a 21:59 (`18:00` a `21:00`). |
| RF-04 | **Filtro "Solo Disponibles":** El usuario debe poder activar un conmutador/filtro para ocultar bloques ocupados o pendientes y visualizar únicamente los bloques con estado `disponible`. |
| RF-05 | **Estado Vacío Amigable:** Si la combinación de filtros de fecha/horario no arroja ningún bloque coincidente, la cuadrícula debe mostrar un mensaje claro: *"No se encontraron horarios con los filtros seleccionados."* con opción de restablecer filtros. |
| RF-06 | **Reactividad Inmediata:** Cualquier cambio de fecha, franja o filtro de disponibilidad debe actualizar la cuadrícula de forma síncrona en menos de 50ms sin recargar la página. |

### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | **Patrón Unidireccional:** Todo filtrado se realiza leyendo el estado global `AppState.filtros`, manteniendo una única fuente de verdad. |
| RNF-02 | **Accesibilidad (a11y):** Los botones de franja deben incluir `role="tab"` o `role="button"` con `aria-pressed="true|false"` y etiquetas descriptivas. El input de fecha debe tener `aria-label`. |
| RNF-03 | **Retrocompatibilidad:** Mantener intactos los flujos de reserva (HU-02), gestión (HU-03), comprobante (HU-04) y ficha informativa (HU-05). |
| RNF-04 | **Diseño Compacto y Móvil:** Los controles de filtro deben ser envolventes (`flex-wrap`) y adaptarse fluidamente en pantallas estrechas (<480px). |

### Criterios de Aceptación

- [ ] Existe un selector de fecha nativo accesible que permite elegir cualquier día de forma directa y sincroniza con el indicador de fecha y los botones `<` / `>`.
- [ ] Existe un botón rápido "Hoy" que regresa inmediatamente a la fecha actual si se está consultando otro día.
- [ ] Existen 4 botones de franja horaria (*Todas*, *Mañana*, *Tarde*, *Noche*); al pulsar uno, la cuadrícula solo lista los bloques correspondientes a ese horario.
- [ ] Existe un filtro rápido *"Solo disponibles"*; al activarse, desaparecen los bloques ocupados y pendientes de la vista.
- [ ] Si ningún bloque coincide con el filtro, se muestra un mensaje informativo de estado vacío sin errores en consola.
- [ ] Al seleccionar un bloque resultante de un filtro, el proceso de reserva (HU-02/HU-04) o gestión (HU-03) funciona con total normalidad.

---

## 2. Modelo de Datos y Estado

### Extensión de `AppState.filtros`

Se actualiza el objeto `AppState.filtros` en `02_Codigo/app.js` para persistir los nuevos criterios de filtrado activo:

```json
{
  "filtros": {
    "espacioSeleccionado": "salon_comunal",
    "fechaSeleccionada": "2026-09-03",
    "franjaHoraria": "todas",
    "soloDisponibles": false
  }
}
```

### Definición de Franjas Horarias

Regla de negocio para determinar a qué franja pertenece cada bloque `HH:00`:

| Franja (`franjaHoraria`) | Condición de Hora (`HH`) | Bloques Incluidos |
|---|---|---|
| `todas` | `true` | 07:00 a 21:00 |
| `manana` | `H >= 7 && H < 12` | 07:00, 08:00, 09:00, 10:00, 11:00 |
| `tarde` | `H >= 12 && H < 18` | 12:00, 13:00, 14:00, 15:00, 16:00, 17:00 |
| `noche` | `H >= 18 && H < 22` | 18:00, 19:00, 20:00, 21:00 |

### Función Pura de Filtrado (`filtrarBloquesDisponibilidad`)

```javascript
const filtrarBloquesDisponibilidad = (bloques, { franjaHoraria, soloDisponibles }) => {
  return bloques.filter(b => {
    const horaNum = parseInt(b.hora.split(':')[0], 10);
    
    // 1. Filtro por Franja Horaria
    let coincideFranja = true;
    if (franjaHoraria === 'manana') coincideFranja = horaNum >= 7 && horaNum < 12;
    else if (franjaHoraria === 'tarde') coincideFranja = horaNum >= 12 && horaNum < 18;
    else if (franjaHoraria === 'noche') coincideFranja = horaNum >= 18 && horaNum < 22;

    if (!coincideFranja) return false;

    // 2. Filtro por Estado
    if (soloDisponibles && b.estado !== 'disponible') return false;

    return true;
  });
};
```

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

### Wireframe — Barra de Fecha Mejorada y Panel de Filtros

```
┌────────────────────────────────────────────────────────┐
│  📅  [ < ]  [ Jueves, 3 de septiembre ]  [ > ] [ Hoy ] │
│      Seleccionar fecha: [ 2026-09-03 📅 ]              │
├────────────────────────────────────────────────────────┤
│  🔍 Filtrar Horarios:                                  │
│  [ ● Todas ] [ Mañana ] [ Tarde ] [ Noche ]            │
│  [x] Solo disponibles                                  │
├────────────────────────────────────────────────────────┤
│  Cuadrícula de Horarios Filtrados:                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 07:00 [████████████████] Disponible (Clic)        │  │
│  │ 08:00 [████████████████] Disponible (Clic)        │  │
│  │ 09:00 [████████████████] Disponible (Clic)        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Interacciones Clave

1. **Cambio de Fecha mediante Calendario:**
   - El usuario abre el selector `<input type="date">` y elige una fecha.
   - El indicador textual y la cuadrícula se actualizan inmediatamente al día seleccionado.
2. **Clic en botón "Hoy":**
   - Restaura instantáneamente la fecha a `HOY` y actualiza la vista.
3. **Clic en Franja Horaria (ej. "Tarde"):**
   - El botón seleccionado adopta clase activa `.active`.
   - La cuadrícula filtra instantáneamente mostrando únicamente las horas entre 12:00 y 17:00.
4. **Activación de "Solo disponibles":**
   - Se ocultan todos los bloques ocupados o pendientes, dejando visibles solo los horarios reservables.
5. **Restablecimiento ante Estado Vacío:**
   - Si no hay resultados, se muestra un botón *"Restablecer filtros"* que devuelve `franjaHoraria = 'todas'` y `soloDisponibles = false`.

---

## 4. Desglose de Tareas de Desarrollo

> Estimación: Cada tarea toma menos de 2 horas (tiempo total < 1 día de desarrollo).

---

### Tarea 1 — `index.html`: Incorporar Controles de Filtro de Fecha y Horario

**Archivos:** `02_Codigo/index.html`

- En `.date-section`:
  - Añadir `<input type="date" id="input-date-picker" class="date-picker-input" aria-label="Elegir fecha">`.
  - Añadir `<button id="btn-today" class="btn-today" aria-label="Ir a la fecha de hoy">Hoy</button>`.
- Crear una nueva sección accesible de filtros antes de la leyenda:
  ```html
  <section class="card filters-section" aria-label="Filtros de horario y disponibilidad">
    <div class="filters-header">
      <span class="section-label">Filtrar horarios</span>
      <label class="filter-checkbox-label">
        <input type="checkbox" id="check-solo-disponibles" class="filter-checkbox" />
        <span>Solo disponibles</span>
      </label>
    </div>
    <div class="filter-pills" role="toolbar" aria-label="Franja horaria">
      <button class="filter-pill active" data-franja="todas" aria-pressed="true">Todas</button>
      <button class="filter-pill" data-franja="manana" aria-pressed="false">Mañana (07-12)</button>
      <button class="filter-pill" data-franja="tarde" aria-pressed="false">Tarde (12-18)</button>
      <button class="filter-pill" data-franja="noche" aria-pressed="false">Noche (18-22)</button>
    </div>
  </section>
  ```
- **Entregable:** Marcado semántico y accesible integrado en el DOM.

---

### Tarea 2 — `styles.css`: Estilos para Filtros y Selector de Fecha

**Archivos:** `02_Codigo/styles.css`

- Estilos para `.date-picker-input` (estilizado con tokens oscuros, bordes redondeados y cursor pointer).
- Estilos para `.btn-today` (botón sutil que resalta al no estar en la fecha actual).
- Estilos para `.filters-section`, `.filters-header`, `.filter-checkbox-label`, `.filter-checkbox`.
- Estilos para `.filter-pills` y `.filter-pill`: botones compactos con transiciones suaves, hover y clase `.active` con gradiente coherente con el sistema de diseño.
- Estilos para `.empty-grid-state`: contenedor para mensaje cuando ningún bloque coincide con los filtros.
- Ajustes responsivos en `@media (max-width: 480px)` para asegurar que las píldoras de franja y el input de fecha se acomoden sin desbordar.
- **Entregable:** Interfaz moderna, integrada con la paleta visual del proyecto.

---

### Tarea 3 — `app.js`: Extensión de Estado, Lógica de Filtrado y Renderizado

**Archivos:** `02_Codigo/app.js`

- Extender `AppState.filtros` con `franjaHoraria: 'todas'` y `soloDisponibles: false`.
- Implementar la función `filtrarBloques(bloques)` que aplica los filtros de franja y disponibilidad.
- Actualizar `renderCuadricula()`:
  - Si la lista de bloques filtrados está vacía, renderizar el mensaje de estado vacío con botón para limpiar filtros.
- Implementar `renderFiltros()`:
  - Sincronizar el valor de `input-date-picker` con `AppState.filtros.fechaSeleccionada`.
  - Actualizar clases activas y `aria-pressed` en los botones `.filter-pill`.
  - Sincronizar el checkbox `#check-solo-disponibles`.
  - Mostrar/ocultar o deshabilitar botón `#btn-today` si la fecha actual ya es hoy.
- Integrar `renderFiltros()` en `renderAll()`.
- **Entregable:** Lógica pura de filtrado y sincronización unidireccional con el estado.

---

### Tarea 4 — `app.js`: Event Listeners Centralizados y Pruebas de Integración

**Archivos:** `02_Codigo/app.js`

- Añadir event listener `change` para `#input-date-picker`:
  - Valida la fecha, actualiza `AppState.filtros.fechaSeleccionada` y llama a `renderAll()`.
- Añadir event listener `click` para `#btn-today`:
  - Asigna `fechaHoy()` a `AppState.filtros.fechaSeleccionada` y llama a `renderAll()`.
- Añadir event listener delegado en `.filter-pills` para clicks en `.filter-pill`:
  - Lee `data-franja`, actualiza `AppState.filtros.franjaHoraria` y llama a `renderAll()`.
- Añadir event listener `change` en `#check-solo-disponibles`:
  - Actualiza `AppState.filtros.soloDisponibles` y llama a `renderAll()`.
- Sincronizar botones existentes `#btn-prev-day` y `#btn-next-day` para que también actualicen el selector directo de fecha.
- **Entregable:** Experiencia interactiva fluida y sincronización completa de controles.
