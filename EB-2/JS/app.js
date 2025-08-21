// Versión básica (misma longitud)
function distancia(a, b) {
  if (a.length !== b.length) {
    throw new Error("Las cadenas deben tener la misma longitud");
  }
  let dif = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dif++;
  }
  return dif;
}

// Versión extendida (longitudes distintas) 
function distanciaFlexible(a, b) {
  const n = Math.min(a.length, b.length);
  let dif = Math.abs(a.length - b.length); // diferencia de longitudes
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) dif++;
  }
  return dif;
}

// Integración con la UI 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const a = document.getElementById("a");
  const b = document.getElementById("b");
  const flex = document.getElementById("flex");
  const out = document.getElementById("out");
  const btnTests = document.getElementById("btn-tests");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const s1 = a.value ?? "";
    const s2 = b.value ?? "";

    try {
      const result = flex.checked
        ? distanciaFlexible(s1, s2)
        : distancia(s1, s2);

      out.textContent = `Diferencias: ${result}`;
    } catch (err) {
      out.textContent = `Error: ${err.message}`;
    }
  });
  
});