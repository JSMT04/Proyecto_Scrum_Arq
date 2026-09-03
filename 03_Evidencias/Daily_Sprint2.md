# Evidencia de Sprint 2 — Daily Scrum e Incremento (HU-04, HU-05 & HU-06)

**Fecha:** 3 de Septiembre de 2026  
**Historias de Usuario Completadas:**  
- HU-04: Mensaje de Confirmación con Código Único  
- HU-05: Ficha Informativa de Espacio (Capacidad, Aforo y Equipamiento)  
- HU-06: Filtro de Espacios por Fecha u Horario Deseado  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Generación Automática de Comprobante (HU-04):** Al reservar, el sistema genera un código alfanumérico único (`CC-[ESPACIO]-[MMDD]-[DÍGITOS]`) y despliega un comprobante modal detallado para el vecino.
2. **Ficha Informativa Inline Reactiva (HU-05):** Permite al vecino consultar la ficha técnica de cada espacio (capacidad, aforo automático al 75% y lista de equipamiento) de forma inmediata al pie de los tabs.
3. **Filtros Avanzados de Fecha y Horario (HU-06):** El vecino dispone de un selector nativo de calendario con atajo rápido "Hoy", filtro por 4 franjas horarias (Todas, Mañana, Tarde, Noche) y conmutador "Solo disponibles", agilizando la búsqueda sin recargar la página.

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se desarrollaron, auditaron y validaron con QA las Historias de Usuario **HU-04**, **HU-05** y **HU-06**.
- Para la **HU-06**, se incorporaron los controles de fecha directa (`#input-date-picker`, `#btn-today`) y el panel semántico de filtros (`.filters-section`) en `index.html`.
- Se añadieron los estilos CSS correspondientes en `styles.css` con diseño adaptativo en móviles (<480px) y estado vacío (`.empty-grid-state`).
- Se implementó la función pura `filtrarBloques()`, la sincronización en `renderFiltros()` y los event listeners reactivos en `app.js`.
- Se validó el 100% de la Definition of Done mediante la suite automatizada `test_qa_hu06.js` obteniendo dictamen **`PASÓ`**.

### ¿Qué se hará después?
- Realizar la demostración completa del prototipo SPA del Sprint 2 ante el Product Owner.
- Consolidar la documentación final e iniciar la retrospectiva de la iteración.

### ¿Existe algún impedimento?
- Ninguno. El prototipo es totalmente retrocompatible y cumple con los requerimientos funcionales y no funcionales aprobados.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en cualquier navegador web moderno.

### Paso 1: Selección Directa de Fecha y Atajo "Hoy" (HU-06)
1. En la sección de fecha, hacer clic sobre el selector de fecha nativo (`input[type="date"]`) y cambiar el día a una fecha futura (ej. el próximo viernes).
2. **Verificación:** La cuadrícula y la cabecera de fecha se actualizan inmediatamente al día seleccionado. El botón **"Hoy"** se habilita sin la marca de verificación.
3. Hacer clic en el botón **"Hoy"**.
4. **Verificación:** La vista regresa instantáneamente al día actual y el botón cambia a **"✓ Hoy"**.

### Paso 2: Filtrado por Franja Horaria (HU-06)
1. En el panel de filtros, hacer clic en la píldora **"Mañana (07-12)"**.
2. **Verificación:** La cuadrícula solo despliega los bloques comprendidos entre las 07:00 y las 11:00.
3. Hacer clic en la píldora **"Tarde (12-18)"** y **"Noche (18-22)"** para verificar la adaptación instantánea de los bloques.

### Paso 3: Filtro "Solo disponibles" y Estado Vacío (HU-06)
1. Marcar el checkbox **"Solo disponibles"**.
2. **Verificación:** Se ocultan todos los horarios en estado Ocupado o Pendiente, mostrando únicamente las horas libres para reservar.
3. Si en la combinación de filtros no existen bloques disponibles, se muestra el estado vacío *"No se encontraron horarios con los filtros seleccionados."* con el botón **"Restablecer filtros"**.
4. Hacer clic en **"Restablecer filtros"**.
5. **Verificación:** Todos los filtros regresan a su valor por defecto y se vuelven a mostrar todos los horarios.

### Paso 4: Ficha Informativa y Comprobante de Reserva (HU-05 & HU-04)
1. Cambiar de espacio entre **Salón Comunal**, **Cancha** y **Sala de Juntas** observando cómo se actualiza la ficha informativa con capacidad, aforo y equipamiento.
2. Hacer clic en una hora disponible, llenar el formulario y confirmar.
3. **Verificación:** Se despliega el comprobante modal con el código único de confirmación (ej. `CC-SAL-0903-XXXX`).
