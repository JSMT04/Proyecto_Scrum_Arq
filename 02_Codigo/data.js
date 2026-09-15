/* Data Layer — HU-01 & HU-02: Consulta y Solicitud de Reservas */

const isoLocal = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const HOY    = isoLocal(new Date());
const MANANA = isoLocal(new Date(new Date().setDate(new Date().getDate() + 1)));
const PASADO = isoLocal(new Date(new Date().setDate(new Date().getDate() + 2)));

const ESPACIOS = [
  {
    id: 'salon_comunal',
    nombre: 'Salón Comunal',
    icono: '🏛️',
    capacidad: 80,
    descripcion: 'Salón principal para eventos y reuniones grandes',
    equipamiento: [
      '🎤 Sistema de sonido',
      '📽️ Proyector y pantalla',
      '💡 Iluminación regulable',
      '🪑 80 sillas y 10 mesas',
      '❄️ Aire acondicionado'
    ]
  },
  {
    id: 'cancha',
    nombre: 'Cancha',
    icono: '⚽',
    capacidad: 30,
    descripcion: 'Cancha polideportiva techada para deportes y actividades físicas',
    equipamiento: [
      '⚽ Arcos de fútbol',
      '🏀 Tableros de baloncesto',
      '🔦 Iluminación LED',
      '🚿 Vestuarios y duchas',
      '🏁 Marcadores de cancha'
    ]
  },
  {
    id: 'sala_juntas',
    nombre: 'Sala de Juntas',
    icono: '📋',
    capacidad: 20,
    descripcion: 'Sala de reuniones para comités y juntas de vecinos',
    equipamiento: [
      '💻 TV/Monitor para presentaciones',
      '🖊️ Pizarrón blanco',
      '📡 WiFi dedicado',
      '🪑 20 sillas ergonómicas',
      '☕ Zona de café'
    ]
  }
];

const generarCodigoConfirmacion = (espacioId, fecha) => {
  const abrevMap = { salon_comunal: 'SAL', cancha: 'CAN', sala_juntas: 'JUN' };
  const abrev = abrevMap[espacioId] ?? 'XXX';
  const mmdd = (fecha || '').slice(5).replace('-', '');
  const sufijo = String(Math.floor(Math.random() * 9000) + 1000);
  return `CC-${abrev}-${mmdd}-${sufijo}`;
};

const RESERVAS_MOCK = [
  { id: 'rsv-001', espacioId: 'salon_comunal', fecha: HOY,    horaInicio: '09:00', horaFin: '11:00', estado: 'confirmada', codigoConfirmacion: 'CC-SAL-0903-7342', vecinoId: 'vec-011', datosContacto: { nombre: 'Carlos Ruiz', telefono: '3001112233' } },
  { id: 'rsv-002', espacioId: 'salon_comunal', fecha: HOY,    horaInicio: '14:00', horaFin: '16:00', estado: 'pendiente',  codigoConfirmacion: 'CC-SAL-0903-8821', vecinoId: 'vec-022', datosContacto: { nombre: 'María Pérez', telefono: '3104445566' } },
  { id: 'rsv-003', espacioId: 'salon_comunal', fecha: MANANA, horaInicio: '10:00', horaFin: '13:00', estado: 'confirmada', codigoConfirmacion: 'CC-SAL-0904-4112', vecinoId: 'vec-033', datosContacto: { nombre: 'Jorge Rojas', telefono: '3207778899' } },
  { id: 'rsv-004', espacioId: 'cancha',        fecha: HOY,    horaInicio: '07:00', horaFin: '09:00', estado: 'confirmada', codigoConfirmacion: 'CC-CAN-0903-1590', vecinoId: 'vec-044', datosContacto: { nombre: 'David Ramos', telefono: '3152223344' } },
  { id: 'rsv-005', espacioId: 'cancha',        fecha: HOY,    horaInicio: '15:00', horaFin: '17:00', estado: 'pendiente',  codigoConfirmacion: 'CC-CAN-0903-5531', vecinoId: 'vec-055', datosContacto: { nombre: 'Laura Soto', telefono: '3189990011' } },
  { id: 'rsv-006', espacioId: 'cancha',        fecha: HOY,    horaInicio: '19:00', horaFin: '21:00', estado: 'confirmada', codigoConfirmacion: 'CC-CAN-0903-9942', vecinoId: 'vec-066', datosContacto: { nombre: 'Pedro Lima', telefono: '3116667788' } },
  { id: 'rsv-007', espacioId: 'sala_juntas',   fecha: HOY,    horaInicio: '08:00', horaFin: '10:00', estado: 'confirmada', codigoConfirmacion: 'CC-JUN-0903-2478', vecinoId: 'vec-077', datosContacto: { nombre: 'Elena Vega', telefono: '3143332211' } },
  { id: 'rsv-008', espacioId: 'sala_juntas',   fecha: HOY,    horaInicio: '11:00', horaFin: '12:00', estado: 'cancelada',  codigoConfirmacion: 'CC-JUN-0903-6310', vecinoId: 'vec-088', datosContacto: { nombre: 'Marta Ríos', telefono: '3168889900' } },
  { id: 'rsv-009', espacioId: 'sala_juntas',   fecha: HOY,    horaInicio: '16:00', horaFin: '18:00', estado: 'pendiente',  codigoConfirmacion: 'CC-JUN-0903-8705', vecinoId: 'vec-099', datosContacto: { nombre: 'Andrés Gil', telefono: '3175554433' } },
  { id: 'rsv-010', espacioId: 'salon_comunal', fecha: PASADO, horaInicio: '09:00', horaFin: '13:00', estado: 'confirmada', codigoConfirmacion: 'CC-SAL-0905-3214', vecinoId: 'vec-010', datosContacto: { nombre: 'Sonia Cruz', telefono: '3121110099' } }
];

const STORAGE_KEY = 'centro_comunitario_reservas_v1';

const cargarReservasStorage = () => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [...RESERVAS_MOCK];
  } catch {
    return [...RESERVAS_MOCK];
  }
};

const guardarReservasStorage = data => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {
    /* fallback en memoria */
  }
};

let RESERVAS = cargarReservasStorage();

const obtenerDatos = () => ({ espacios: ESPACIOS, reservas: RESERVAS });

const agregarReserva = reserva => {
  RESERVAS.push(reserva);
  guardarReservasStorage(RESERVAS);
};

const actualizarEstadoReserva = (id, nuevoEstado) => {
  const reserva = RESERVAS.find(r => r.id === id);
  if (reserva) {
    reserva.estado = nuevoEstado;
    guardarReservasStorage(RESERVAS);
  }
};

/* HU-09: Bloqueo y Desbloqueo por Mantenimiento */
const bloquearHorarioMantenimiento = (espacioId, fecha, horaInicio, horaFin) => {
  const nuevoBloqueo = {
    id: `mtn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    espacioId,
    fecha,
    horaInicio,
    horaFin,
    estado: 'bloqueado',
    vecinoId: 'admin',
    nombreVecino: 'Administración (Mantenimiento)',
    datosContacto: { nombre: 'Administración', telefono: '0000000000' }
  };
  RESERVAS.push(nuevoBloqueo);
  guardarReservasStorage(RESERVAS);
  return nuevoBloqueo;
};

const desbloquearHorarioMantenimiento = id => {
  const index = RESERVAS.findIndex(r => r.id === id);
  if (index !== -1) {
    const [eliminado] = RESERVAS.splice(index, 1);
    guardarReservasStorage(RESERVAS);
    return eliminado;
  }
  return null;
};

/* HU-08: Reglamento de uso de instalaciones */
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

