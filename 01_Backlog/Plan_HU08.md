[APROBADO]

# Plan de Arquitectura — HU08: Reglamento de Uso de Instalaciones

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales

- **RF-01:** El sistema debe ofrecer un punto de acceso visible al reglamento desde la interfaz principal (botón en el header o sección fija).
- **RF-02:** El reglamento se organizará por secciones temáticas: Normas Generales, Normas por Espacio (Salón Comunal, Cancha, Sala de Juntas) y Sanciones.
- **RF-03:** Cada sección debe poder expandirse y contraerse de forma independiente (acordeón), para facilitar la lectura selectiva.
- **RF-04:** El contenido del reglamento es estático (definido en el código), no requiere backend ni persistencia en `localStorage`.
- **RF-05:** Un enlace o botón de cierre debe permitir regresar a la vista principal sin perder el estado de la aplicación.

### No Funcionales

- **RNF-01 (Usabilidad):** El reglamento debe ser legible y bien estructurado con jerarquía visual clara (título, subtítulo, lista de normas).
- **RNF-02 (Responsive):** La vista del reglamento debe adaptarse correctamente a pantallas móviles (≤480px).
- **RNF-03 (Consistencia):** Utilizar el mismo sistema de diseño visual (variables CSS, tipografía Inter, cards con glassmorphism) que el resto de la SPA.
- **RNF-04 (Accesibilidad):** Las secciones del acordeón deben usar `aria-expanded` para lectores de pantalla.

---

## 2. Modelo de Datos y Estado

El reglamento es contenido **estático** definido directamente en JavaScript como un array de objetos. No requiere campo en `localStorage` ni cambios en `data.js`.

```javascript
// Constante de solo lectura en app.js (o data.js)
const REGLAMENTO = [
  {
    id: "general",
    titulo: "📋 Normas Generales",
    normas: [
      "Las instalaciones son de uso exclusivo para vecinos registrados del barrio.",
      "El uso de los espacios requiere reserva previa a través del sistema.",
      "Se debe respetar el horario reservado. El incumplimiento puede dar lugar a sanciones.",
      "No se permite el ingreso de personas en estado de embriaguez o bajo sustancias.",
      "El vecino responsable de la reserva es responsable del cuidado del espacio."
    ]
  },
  {
    id: "salon_comunal",
    titulo: "🏛️ Normas — Salón Comunal",
    normas: [
      "Capacidad máxima permitida: 60 personas (75% del aforo total).",
      "El uso de equipos de sonido debe cesar a las 22:00 horas.",
      "El salón debe entregarse limpio y en orden al finalizar el evento.",
      "No se permite el uso de velas, bengalas u objetos de fuego.",
      "La decoración no debe dañar paredes, techos ni mobiliario."
    ]
  },
  {
    id: "cancha",
    titulo: "⚽ Normas — Cancha Polideportiva",
    normas: [
      "El uso de la cancha requiere calzado deportivo adecuado.",
      "Está prohibido ingresar alimentos o bebidas a la cancha.",
      "La iluminación nocturna se apagará automáticamente a las 22:00 horas.",
      "No se permite el uso de la cancha para actividades distintas al deporte.",
      "Los implementos deportivos deben ser devueltos al finalizar la reserva."
    ]
  },
  {
    id: "sala_juntas",
    titulo: "📋 Normas — Sala de Juntas",
    normas: [
      "Capacidad máxima: 20 personas sentadas.",
      "El espacio es exclusivo para reuniones, comités y juntas de vecinos.",
      "El uso del proyector y pizarrón debe ser solicitado con anticipación.",
      "No se permiten eventos de carácter festivo o social en este espacio.",
      "Dejar el espacio ordenado y con el equipo apagado al finalizar."
    ]
  },
  {
    id: "sanciones",
    titulo: "⚠️ Sanciones por Incumplimiento",
    normas: [
      "El incumplimiento reiterado resultará en suspensión temporal del derecho a reserva.",
      "Los daños materiales causados serán responsabilidad del vecino que realizó la reserva.",
      "Las reservas no utilizadas sin cancelación previa contarán como falta.",
      "Tres faltas acumuladas en un semestre implican la inhabilitación por 30 días."
    ]
  }
];
```

### Nuevo estado en `AppState.ui`

```javascript
// Agregar dentro de AppState.ui:
reglamento: { abierto: false }
```

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

1. **Punto de entrada:** Se agrega un botón **"📜 Reglamento"** en el `header-right`, junto al botón existente **"📋 Mis Reservas"**.
2. **Vista del Reglamento:** Al hacer clic, se despliega un overlay de pantalla completa (similar al historial HU-07) con:
   - Encabezado con título "📜 Reglamento de Uso" y subtítulo descriptivo.
   - Botón de cierre **✕** en la esquina superior derecha.
3. **Acordeón de Secciones:** El cuerpo del panel muestra las secciones del `REGLAMENTO` como ítems de acordeón:
   - Cada ítem tiene un **encabezado clicable** con el título de la sección y una flecha indicadora (`▼`/`▲`).
   - Al hacer clic en el encabezado, se expande el cuerpo con la lista de normas.
   - Solo una sección puede estar abierta a la vez (acordeón exclusivo).
   - La primera sección ("Normas Generales") se abre por defecto al entrar.
4. **Cierre:** Botón **✕**, clic en el fondo del overlay o tecla `Escape`.

---

## 4. Desglose de Tareas de Desarrollo

| # | Tarea | Archivos | Estimación |
|---|-------|----------|------------|
| 1 | **Datos estáticos del reglamento:** Definir la constante `REGLAMENTO` como array de objetos en `data.js`. | `data.js` | 1 hora |
| 2 | **Botón de acceso en el header:** Agregar el botón `#btn-reglamento` junto al botón de historial en `index.html`. | `index.html` | 30 min |
| 3 | **Estructura HTML del panel:** Crear el overlay `#reglamento-overlay` con encabezado, contenedor de acordeón `#reglamento-acordeon` y estado de carga. | `index.html` | 1 hora |
| 4 | **Estilos CSS del panel y acordeón:** Estilos para `.reglamento-panel`, `.acordeon-item`, `.acordeon-header`, `.acordeon-body` (con animación de altura), `.acordeon-chevron` y responsive. Reutilizar variables CSS existentes. | `styles.css` | 2 horas |
| 5 | **Lógica JS de renderizado:** Función que recorra `REGLAMENTO` y genere dinámicamente el HTML del acordeón con IDs únicos por sección. Apertura automática de la primera sección. | `app.js` | 2 horas |
| 6 | **Interactividad JS del acordeón:** Lógica de toggle (colapsar la sección activa y expandir la seleccionada) con actualización de `aria-expanded` y rotación del chevron. | `app.js` | 1.5 horas |
| 7 | **Prueba integral:** Verificar apertura/cierre del modal, funcionamiento del acordeón, compatibilidad con HUs previas y responsive en móvil. | — | 1 hora |

**Tiempo total estimado:** ~9 horas (≈ 1.5 días de trabajo) ✅ Viable dentro del Sprint.

---

## Dependencias

- Reutiliza el patrón de overlay/panel de **HU-07** (`.historial-overlay` → `.reglamento-overlay`).
- Reutiliza estilos: `.modal-close-btn`, `.btn`, variables CSS de color y tipografía.
- **No requiere cambios** a `availability.js`.
- El botón en `header-right` se agrega junto al botón existente `#btn-mis-reservas`.
