# Proyecto Scrum - Centro Comunitario 🏘️

Sistema de gestión y consulta en tiempo real para la reserva de espacios comunitarios (Salón Comunal, Cancha y Sala de Juntas). Desarrollado siguiendo el marco de trabajo **Scrum** y buenas prácticas de ingeniería de software.

---

## 📋 Descripción del Proyecto

Este proyecto comprende la planificación, documentación y desarrollo de una aplicación web ligera, modular y responsiva para la consulta de disponibilidad y reserva de espacios en un Centro Comunitario.

El ciclo de desarrollo se documenta a través de artefactos Scrum formales, historias de usuario (HU), planes técnicos revisados, actas de conformación y reportes de calidad (QA).

---

## 🚀 Características Principales

- **Consulta en Tiempo Real:** Visualización instantánea del estado de los espacios organizados por bloques horarios.
- **Múltiples Espacios:** Gestión de espacios como Salón Comunal, Cancha Deportiva y Sala de Juntas.
- **Navegación por Fechas:** Selector interactivo para consultar disponibilidad en diferentes días.
- **Estados Claros:** Bloques codificados por colores y estados (*Disponible*, *Ocupado*, *Pendiente*).
- **Diseño Responsivo y Accesible:** Interfaz adaptable a dispositivos móviles y escritorio con estándares semánticos y de accesibilidad.

---

## 📁 Estructura del Repositorio

```text
Proyecto Scrum/
├── .agents/                    # Flujos y roles de trabajo de agentes automatizados
│   └── workflows/              # Roles: Planificador, Revisor, Desarrollador, QA, Sintetizador
├── 01_Backlog/                 # Gestión ágil y documentación de requerimientos
│   ├── Entregable_1_...        # Acta de Conformación del equipo
│   ├── Entregable_2_...        # Product Backlog priorizado
│   ├── Entregable_3_...        # Definition of Done (DoD)
│   ├── Plan_HU01.md            # Plan técnico HU-01 (Consulta en tiempo real)
│   ├── Plan_HU02.md            # Plan técnico HU-02
│   ├── Plan_HU03.md            # Plan técnico HU-03
│   ├── Plan_HU04.md            # Plan técnico HU-04
│   └── Proyecto_Scrum.pdf      # Documento consolidado del proyecto
├── 02_Codigo/                  # Código fuente de la solución web
│   ├── index.html              # Estructura principal y marcado semántico
│   ├── styles.css              # Estilos visuales, sistema de diseño y layout responsivo
│   ├── data.js                 # Modelo de datos y mock de espacios/reservas
│   ├── availability.js         # Lógica de cálculo y filtrado de disponibilidad horaria
│   └── app.js                  # Controladores de UI, eventos e interacción
├── 03_Evidencias/              # Trazabilidad ágil y aseguramiento de calidad
│   ├── Daily_Sprint1.md        # Registro de reuniones diarias (Sprint 1)
│   ├── Daily_Sprint2.md        # Registro de reuniones diarias (Sprint 2)
│   └── QA_Report_Sprint1.md    # Reporte de pruebas y criterios de aceptación
└── README.md                   # Documentación general del repositorio
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, Grid), JavaScript (Vanilla ES6+).
- **Metodología:** Scrum (Sprints, Dailies, Product Backlog, Definition of Done, QA Reviews).
- **Control de Versiones:** Git & GitHub.

---

## 💻 Cómo Ejecutar el Proyecto

No requiere dependencias externas ni compilación previa.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JSMT04/Proyecto_Scrum_Arq.git
   ```
2. **Entrar al directorio de código:**
   ```bash
   cd Proyecto_Scrum_Arq/02_Codigo
   ```
3. **Abrir la aplicación:**
   - Abre el archivo `index.html` directamente en tu navegador web de preferencia, o utiliza una extensión de servidor local como *Live Server* en VS Code.
