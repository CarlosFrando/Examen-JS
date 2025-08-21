/* Sistema de eventos simple */

// Usamos Map<string, Set<Function>> para evitar duplicados y permitir remover
const eventRegistry = new Map();

/**
 * Registra un listener para un evento.
 * @param {string} eventName
 * @param {(payload:any)=>void} callback
 * @returns {() => void} función para desuscribirse
 */
function myAddEventListener(eventName, callback) {
  if (!eventRegistry.has(eventName)) {
    eventRegistry.set(eventName, new Set());
  }
  const set = eventRegistry.get(eventName);
  set.add(callback);

  // Devuelve un "unsubscribe" conveniente
  return () => {
    set.delete(callback);
    if (set.size === 0) eventRegistry.delete(eventName);
  };
}

/**
 * Despacha un evento a todos sus listeners.
 * @param {string} eventName
 * @param {any} payload
 * @returns {number} cantidad de listeners notificados
 */
function myDispatchEvent(eventName, payload = {}) {
  const set = eventRegistry.get(eventName);
  if (!set || set.size === 0) return 0;

  let notified = 0;
  for (const cb of set) {
    try {
      cb(payload);
      notified++;
    } catch (err) {
      // No detenemos a los demás listeners
      console.error(`Listener de "${eventName}" falló:`, err);
    }
  }
  return notified;
}

/* UI de demostración (coincide con el código del enunciado) */

function log(line) {
  const el = document.getElementById('log');
  el.textContent = (el.textContent === '—' ? '' : el.textContent + '\n') + line;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const eventNameInput = document.getElementById('event-name');
  const nameInput = document.getElementById('name');
  const lastInput = document.getElementById('last');
  const btnAddListener = document.getElementById('btn-add-listener');
  const btnClearLog = document.getElementById('btn-clear-log');

  // Listener de ejemplo (el del enunciado)
  myAddEventListener('my-event', ({ data }) => {
    const msg = 'Hola mi nombre es ' + data.name + ' ' + data.last;
    console.log(msg);
    log(msg);
  });

  // Form: dispatch del evento con el payload { data: { name, last } }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const eventName = eventNameInput.value.trim();
    const name = nameInput.value.trim();
    const last = lastInput.value.trim();

    const count = myDispatchEvent(eventName, { data: { name, last } });
    if (count === 0) {
      log(`(Sin listeners) Se disparó "${eventName}" con: { name: "${name}", last: "${last}" }`);
    } else {
      log(`(OK) Disparado "${eventName}" a ${count} listener(s).`);
    }
  });

  // Agregar dinámicamente un listener adicional
  btnAddListener.addEventListener('click', () => {
    const eventName = eventNameInput.value.trim();
    const unsubscribe = myAddEventListener(eventName, ({ data }) => {
      log(`(Extra) Listener #${eventRegistry.get(eventName).size} → ${data.name} ${data.last}`);
    });
    log(`Listener extra agregado para "${eventName}". (Puedes refrescar para limpiar)`);
    // Si quisieras eliminarlo luego: guarda "unsubscribe()" y ejecútalo.
    // unsubscribe();
  });

  // Limpiar log
   btnClearLog.addEventListener('click', () => {
    document.getElementById('log').textContent = '—';
  });

  // ====== Prueba del enunciado en consola ======
  // myAddEventListener('my-event', ({ data }) => {
  //   console.log('Hola mi nombre es ' + data.name + ' ' + data.last);
  // });
  // myDispatchEvent('my-event', { data: { name: 'Juan', last: 'Gonzalez' } });
});

// Exponer funciones globalmente si quieres probar en consola del navegador
window.myAddEventListener = myAddEventListener;
window.myDispatchEvent = myDispatchEvent;