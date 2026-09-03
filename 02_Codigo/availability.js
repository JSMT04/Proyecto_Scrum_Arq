/* Availability Layer — Lógica pura de cálculo de disponibilidad (HU-01) */

const HORA_APERTURA = 7;
const HORA_CIERRE   = 22; // 15 slots: 07:00–21:00

const generarBloques = () =>
  Array.from({ length: HORA_CIERRE - HORA_APERTURA }, (_, i) => ({
    hora: `${String(HORA_APERTURA + i).padStart(2, '0')}:00`,
    estado: 'disponible',
    reservaId: null
  }));

const hhmm = str => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};

// Reserva se solapa con bloque si su rango [rInicio, rFin) intersecta [sInicio, sInicio+60)
const seSuperponen = (reserva, bloqueHora) => {
  const sInicio = hhmm(bloqueHora);
  return hhmm(reserva.horaInicio) < sInicio + 60 && hhmm(reserva.horaFin) > sInicio;
};

const calcularDisponibilidad = (espacioId, fechaISO, reservas) => {
  const activas = reservas.filter(r =>
    r.espacioId === espacioId && r.fecha === fechaISO && r.estado !== 'cancelada'
  );
  return generarBloques().map(bloque => {
    const solapadas = activas.filter(r => seSuperponen(r, bloque.hora));
    if (!solapadas.length) return bloque;
    // Prioridad: confirmada > pendiente
    const confirmada = solapadas.find(r => r.estado === 'confirmada');
    return confirmada
      ? { ...bloque, estado: 'ocupado',   reservaId: confirmada.id }
      : { ...bloque, estado: 'pendiente', reservaId: solapadas[0].id };
  });
};
