/* App Controller — HU-01 & HU-02: Disponibilidad y Reserva de Espacios */

/* ─── Constantes de UI ─── */
const DIAS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MESES_ES  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const TOOLTIP   = { ocupado: 'Reservado', pendiente: 'Pendiente de confirmación' };
const ETIQUETA  = { disponible: 'Disponible', ocupado: 'Ocupado', pendiente: 'Pendiente' };

/* ─── Estado global ─── */
const AppState = {
  espacios: [],
  reservas: [],
  filtros: {
    espacioSeleccionado: '',
    fechaSeleccionada: '',
    franjaHoraria: 'todas',
    soloDisponibles: false
  },
  ui: {
    cargando: false,
    ultimaActualizacion: null,
    modalReserva: { abierto: false, bloqueSeleccionado: null },
    modalGestion: { abierto: false, reservaId: null, horaSeleccionada: null },
    modalComprobante: { abierto: false, reserva: null }
  }
};

/* ─── Utilidades de fecha y formato ─── */
const toISOLocal = d =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const fechaHoy = () => toISOLocal(new Date());

const offsetFecha = (iso, dias) => {
  const [y, m, d] = iso.split('-').map(Number);
  return toISOLocal(new Date(y, m - 1, d + dias));
};

const formatearFecha = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  return {
    dia:     DIAS_ES[fecha.getDay()],
    completa: `${d} de ${MESES_ES[m - 1]} de ${y}`
  };
};

/* ─── Lógica de filtrado de horarios (HU-06) ─── */
const filtrarBloques = (bloques, { franjaHoraria, soloDisponibles }) =>
  bloques.filter(b => {
    const horaNum = parseInt(b.hora.split(':')[0], 10);
    let coincideFranja = true;
    if (franjaHoraria === 'manana') coincideFranja = horaNum >= 7 && horaNum < 12;
    else if (franjaHoraria === 'tarde') coincideFranja = horaNum >= 12 && horaNum < 18;
    else if (franjaHoraria === 'noche') coincideFranja = horaNum >= 18 && horaNum < 22;

    if (!coincideFranja) return false;
    if (soloDisponibles && b.estado !== 'disponible') return false;
    return true;
  });

/* ─── Renderizado de Tabs ─── */
const renderTabs = () => {
  document.getElementById('tabs-container').innerHTML = AppState.espacios
    .map(e => `
      <button
        class="tab-btn ${e.id === AppState.filtros.espacioSeleccionado ? 'active' : ''}"
        data-espacio="${e.id}"
        role="tab"
        aria-selected="${e.id === AppState.filtros.espacioSeleccionado}"
        id="tab-${e.id}"
      >
        <span class="tab-icon" aria-hidden="true">${e.icono}</span>
        <span>${e.nombre}</span>
      </button>
    `).join('');
};

/* ─── Renderizado de Fecha ─── */
const renderFecha = () => {
  const { dia, completa } = formatearFecha(AppState.filtros.fechaSeleccionada);
  document.getElementById('date-display').innerHTML =
    `<div class="date-weekday">${dia}</div><div class="date-full">${completa}</div>`;
};

/* ─── Renderizado de Filtros (HU-06) ─── */
const renderFiltros = () => {
  const inputPicker = document.getElementById('input-date-picker');
  if (inputPicker && inputPicker.value !== AppState.filtros.fechaSeleccionada) {
    inputPicker.value = AppState.filtros.fechaSeleccionada;
  }

  const btnToday = document.getElementById('btn-today');
  if (btnToday) {
    const esHoy = AppState.filtros.fechaSeleccionada === fechaHoy();
    btnToday.classList.toggle('active-today', esHoy);
    btnToday.textContent = esHoy ? '✓ Hoy' : 'Hoy';
  }

  const checkSoloDisp = document.getElementById('check-solo-disponibles');
  if (checkSoloDisp) checkSoloDisp.checked = AppState.filtros.soloDisponibles;

  document.querySelectorAll('.filter-pill').forEach(btn => {
    const activo = btn.dataset.franja === AppState.filtros.franjaHoraria;
    btn.classList.toggle('active', activo);
    btn.setAttribute('aria-pressed', String(activo));
  });
};

