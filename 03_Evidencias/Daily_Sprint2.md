# Evidencia de Sprint 2 — Daily Scrum e Incremento (HU-04)

**Fecha:** 3 de Septiembre de 2026  
**Historia de Usuario Completada:** HU-04 (Mensaje de Confirmación con Código Único)  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Generación Automática de Comprobante:** Al solicitar una reserva, el sistema calcula de forma síncrona un código alfanumérico único con el formato `CC-[ESPACIO]-[MMDD]-[DÍGITOS]` (ej. `CC-SAL-0903-7342`) para garantizar la autenticidad de la solicitud.
2. **Modal de Comprobante Resaltado:** Tras la reserva, se despliega automáticamente un modal informativo accesible con la información del vecino, fecha, horario y el código de comprobante destacado visualmente sobre fondo contrastante y tipografía monoespaciada.
3. **Consulta de Comprobante en Gestión:** Al consultar o gestionar cualquier reserva previa (flujo HU-03), el sistema recupera y muestra su código de comprobante registrado, garantizando retrocompatibilidad con las reservas existentes.

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se planificó, auditó, desarrolló y validó la **HU-04 (Mensaje de confirmación con código único de reserva)**.
- Se agregaron las funciones `generarCodigoConfirmacion` en `data.js`, y `abrirModalComprobante` / `cerrarModalComprobante` en `app.js`.
- Se incorporaron las estructuras HTML en `index.html` y los estilos CSS específicos en `styles.css` con tipografía monoespaciada y efectos de brillo/resaltado.
- Se ejecutó el pipeline de pruebas de QA automatizadas en entorno Node.js/VM, obteniendo dictamen **`PASÓ`** con 100% de cumplimiento en la Definition of Done.

### ¿Qué se hará después?
- Realizar la demostración técnica ante el Product Owner.
- Continuar con el desglose y planificación de la siguiente Historia de Usuario asignada en el Product Backlog.

### ¿Existe algún impedimento?
- No hay impedimentos técnicos ni bloqueos registrados en la iteración actual.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en un navegador web.

### Paso 1: Crear una Nueva Reserva y Obtener Comprobante
1. Hacer clic en cualquier bloque horario con estado **Disponible (Verde)** en la cuadrícula.
2. Ingresar un nombre completo (ej. *"Ana Gómez"*) y un teléfono (ej. *"3001234567"*).
3. Hacer clic en el botón **"Solicitar Reserva"**.
4. **Verificación:** Se cierra el formulario de reserva y aparece de forma inmediata el modal de comprobante con el título *"✅ ¡Reserva Registrada!"*, mostrando el código único destacado (ej. `CC-SAL-0903-XXXX`).

### Paso 2: Cerrar Comprobante y Verificar Actualización de Estado
1. En el modal de comprobante, hacer clic en el botón **"Entendido"** (o presionar la tecla `Escape`).
2. **Verificación:** El modal de comprobante se cierra y la cuadrícula de horarios se actualiza mostrando la hora reservada en estado **Pendiente (Ámbar)**.

### Paso 3: Consultar Código de Confirmación en Modal de Gestión
1. Hacer clic sobre el bloque horario que se acaba de reservar (estado Ámbar/Pendiente).
2. **Verificación:** Se abre el modal de gestión (*"Gestionar Reserva"*) y se observa el campo **🔑 Código:** exhibiendo el mismo código de comprobante generado durante la reserva.
