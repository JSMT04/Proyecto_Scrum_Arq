# Evidencia de Sprint 2 — Daily Scrum e Incremento (HU-04 & HU-05)

**Fecha:** 3 de Septiembre de 2026  
**Historias de Usuario Completadas:**  
- HU-04: Mensaje de Confirmación con Código Único  
- HU-05: Ficha Informativa de Espacio (Capacidad, Aforo y Equipamiento)  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Generación Automática de Comprobante (HU-04):** Al solicitar una reserva, el sistema calcula de forma síncrona un código alfanumérico único (`CC-[ESPACIO]-[MMDD]-[DÍGITOS]`) y despliega un comprobante modal con la información de la reserva para el vecino.
2. **Ficha Informativa Inline Reactiva (HU-05):** El vecino puede consultar inmediatamente la ficha técnica del espacio seleccionado al pie de los tabs. La ficha incluye nombre, ícono, capacidad total de personas, aforo norma comunitaria (calculado automáticamente al 75%) y lista detallada de equipamiento.
3. **Persistencia y Actualización Dinámica:** Cambiar de tab actualiza de manera instantánea tanto la cuadrícula de disponibilidad como la ficha informativa sin recargar la página ni usar modales invasivos.

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se desarrollaron, auditaron y validaron con QA las Historias de Usuario **HU-04** y **HU-05**.
- Para la **HU-05**, se amplió el modelo `ESPACIOS` en `data.js` agregando el campo `equipamiento` para Salón Comunal, Cancha y Sala de Juntas.
- Se agregó el contenedor `#ficha-espacio` en `index.html`, los estilos CSS correspondientes en `styles.css` con responsive design para mobile (<480px) y la función `renderFichaEspacio()` en `app.js`.
- Se validaron todos los criterios de aceptación mediante pruebas sintácticas y ejecuciones de QA automatizadas (`test_qa_hu05.js`) con resultado `PASÓ`.

### ¿Qué se hará después?
- Preparar la demostración final del prototipo interactivo SPA ante el Product Owner y los stakeholders de la comunidad.
- Realizar la retrospectiva del Sprint 2.

### ¿Existe algún impedimento?
- Ninguno. El prototipo cumple con el 100% de los requerimientos y la retrocompatibilidad total con Sprint 1 y Sprint 2.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en un navegador web.

### Paso 1: Consultar Ficha Informativa del Salón Comunal (HU-05)
1. Observar la sección superior de selección de espacios. El tab **"Salón Comunal"** se encuentra seleccionado por defecto.
2. **Verificación:** Inmediatamente debajo de los tabs aparece la ficha informativa del Salón Comunal mostrando:
   - 👥 **Capacidad total:** 80 personas
   - ✅ **Aforo permitido (75%):** 60 personas
   - 🔧 **Equipamiento:** Sistema de sonido, proyector y pantalla, iluminación regulable, 80 sillas y 10 mesas, A/C.

### Paso 2: Cambiar a Cancha y Validar Reactividad (HU-05)
1. Hacer clic sobre el tab **"Cancha"**.
2. **Verificación:** La ficha informativa se actualiza de manera instantánea mostrando:
   - 👥 **Capacidad total:** 30 personas
   - ✅ **Aforo permitido (75%):** 23 personas
   - 🔧 **Equipamiento:** Arcos de fútbol, tableros de baloncesto, iluminación LED, vestuarios y duchas, marcadores.

### Paso 3: Cambiar a Sala de Juntas (HU-05)
1. Hacer clic sobre el tab **"Sala de Juntas"**.
2. **Verificación:** La ficha se actualiza para mostrar 20 personas de capacidad, 15 de aforo y su equipamiento técnico (TV/Monitor, pizarrón, WiFi, etc.).

### Paso 4: Solicitar Reserva y Obtener Comprobante (HU-04)
1. Seleccionar cualquier horario **Disponible** de la Sala de Juntas.
2. Diligenciar el formulario con Nombre y Teléfono y pulsar **"Solicitar Reserva"**.
3. **Verificación:** Aparece el modal de comprobante con el código único generado (ej. `CC-JUN-0903-XXXX`).
