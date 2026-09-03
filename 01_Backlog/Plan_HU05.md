[APROBADO]
# HU-05 — Ficha Informativa de Espacio

## Historia de Usuario

**Como** vecino del barrio,  
**quiero** consultar la ficha informativa de cada espacio (capacidad, aforo y equipamiento),  
**para** conocer las condiciones del lugar antes de realizar una reserva.

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | Al seleccionar un espacio desde la barra de tabs, el sistema debe mostrar su **ficha informativa** de forma inmediata, sin modal adicional. |
| RF-02 | La ficha debe mostrar como mínimo: **Nombre**, **Ícono**, **Capacidad total** (personas), **Aforo permitido** (porcentaje de la capacidad), **Descripción** y **Equipamiento** (lista de ítems disponibles). |
| RF-03 | El **aforo permitido** se calcula como: `Math.round(capacidad * 0.75)` personas (75% del total, según norma de uso comunitario). |
| RF-04 | El **equipamiento** de cada espacio es una lista de strings almacenada en el objeto `Espacio` en `data.js`. |
| RF-05 | La ficha debe ser **reactiva**: al cambiar de tab de espacio, se actualiza automáticamente con los datos del nuevo espacio seleccionado. |

### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | La ficha informativa se renderiza dentro de la sección `card` existente de tabs (`#tabs-section`), bajo la barra de selección, sin añadir nuevas `card` al layout. |
| RNF-02 | Reutilizar los tokens CSS existentes (`--color-disponible`, `--text-secondary`, `--radius-md`, etc.). No usar inline styles. |
| RNF-03 | La ficha debe renderizarse en menos de 50ms (operación completamente síncrona, sin I/O). |
| RNF-04 | El diseño debe ser responsivo y adaptarse al breakpoint de 480px definido en `styles.css`. |

### Criterios de Aceptación

- [ ] Al seleccionar cada tab de espacio, aparece la ficha informativa del espacio seleccionado debajo de los tabs.
- [ ] La ficha muestra correctamente: nombre, ícono, capacidad, aforo (calculado al 75%), descripción y lista de equipamiento.
- [ ] Al cambiar de tab, la ficha se actualiza reactivamente con los datos del nuevo espacio.
- [ ] Los datos de `equipamiento` están definidos en `data.js` para los 3 espacios.

---

## 2. Modelo de Datos y Estado

### Extensión de la Entidad `Espacio`

Se amplían los 3 objetos del array `ESPACIOS` en `data.js` añadiendo el campo `equipamiento` (array de strings):

```json
{
  "id": "salon_comunal",
  "nombre": "Salón Comunal",
  "icono": "🏛️",
  "capacidad": 80,
  "descripcion": "Salón principal para eventos y reuniones grandes",
  "equipamiento": [
    "🎤 Sistema de sonido",
    "📽️ Proyector y pantalla",
    "💡 Iluminación regulable",
    "🪑 80 sillas y 10 mesas",
    "❄️ Aire acondicionado"
  ]
}
```

```json
{
  "id": "cancha",
  "nombre": "Cancha",
  "icono": "⚽",
  "capacidad": 30,
  "descripcion": "Cancha polideportiva techada para deportes y actividades físicas",
  "equipamiento": [
    "⚽ Arcos de fútbol",
    "🏀 Tableros de baloncesto",
    "🔦 Iluminación LED",
    "🚿 Vestuarios y duchas",
    "🏁 Marcadores de cancha"
  ]
}
```

```json
{
  "id": "sala_juntas",
  "nombre": "Sala de Juntas",
  "icono": "📋",
  "capacidad": 20,
  "descripcion": "Sala de reuniones para comités y juntas de vecinos",
  "equipamiento": [
    "💻 TV/Monitor para presentaciones",
    "🖊️ Pizarrón blanco",
    "📡 WiFi dedicado",
    "🪑 20 sillas ergonómicas",
    "☕ Zona de café"
  ]
}
```

### Cálculo del Aforo

```
aforo = Math.round(espacio.capacidad * 0.75)
```

Ejemplo: Salón Comunal → `Math.round(80 * 0.75)` = **60 personas**.

### Estado Global (`AppState`) — Sin cambios

No se requieren modificaciones al `AppState`. El espacio activo ya está disponible en `AppState.filtros.espacioSeleccionado` y `AppState.espacios`. La ficha se renderiza directamente al invocar `renderAll()` o al cambiar de tab.

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

### Punto de Integración

La ficha informativa se inserta como un sub-componente **dentro** de `#tabs-section` (`.card`), inmediatamente debajo del contenedor `#tabs-container`. Esto la mantiene visualmente asociada a la selección de espacio y no fragmenta el layout.

### Wireframe — Ficha Informativa (dentro de `.tabs-section`)

