// Simulaciones y utilidades 

// Simula el servicio:
// - shouldRespond = true  → resuelve tras simulatedDelayMs con un string
// - shouldRespond = false → rechaza inmediatamente con "no disponible"
function fakeService(shouldRespond, simulatedDelayMs = 2000) {
  return new Promise((resolve, reject) => {
    if (!shouldRespond) {
      // Falla rápido: servicio no disponible
      return setTimeout(() => reject(new Error('Error el servicio no está disponible')), 0);
    }
    // Servicio disponible: responde tras simulatedDelayMs
    setTimeout(() => resolve('Esta es la respuesta del servicio'), simulatedDelayMs);
  });
}

// Promesa de timeout (12s por defecto)
function timeout12s(ms = 12000) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Error: el servicio no funciona')), ms)
  );
}

// myMethod: corre una “carrera” entre el servicio y el timeout de 12s
async function myMethod(shouldRespond, simulatedDelayMs = 2000) {
  try {
    const result = await Promise.race([
      fakeService(shouldRespond, simulatedDelayMs),
      timeout12s(12000),
    ]);
    return result; // 'Esta es la respuesta del servicio'
  } catch (err) {
    // Devuelve solo el mensaje de error
    return err.message.replace(/^Error:\s?/, '');
  }
}

// UI 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const ok = document.getElementById('ok');
  const delay = document.getElementById('delay');
  const out = document.getElementById('out');
  const btnRapida = document.getElementById('btn-rapida');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    out.textContent = 'Procesando...';

    const shouldRespond = ok.checked;
    const simulatedDelayMs = Number(delay.value) || 0;

    const msg = await myMethod(shouldRespond, simulatedDelayMs);
    out.textContent = msg;
  });

  // Demo rápida: fuerza timeout (13s)
  btnRapida.addEventListener('click', async () => {
    ok.checked = true;
    delay.value = '13000';
    out.textContent = 'Procesando...';
    const msg = await myMethod(true, 13000);
    out.textContent = msg; // Esperado: "Error: el servicio no funciona"
  });

  // Pruebas del enunciado en consola 
  // (Abre la consola del navegador para verlas)
  (async () => {
    console.log(await myMethod(true));   // 'Esta es la respuesta del servicio'
    console.log(await myMethod(false));  // 'Error el servicio no está disponible'
  })();
});