# Evidencia de Sprint 1 — Daily Scrum e Incremento Final

**Fecha:** 31 de Agosto de 2026  
**Historias de Usuario Completadas:** HU-01 (Consulta), HU-02 (Solicitud) y HU-03 (Confirmación/Cancelación). 
**Historias Pendientes del Sprint 1:** HU04 (Código de confirmación) y HU05 (Ficha informativa).  
**Estado del Incremento:** Completado y Aprobado por QA (`PASÓ`)
**60% completado (3 de 5 Historias) / 73.3% por Puntos de Historia (11 de 15 pts).**

---

## 1. Resumen del Incremento (Sprint Review)

1. **HU-01 — Consulta en Tiempo Real:** SPA interactiva para consultar la disponibilidad de 15 bloques horarios (07:00 a 21:00) en 3 espacios comunitarios (*Salón Comunal, Cancha, Sala de Juntas*) con indicadores tricolor y polling de 30s.
2. **HU-02 — Solicitud de Reserva:** Flujo modal para registro de datos de contacto (*Nombre completo y Teléfono*) con validaciones activas, notificación toast y actualización automática del bloque a estado `pendiente` (Ámbar).
3. **HU-03 — Confirmación y Cancelación:** Gestión reactiva para confirmar o cancelar reservas registradas. La cancelación libera de forma inmediata el bloque horario cambiándolo a **Verde (Disponible)** en tiempo real sin recargar la página.

---

## 2. Registro de Daily Scrum

### ¿Qué se hizo hoy?
- Se planificaron, revisaron, desarrollaron y validaron las tres historias de usuario asignadas al Sprint 1 (**HU-01, HU-02 y HU-03**).
- Se actualizaron los módulos en `02_Codigo/` (`index.html`, `styles.css`, `data.js`, `app.js`, `availability.js`), integrando modales de gestión, validaciones, gestión de estados y notificaciones toast.
- Se realizaron las pruebas de QA completas con dictamen formal de **`PASÓ`** (11/11 puntos de historia verificados).
- *Modelos utilizados:* Célula multiagente en Antigravity IDE (Claude Sonnet 4.6, Claude Opus 4.6, Gemini 3.7 Flash y Gemini 3.6 Flash).

### ¿Qué se hará después?
- Realizar la demostración en vivo del prototipo ejecutable del Sprint 1 al Product Owner.
- Iniciar la planificación del Sprint 2 con las Historias de Usuario restantes (HU-04 en adelante).

### ¿Existe algún impedimento?
- Agotamiento de cuotas de LLM (Claude & Gemini): Se alcanzó el 0% de la cuota semanal en Antigravity durante la generación del código de la HU03.  
- Mitigación aplicada: Se migró la validación de QA a pruebas manuales locales y se asumió la síntesis de documentación vía fallback conversacional para mantener la continuidad sin detener el proyecto. 
---

## 3. Guía de Demostración Integrada (Paso a Paso para Demo en Vivo)

### Preparación
1. Abrir el archivo `02_Codigo/index.html` directamente en cualquier navegador web moderno.

### Pasos de la Demostración (HU-01 + HU-02 + HU-03)

| Paso | Acción del Scrum Master | Comportamiento Esperado de la Aplicación |
|:---:|---|---|
| **1** | Observar el encabezado y selección de espacio. | El título "Centro Comunitario" y la pestaña por defecto **"🏛️ Salón Comunal"** están activos. |
| **2** | Inspeccionar bloques horarios. | Se visualizan 15 bloques (07:00 a 21:00) con colores (*Verde: Disponible, Rojo: Ocupado, Ámbar: Pendiente*). |
| **3** | Hacer clic en un bloque **Disponible** (verde). | Se abre el modal **"Solicitar Reserva"** con los datos prefijados del espacio. |
| **4** | Diligenciar datos (*Carlos Gómez, 3001234567*) y enviar. | Modal se cierra, aparece notificación toast verde y el bloque cambia inmediatamente a **Ámbar (Pendiente)**. |
| **5** | Seleccionar el bloque en estado **Pendiente** (Ámbar) o abrir el panel de gestión. | Se despliegan las opciones **"Confirmar Reserva"** y **"Cancelar Reserva"**. |
| **6** | Hacer clic en **"Cancelar Reserva"**. | Aparece notificación Toast (*"Reserva cancelada"*), el bloque se libera y vuelve a **Verde (Disponible)** al instante en la cuadrícula. |
| **7** | Cambiar de pestaña (**"⚽ Cancha"** o **"💼 Sala de Juntas"**). | La cuadrícula actualiza sus datos en tiempo real manteniendo la consistencia de estados. |