/* ─── Renderizado de Cuadrícula ─── */
const renderCuadricula = bloques => {
  const container = document.getElementById('cuadricula-container');
  if (!bloques || !bloques.length) {
    container.innerHTML = `
      <div class="empty-grid-state" role="status">
        <span class="empty-grid-icon" aria-hidden="true">🔍</span>
        <p class="empty-grid-text">No se encontraron horarios con los filtros seleccionados.</p>
        <button type="button" class="empty-grid-btn" id="btn-reset-filters">Restablecer filtros</button>
      </div>
    `;
    return;
  }

  container.innerHTML = bloques
    .map(b => `
      <div
        class="slot slot-${b.estado}"
        ${b.estado !== 'disponible' ? `data-tooltip="${TOOLTIP[b.estado]}"` : 'data-action="reservar"'}
        data-hora="${b.hora}"
        role="listitem"
        aria-label="Bloque ${b.hora}: ${ETIQUETA[b.estado]}${b.estado === 'disponible' ? ' (Haz clic para reservar)' : ' (Haz clic para gestionar)'}"
        tabindex="${b.estado === 'disponible' || b.estado === 'ocupado' || b.estado === 'pendiente' ? '0' : '-1'}"
      >
        <span class="slot-hora">${b.hora}</span>
        <div class="slot-barra"><div class="slot-barra-fill"></div></div>
        <span class="slot-label">${ETIQUETA[b.estado]}</span>
      </div>
    `).join('');
};

/* ─── Renderizado de ficha informativa (HU-05) ─── */
const renderFichaEspacio = () => {
  const container = document.getElementById('ficha-espacio');
  if (!container) return;
  const espacio = AppState.espacios.find(e => e.id === AppState.filtros.espacioSeleccionado);
  if (!espacio) {
    container.innerHTML = '';
    return;
  }
  const aforo = Math.round(espacio.capacidad * 0.75);
  const equipamientoHtml = (espacio.equipamiento || [])
    .map(item => `<li>${item}</li>`)
    .join('');

  container.innerHTML = `
    <div class="ficha-header">
      <span class="ficha-icono" aria-hidden="true">${espacio.icono}</span>
      <h2 class="ficha-nombre">${espacio.nombre}</h2>
    </div>
    <p class="ficha-descripcion">${espacio.descripcion}</p>
    <div class="ficha-stats">
      <div class="ficha-stat">👥 Capacidad total: <strong>${espacio.capacidad} personas</strong></div>
      <div class="ficha-stat">✅ Aforo permitido (75%): <strong>${aforo} personas</strong></div>
    </div>
    <div class="ficha-equipamiento">
      <p class="ficha-equipamiento-titulo">Equipamiento disponible</p>
      <ul class="ficha-equipamiento-lista">
        ${equipamientoHtml}
      </ul>
    </div>
  `;
};

/* ─── Renderizado completo ─── */
const renderAll = () => {
  const { espacioSeleccionado, fechaSeleccionada, franjaHoraria, soloDisponibles } = AppState.filtros;
  renderTabs();
  renderFecha();
  renderFiltros();
  const todosBloques = calcularDisponibilidad(espacioSeleccionado, fechaSeleccionada, AppState.reservas);
  const bloquesFiltrados = filtrarBloques(todosBloques, { franjaHoraria, soloDisponibles });
  renderCuadricula(bloquesFiltrados);
  renderFichaEspacio();
};

/* ─── Actualización de datos y timestamp ─── */
const actualizarDatos = () => {
  const { espacios, reservas } = obtenerDatos();
  AppState.espacios = espacios;
  AppState.reservas = reservas;
  AppState.ui.ultimaActualizacion = new Date();
  if (!AppState.filtros.espacioSeleccionado && espacios.length)
    AppState.filtros.espacioSeleccionado = espacios[0].id;
  renderAll();
};

const actualizarTimestamp = () => {
  if (!AppState.ui.ultimaActualizacion) return;
  const seg = Math.floor((Date.now() - AppState.ui.ultimaActualizacion) / 1000);
  document.getElementById('footer-timestamp').textContent =
    seg < 5 ? 'Actualizado ahora mismo' : `Actualizado hace ${seg}s`;
};

