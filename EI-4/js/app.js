// Implementación pedida 
// Nota: el enunciado usa la firma (current, accumulator)
Array.prototype.myOwnReduce = function(callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " no es una función");
  }
  const arr = this;
  let accumulator, startIndex;

  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (arr.length === 0) {
      throw new TypeError("Reduce de array vacío sin valor inicial");
    }
    accumulator = arr[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < arr.length; i++) {
    // Nota: (current, accumulator)
    accumulator = callback(arr[i], accumulator, i, arr);
  }
  return accumulator;
};

// Utilidades 
function parseArrayInput(str) {
  // Separa por comas, recorta espacios y convierte a número si aplica
  // "1, 2, 3" -> [1,2,3] ; "a, b" -> ["a","b"]
  return str
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => (s !== "" && !isNaN(Number(s)) ? Number(s) : s));
}

function parseInitialValue(raw, reducerKey) {
  if (raw.trim() === "") return undefined;
  // Para suma, producto, min, max: intentar número
  if (["sum", "product", "min", "max"].includes(reducerKey)) {
    const n = Number(raw);
    if (Number.isNaN(n)) throw new Error("Valor inicial inválido para reductor numérico");
    return n;
  }
  // Para concat: dejar como texto
  return raw;
}

// Reductores con firma (current, accumulator)
const reducers = {
  sum: (current, acc) => (Number(acc) || 0) + (Number(current) || 0),
  product: (current, acc) => (Number(acc) || 0) * (Number(current) || 0),
  max: (current, acc) => (acc > current ? acc : current),
  min: (current, acc) => (acc < current ? acc : current),
  concat: (current, acc) => String(acc ?? "") + String(current),
};

// UI 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const arrInput = document.getElementById("arr-input");
  const reducerSelect = document.getElementById("reducer-select");
  const initialInput = document.getElementById("initial-input");
  const result = document.getElementById("result");
  const btnDemo = document.getElementById("btn-demo");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const arr = parseArrayInput(arrInput.value);
      const reducerKey = reducerSelect.value;
      const callback = reducers[reducerKey];

      if (!callback) throw new Error("Reductor no válido");

      const initialRaw = initialInput.value ?? "";
      const initial = parseInitialValue(initialRaw, reducerKey);

      const output =
        initial === undefined
          ? arr.myOwnReduce(callback)
          : arr.myOwnReduce(callback, initial);

      result.textContent = `Entrada: ${JSON.stringify(arr)}\n` +
                           `Reductor: ${reducerKey}\n` +
                           `Inicial: ${initial === undefined ? "(no dado)" : JSON.stringify(initial)}\n` +
                           `→ Resultado: ${JSON.stringify(output)}`;
    } catch (err) {
      result.textContent = ` Error: ${err.message}`;
    }
  });

  btnDemo.addEventListener("click", () => {
    arrInput.value = "1,2,3,4,5";
    reducerSelect.value = "sum";
    initialInput.value = ""; // sin valor inicial
    form.requestSubmit();
  });
});