```
┌──────────────────────────────────────────────────────┐
│  Seleccionar espacio                                  │
│  [ 🏛️ Salón Comunal ●]  [ ⚽ Cancha ]  [ 📋 Juntas ]  │
│  ─────────────────────────────────────────────────── │
│  ┌────────────────────────────────────────────────┐  │
│  │  🏛️  Salón Comunal                              │  │
│  │  Salón principal para eventos y reuniones.      │  │
│  │                                                 │  │
│  │  👥 Capacidad: 80 personas                      │  │
│  │  ✅ Aforo permitido: 60 personas                │  │
│  │                                                 │  │
│  │  🔧 Equipamiento:                               │  │
│  │   • 🎤 Sistema de sonido                        │  │
│  │   • 📽️ Proyector y pantalla                    │  │
│  │   • 💡 Iluminación regulable                    │  │
│  │   • 🪑 80 sillas y 10 mesas                     │  │
│  │   • ❄️ Aire acondicionado                       │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Interacciones Clave

| Acción del usuario | Respuesta del sistema |
|---|---|
| Carga inicial de la página | La ficha del primer espacio (Salón Comunal) se renderiza automáticamente. |
| Clic en tab "Cancha" | La ficha se actualiza reactivamente con los datos de la Cancha, incluyendo su equipamiento específico. |
| Clic en tab "Sala de Juntas" | La ficha muestra la información de la sala con sus 20 personas de capacidad y 15 de aforo. |

---

## 4. Desglose de Tareas de Desarrollo

> Estimación: Cada tarea toma menos de 4 horas (1 día de desarrollo en total).

---

### Tarea 1 — `data.js`: Ampliar el Modelo de Espacios

**Archivos:** `02_Codigo/data.js`

- Añadir el campo `equipamiento` (array de strings) a cada uno de los 3 objetos del array `ESPACIOS`:
  - `salon_comunal`: 5 ítems de equipamiento (sonido, proyector, iluminación, sillas/mesas, A/C).
  - `cancha`: 5 ítems (arcos, tableros, iluminación LED, vestuarios, marcadores).
  - `sala_juntas`: 5 ítems (TV/monitor, pizarrón, WiFi, sillas ergonómicas, zona de café).
- **No modificar** ninguna otra función ni estructura existente.
- **Entregable:** `ESPACIOS` con campo `equipamiento` completo para los 3 espacios.

---

### Tarea 2 — `index.html`: Añadir Contenedor de Ficha

**Archivos:** `02_Codigo/index.html`

- Dentro de `<section class="card tabs-section">`, añadir después de `<div id="tabs-container">`:

```html
<div id="ficha-espacio" class="ficha-espacio" aria-live="polite" aria-label="Ficha informativa del espacio seleccionado"></div>
```

- El `<div>` debe estar vacío al inicio; su contenido será inyectado por `app.js`.
- **Entregable:** Contenedor `#ficha-espacio` presente en el DOM, oculto visualmente hasta que `renderFichaEspacio()` lo pueble.

---

### Tarea 3 — `styles.css`: Estilos de la Ficha Informativa

**Archivos:** `02_Codigo/styles.css`

Añadir las siguientes clases antes del bloque `@media (max-width: 480px)`:

```css
/* === FICHA INFORMATIVA DE ESPACIO (HU-05) === */

.ficha-espacio {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.ficha-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.ficha-icono { font-size: 1.4rem; line-height: 1; }

.ficha-nombre {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.ficha-descripcion {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.85rem;
  line-height: 1.5;
}

.ficha-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
}

.ficha-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.7rem;
}

.ficha-stat strong { color: var(--text-primary); }

.ficha-equipamiento-titulo {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.ficha-equipamiento-lista {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ficha-equipamiento-lista li {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding-left: 0.25rem;
}
```

- Dentro del `@media (max-width: 480px)` existente, añadir:
  ```css
  .ficha-stats { gap: 0.5rem; }
  .ficha-stat  { font-size: 0.75rem; padding: 0.25rem 0.55rem; }
  ```
- **Entregable:** Ficha con diseño compacto, coherente con la paleta del sistema y responsiva en mobile.

---

### Tarea 4 — `app.js`: Función `renderFichaEspacio` e Integración

**Archivos:** `02_Codigo/app.js`

- Implementar la función `renderFichaEspacio()`:
  - Obtener el espacio activo: `AppState.espacios.find(e => e.id === AppState.filtros.espacioSeleccionado)`.
  - Calcular `aforo = Math.round(espacio.capacidad * 0.75)`.
  - Generar lista `<li>` por cada ítem del array `espacio.equipamiento`.
  - Inyectar el HTML resultante en `document.getElementById('ficha-espacio').innerHTML`.
  - Si `espacio` es `null/undefined`, inyectar string vacío como guard.
- Integrar `renderFichaEspacio()` al final de la función `renderAll()`, para que se ejecute en cada re-render completo.
- **Entregable:** La ficha se renderiza automáticamente en carga inicial y al cambiar de tab de espacio.