/* ─── Polling automático ─── */
let pollingId = null;

const iniciarPolling = () => {
  clearInterval(pollingId);
  pollingId = setInterval(actualizarDatos, 30_000);
};

/* ─── HU-02: Modal y Formulario de Reserva ─── */
let toastTimeout = null;
const mostrarToast = mensaje => {
  const toast = document.getElementById('toast-notificacion');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 4000);
};

const abrirModalReserva = hora => {
  const espacio = AppState.espacios.find(e => e.id === AppState.filtros.espacioSeleccionado);
  const [h, m] = hora.split(':').map(Number);
  const horaFin = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const { completa } = formatearFecha(AppState.filtros.fechaSeleccionada);

  document.getElementById('modal-resumen-espacio').textContent = espacio ? `${espacio.icono} ${espacio.nombre}` : '';
  document.getElementById('modal-resumen-fecha').textContent = completa;
  document.getElementById('modal-resumen-horario').textContent = `${hora} a ${horaFin} (1 hora)`;

  // Reset form
  const form = document.getElementById('form-reserva');
  form.reset();
  document.getElementById('input-nombre').classList.remove('input-error');
  document.getElementById('input-telefono').classList.remove('input-error');
  document.getElementById('error-nombre').textContent = '';
  document.getElementById('error-telefono').textContent = '';

  AppState.ui.modalReserva = { abierto: true, bloqueSeleccionado: hora };
  document.getElementById('modal-reserva-overlay').classList.remove('hidden');
  document.getElementById('input-nombre').focus();
};

const cerrarModalReserva = () => {
  document.getElementById('modal-reserva-overlay').classList.add('hidden');
  AppState.ui.modalReserva = { abierto: false, bloqueSeleccionado: null };
};

/* ─── HU-03: Modal y Formulario de Gestión ─── */
const abrirModalGestion = hora => {
  const { espacioSeleccionado, fechaSeleccionada } = AppState.filtros;
  const reserva = AppState.reservas.find(r => r.espacioId === espacioSeleccionado && r.fecha === fechaSeleccionada && r.horaInicio === hora);
  if (!reserva) return;
  
  const espacio = AppState.espacios.find(e => e.id === espacioSeleccionado);
  const [h, m] = hora.split(':').map(Number);
  const horaFin = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const { completa } = formatearFecha(fechaSeleccionada);

  document.getElementById('modal-gestion-espacio').textContent = espacio ? `${espacio.icono} ${espacio.nombre}` : '';
  document.getElementById('modal-gestion-fecha').textContent = completa;
  document.getElementById('modal-gestion-horario').textContent = `${hora} a ${horaFin} (1 hora)`;
  document.getElementById('modal-gestion-codigo').textContent = reserva.codigoConfirmacion ?? 'N/D';

  document.getElementById('form-gestion').reset();
  const inputTel = document.getElementById('input-telefono-gestion');
  inputTel.classList.remove('input-error');
  document.getElementById('error-telefono-gestion').textContent = '';

  document.getElementById('btn-confirmar-reserva').style.display = reserva.estado === 'pendiente' ? 'inline-block' : 'none';

  AppState.ui.modalGestion = { abierto: true, reservaId: reserva.id, horaSeleccionada: hora };
  document.getElementById('modal-gestion-overlay').classList.remove('hidden');
  inputTel.focus();
};

const cerrarModalGestion = () => {
  document.getElementById('modal-gestion-overlay').classList.add('hidden');
  AppState.ui.modalGestion = { abierto: false, reservaId: null, horaSeleccionada: null };
};

/* ─── HU-04: Modal de Comprobante ─── */
const abrirModalComprobante = reserva => {
  const espacio = AppState.espacios.find(e => e.id === reserva.espacioId);
  const [h, m] = reserva.horaInicio.split(':').map(Number);
  const horaFin = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const { completa } = formatearFecha(reserva.fecha);

  document.getElementById('comprobante-espacio').textContent = espacio ? `${espacio.icono} ${espacio.nombre}` : reserva.espacioId;
  document.getElementById('comprobante-fecha').textContent = completa;
  document.getElementById('comprobante-horario').textContent = `${reserva.horaInicio} a ${horaFin} (1 hora)`;
  document.getElementById('comprobante-nombre').textContent = reserva.datosContacto?.nombre || '-';
  document.getElementById('comprobante-codigo').textContent = reserva.codigoConfirmacion;

  AppState.ui.modalComprobante = { abierto: true, reserva };
  document.getElementById('modal-comprobante-overlay').classList.remove('hidden');
  document.getElementById('btn-comprobante-cerrar').focus();
};

