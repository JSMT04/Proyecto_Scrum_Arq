[APROBADO]

# HU-02 — Solicitar Reserva de Espacio

> **Veredicto del Revisor Técnico Senior**
> 
> El plan técnico generado por el Planificador es **viable, eficiente y coherente** con la arquitectura establecida en la HU01. No presenta sobreingeniería y el desglose de tareas es adecuado para ser completado ágilmente en el Sprint actual. 
> 
> A continuación, se presenta la versión pulida lista para el programador.

---

## Historia de Usuario

**Como** vecino del barrio,  
**quiero** solicitar una reserva registrando mis datos de contacto,  
**para** asegurar el espacio deseado.

---

## 1. Requerimientos Funcionales y No Funcionales

### Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF-01 | El sistema debe permitir al usuario hacer clic en un bloque horario **Disponible** para iniciar el proceso de reserva. |
| RF-02 | Al hacer clic, se debe desplegar un **formulario modal** con los detalles pre-llenados (Espacio, Fecha, Hora de inicio). |
| RF-03 | El formulario debe solicitar los datos de contacto obligatorios del vecino: **Nombre completo** y **Teléfono**. |
| RF-04 | El sistema debe validar que los campos obligatorios no estén vacíos antes de permitir enviar la solicitud. |
| RF-05 | Al enviar el formulario, se debe crear una nueva reserva con estado **"pendiente"** en el origen de datos. |
| RF-06 | Tras una solicitud exitosa, el modal debe cerrarse, mostrar un aviso visual de éxito (opcional pero recomendado), y la cuadrícula debe actualizarse inmediatamente para reflejar el nuevo estado (Pendiente). |

### No Funcionales (RNF)

| ID | Descripción |
|----|-------------|
| RNF-01 | El formulario debe ser **accesible** y responsivo (adaptable a móviles). |
| RNF-02 | El estado de la nueva reserva debe persistir en memoria (simulando persistencia en `data.js`). |
| RNF-03 | No debe ser posible abrir el formulario para bloques en estado "Ocupado" o "Pendiente". |

### Criterios de Aceptación

- [ ] Dado que visualizo un bloque disponible, al hacerle clic se abre un modal de reserva.
- [ ] El modal exige nombre y teléfono. Si se intenta enviar vacío, muestra advertencias de validación HTML5.
- [ ] Tras enviar correctamente, el bloque reservado cambia visualmente a estado "Pendiente" (color ámbar).
- [ ] La nueva reserva se refleja en la UI sin necesidad de recargar la página.

---

## 2. Modelo de Datos y Estado

### Entidades Afectadas

Se extenderá el uso del objeto `Reserva` integrando los datos de contacto:

```json
{
  "id": "rsv-XXX",                // Generado dinámicamente (ej. Date.now().toString())
  "espacioId": "cancha",          // Del AppState actual
  "fecha": "2026-09-05",          // Del AppState actual
  "horaInicio": "14:00",          // Del bloque seleccionado
  "horaFin": "15:00",             // +1 hora por defecto a la hora de inicio
  "estado": "pendiente",          // Fijo para nuevas reservas
  "vecinoId": "vec-nuevo",        // String genérico
  "datosContacto": {              // NUEVO: Info del formulario
    "nombre": "Juan Pérez",
    "telefono": "555-1234"
  }
}
```

### Estado Global (`AppState`)

Se añade control de UI para el modal en `app.js`:

```json
{
  "ui": {
    "modalReserva": {
      "abierto": false,
      "bloqueSeleccionado": "14:00" // Hora de inicio o null
    }
  }
}
```

---

## 3. Flujo de Interfaz de Usuario (UI/UX)

### Wireframe Modal de Reserva

```
┌──────────────────────────────────────────────┐
│  [Fondo oscuro semi-transparente - Overlay]  │
│  ┌────────────────────────────────────────┐  │
│  │ Solicitar Reserva                  [X] │  │
│  ├────────────────────────────────────────┤  │
│  │ 📍 Espacio: Cancha                     │  │
│  │ 📅 Fecha: 05 de Sep 2026               │  │
│  │ ⏰ Horario: 14:00 a 15:00              │  │
│  │                                        │  │
│  │ Tu Nombre completo *                   │  │
│  │ [____________________________________] │  │
│  │                                        │  │
│  │ Teléfono de contacto *                 │  │
│  │ [____________________________________] │  │
│  │                                        │  │
│  │ [ Cancelar ]          [ Solicitar ]    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Interacciones clave

| Acción | Respuesta |
|---|---|
| Clic en bloque Disponible | Abre modal, inyecta info del espacio/fecha/hora actual. |
| Clic en Cancelar o [X] | Cierra modal, limpia los inputs del formulario. |
| Enviar Formulario (Inválido) | Navegador muestra validación nativa (`required`). |
| Enviar Formulario (Válido) | Crea reserva, actualiza `data.js`, re-renderiza y cierra modal. |

---

## 4. Desglose de Tareas de Desarrollo

### Tarea 1 — Actualizar HTML Base (`index.html`)
- Añadir el markup del modal al final del `body` (fuera de `.main`). Usar estructura semántica.
- Añadir `<form>` con campos `<input required>` para nombre y teléfono.
- **Entregable:** Estructura HTML del modal lista.

### Tarea 2 — Estilos del Modal (`styles.css`)
- Clases para el overlay (`position: fixed`, fondo oscuro) y modal (`z-index` alto, glassmorphism).
- Estilizar el formulario y botones siguiendo la estética visual premium (HU01).
- Animaciones básicas para abrir/cerrar.
- **Entregable:** Modal visualmente atractivo y responsivo.

### Tarea 3 — Lógica de Datos (`data.js`)
- Implementar y exportar `agregarReserva(reserva)` que añada la nueva reserva al arreglo `RESERVAS`.
- **Entregable:** Función para persistir reservas mockeadas.

### Tarea 4 — Lógica de Controlador UI (`app.js`)
- Funciones para abrir (`abrirModal(hora)`) y cerrar (`cerrarModal()`) el modal.
- Configurar event listeners en los bloques `.slot-disponible` para ejecutar `abrirModal`.
- Configurar cierres desde botón X, botón Cancelar y clic en el overlay.
- **Entregable:** Modal interactivo de apertura y cierre.

### Tarea 5 — Envío de Reserva y Reactividad (`app.js`)
- Escuchar el `submit` del formulario.
- Prevenir recarga (`e.preventDefault()`).
- Construir el objeto de reserva con los datos del form y estado actual.
- Invocar `agregarReserva()`.
- Ejecutar `cerrarModal()` y forzar `actualizarDatos()` para re-renderizar la UI.
- **Entregable:** Proceso de reserva completo y visible en tiempo real.
