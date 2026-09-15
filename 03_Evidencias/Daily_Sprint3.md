# Evidencia de Sprint 3 — Daily Scrum e Incremento (HU-07 & HU-08)

**Fecha:** 14 de Septiembre de 2026  
**Historias de Usuario Completadas:**  
- HU-07: Historial de Reservas Activas y Pasadas del Vecino  
- HU-08: Reglamento de Uso de Instalaciones  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)  

---

## 1. Resumen del Incremento (Sprint Review)

1. **Consulta Personal de Historial (HU-07):** Permite a cualquier vecino registrado consultar su historial personal de reservas activas y pasadas mediante su número telefónico de contacto desde un modal dedicado accesible en la barra principal.
2. **Clasificación Automática por Fecha (HU-07):** Categoriza dinámicamente las reservas en dos secciones bien diferenciadas: **Próximas** (`fecha >= hoy`) y **Pasadas** (`fecha < hoy`), facilitando el control personal del usuario.
3. **Consulta de Reglamento Comunitario (HU-08):** Incorpora un acceso directo en la cabecera (**📜 Reglamento**) para desplegar un panel modal interactivo con la normativa oficial de uso de espacios comunitarios.
4. **Organización Temática por Acordeón (HU-08):** Despliega el reglamento organizado en 5 secciones temáticas (Normas Generales, Salón Comunal, Cancha Polideportiva, Sala de Juntas y Sanciones) mediante un acordeón exclusivo animado y accesible (`aria-expanded`).

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se diseñaron, desarrollaron, auditaron y validaron las Historias de Usuario **HU-07** (Historial) y **HU-08** (Reglamento).
- En `data.js`, se añadió la constante estática `REGLAMENTO` con las 5 secciones normativas del centro comunitario.
- En `index.html`, se agregaron los botones `#btn-mis-reservas` y `#btn-reglamento` en el header, así como los paneles overlays `#historial-overlay` y `#reglamento-overlay`.
- En `styles.css`, se implementaron estilos glassmorphism responsivos para los modales, listas de tarjetas, insignias de estado y animaciones del acordeón colapsable.
- En `app.js`, se integraron los controladores `renderReglamento()`, `alternarSeccionReglamento()`, `abrirReglamento()`, `cerrarReglamento()`, control de teclado (`Escape`) y la reactividad con `AppState.ui.reglamento`.
- QA auditó la entrega de la HU-08 y emitió dictamen **`PASÓ`** aprobando los 3 criterios de la Definition of Done.

### ¿Qué se hará después?
- Presentar la demostración en vivo de las Historias de Usuario (HU-01 a HU-08) ante el Product Owner durante la sesión de Sprint Review.
- Consolidar la entrega final del proyecto Scrum.

### ¿Existe algún impedimento?
- Ninguno. El prototipo es 100% funcional, retrocompatible y no requiere dependencias ni infraestructura de servidor.

---

## 3. Guía de Demostración Paso a Paso (Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` en cualquier navegador web moderno.

### Parte A: Demostración de HU-07 (Historial de Reservas)
1. En la barra superior (header), hacer clic en el botón **"📋 Mis Reservas"**.
2. **Verificación:** Se despliega el panel del historial.
3. Ingresar el número de teléfono `3001112233` y presionar **Enter** o clic en **"Buscar"**.
4. **Verificación:** Se visualizan dos categorías (**📅 Próximas** y **📁 Pasadas**) con tarjetas que detallan espacio, fecha, horario, código de comprobante y badge de estado.
5. Probar una búsqueda con `3000000000` para verificar el estado de buzón vacío.
6. Cerrar el modal mediante la **✕**, clic en el overlay o tecla `Escape`.

### Parte B: Demostración de HU-08 (Reglamento de Uso)
1. En la barra superior (header), hacer clic en el botón **"📜 Reglamento"**.
2. **Verificación:** Se despliega la ventana modal `#reglamento-overlay` con el título **"📜 Reglamento de Uso"** y el acordeón colapsable.
3. **Apertura por Defecto:** Verificar que la primera sección (**📋 Normas Generales**) se encuentra desplegada automáticamente mostrando sus reglas.
4. **Navegación del Acordeón:** Hacer clic en la sección **"🏛️ Normas — Salón Comunal"**.
5. **Verificación:** Se contrae la sección anterior y se expande suavemente el cuerpo con las normas del Salón Comunal, rotando el chevron indicador (`▲`).
6. Probar la apertura de la sección **"⚠️ Sanciones por Incumplimiento"** para revisar los términos disciplinarios.
7. **Cierre:** Presionar la tecla **Escape**, hacer clic en el botón de cierre **✕** o hacer clic fuera del panel.
8. **Verificación:** El modal se cierra limpiamente y se devuelve el foco a la aplicación principal.