const cerrarModalComprobante = () => {
  document.getElementById('modal-comprobante-overlay').classList.add('hidden');
  AppState.ui.modalComprobante = { abierto: false, reserva: null };
  actualizarDatos();
  iniciarPolling();
};

/* ─── Manejadores de Eventos ─── */

// Delegación en contenedor de tabs
document.getElementById('tabs-container').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  AppState.filtros.espacioSeleccionado = btn.dataset.espacio;
  renderAll();
});

// Navegación de fecha — día anterior
document.getElementById('btn-prev-day').addEventListener('click', () => {
  AppState.filtros.fechaSeleccionada = offsetFecha(AppState.filtros.fechaSeleccionada, -1);
  renderAll();
});

// Navegación de fecha — día siguiente
document.getElementById('btn-next-day').addEventListener('click', () => {
  AppState.filtros.fechaSeleccionada = offsetFecha(AppState.filtros.fechaSeleccionada, +1);
  renderAll();
});

// HU-06: Selector de fecha directa
const inputPickerEl = document.getElementById('input-date-picker');
if (inputPickerEl) {
  inputPickerEl.addEventListener('change', e => {
    if (e.target.value) {
      AppState.filtros.fechaSeleccionada = e.target.value;
      renderAll();
    }
  });
}

// HU-06: Botón Hoy
const btnTodayEl = document.getElementById('btn-today');
if (btnTodayEl) {
  btnTodayEl.addEventListener('click', () => {
    AppState.filtros.fechaSeleccionada = fechaHoy();
    renderAll();
  });
}

// HU-06: Filtro por Franja Horaria (delegación de clicks)
const filterPillsContainer = document.querySelector('.filter-pills');
if (filterPillsContainer) {
  filterPillsContainer.addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill || !pill.dataset.franja) return;
    AppState.filtros.franjaHoraria = pill.dataset.franja;
    renderAll();
  });
}

// HU-06: Checkbox Solo Disponibles
const checkSoloDispEl = document.getElementById('check-solo-disponibles');
if (checkSoloDispEl) {
  checkSoloDispEl.addEventListener('change', e => {
    AppState.filtros.soloDisponibles = e.target.checked;
    renderAll();
  });
}

// Botón actualizar manual
document.getElementById('btn-refresh').addEventListener('click', () => {
  actualizarDatos();
  iniciarPolling();
});

// HU-02, HU-03 & HU-06: Clic o Enter en slot o reset de filtros
const manejarSeleccionSlot = e => {
  if (e.target.closest('#btn-reset-filters')) {
    AppState.filtros.franjaHoraria = 'todas';
    AppState.filtros.soloDisponibles = false;
    return renderAll();
  }

  const slotDis = e.target.closest('.slot-disponible');
  if (slotDis && slotDis.dataset.hora) return abrirModalReserva(slotDis.dataset.hora);

  const slotGes = e.target.closest('.slot-ocupado, .slot-pendiente');
  if (slotGes && slotGes.dataset.hora) return abrirModalGestion(slotGes.dataset.hora);
};

document.getElementById('cuadricula-container').addEventListener('click', manejarSeleccionSlot);
document.getElementById('cuadricula-container').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    manejarSeleccionSlot(e);
  }
});

// HU-02: Cierre de modal
document.getElementById('modal-btn-close').addEventListener('click', cerrarModalReserva);
document.getElementById('modal-btn-cancel').addEventListener('click', cerrarModalReserva);
document.getElementById('modal-reserva-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-reserva-overlay') cerrarModalReserva();
});

// HU-03: Cierre de modal de gestión
document.getElementById('modal-gestion-btn-close').addEventListener('click', cerrarModalGestion);
document.getElementById('modal-gestion-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-gestion-overlay') cerrarModalGestion();
});

// HU-04: Cierre de modal de comprobante
document.getElementById('modal-comprobante-btn-close').addEventListener('click', cerrarModalComprobante);
document.getElementById('btn-comprobante-cerrar').addEventListener('click', cerrarModalComprobante);
document.getElementById('modal-comprobante-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-comprobante-overlay') cerrarModalComprobante();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (AppState.ui.modalReserva.abierto) cerrarModalReserva();
    if (AppState.ui.modalGestion.abierto) cerrarModalGestion();
    if (AppState.ui.modalComprobante.abierto) cerrarModalComprobante();
  }
});

// HU-02: Envío y validación del formulario de reserva
document.getElementById('form-reserva').addEventListener('submit', e => {
  e.preventDefault();
  const inputNombre   = document.getElementById('input-nombre');
  const inputTelefono = document.getElementById('input-telefono');
  const errorNombre   = document.getElementById('error-nombre');
  const errorTelefono = document.getElementById('error-telefono');

  const nombre   = inputNombre.value.trim();
  const telefono = inputTelefono.value.trim();

  let valido = true;

  if (!nombre) {
    inputNombre.classList.add('input-error');
    errorNombre.textContent = 'Ingresa tu nombre completo';
    valido = false;
  } else {
    inputNombre.classList.remove('input-error');
    errorNombre.textContent = '';
  }

  if (!telefono) {
    inputTelefono.classList.add('input-error');
    errorTelefono.textContent = 'Ingresa un número telefónico de contacto';
    valido = false;
  } else if (telefono.length < 7) {
    inputTelefono.classList.add('input-error');
    errorTelefono.textContent = 'El teléfono debe tener al menos 7 dígitos';
    valido = false;
  } else {
    inputTelefono.classList.remove('input-error');
    errorTelefono.textContent = '';
  }

  if (!valido) return;

  const horaInicio = AppState.ui.modalReserva.bloqueSeleccionado;
  const [h, m] = horaInicio.split(':').map(Number);
  const horaFin = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  const nuevaReserva = {
    id: `rsv-${Date.now()}`,
    espacioId: AppState.filtros.espacioSeleccionado,
    fecha: AppState.filtros.fechaSeleccionada,
    horaInicio,
    horaFin,
    estado: 'pendiente',
    codigoConfirmacion: generarCodigoConfirmacion(AppState.filtros.espacioSeleccionado, AppState.filtros.fechaSeleccionada),
    vecinoId: `vec-${Date.now().toString().slice(-4)}`,
    datosContacto: { nombre, telefono }
  };

  agregarReserva(nuevaReserva);
  cerrarModalReserva();
  abrirModalComprobante(nuevaReserva);
});

// HU-03: Envío y validación del formulario de gestión
document.getElementById('form-gestion').addEventListener('submit', e => {
  e.preventDefault();
  gestionarReserva('confirmar');
});

document.getElementById('btn-cancelar-reserva').addEventListener('click', () => gestionarReserva('cancelar'));

const gestionarReserva = accion => {
  const reservaId = AppState.ui.modalGestion.reservaId;
  const reserva = AppState.reservas.find(r => r.id === reservaId);
  if (!reserva) return;

  const inputTel = document.getElementById('input-telefono-gestion');
  const errorTel = document.getElementById('error-telefono-gestion');
  const telefono = inputTel.value.trim();

  if (telefono !== reserva.datosContacto.telefono) {
    inputTel.classList.add('input-error');
    errorTel.textContent = 'El teléfono no coincide con la reserva';
    return;
  }

  const nuevoEstado = accion === 'cancelar' ? 'cancelada' : 'confirmada';
  actualizarEstadoReserva(reservaId, nuevoEstado);
  cerrarModalGestion();
  actualizarDatos();
  iniciarPolling();
  mostrarToast(`✅ Reserva ${nuevoEstado} exitosamente.`);
};

/* ─── Inicialización ─── */
AppState.filtros.fechaSeleccionada = fechaHoy();
actualizarDatos();
iniciarPolling();
setInterval(actualizarTimestamp, 1_000);
