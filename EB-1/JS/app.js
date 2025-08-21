// Estado 
let tasks = []; // { id, text, done }

// Helpers 
const uid = () => Math.random().toString(36).slice(2, 9);

function render() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(t => {
    const li = document.createElement('li');

    // checkbox (completar)
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = t.done;
    chk.addEventListener('change', () => {
      t.done = chk.checked;
      render();
    });

    // texto (editable -> actualizar)
    const span = document.createElement('span');
    span.className = 'task-text' + (t.done ? ' done' : '');
    span.textContent = t.text;
    span.setAttribute('contenteditable', 'true');
    span.title = 'Haz clic para editar';
    span.addEventListener('blur', () => {
      const newText = span.textContent.trim();
      t.text = newText || t.text; // evita dejarla vacía
      render();
    });

    // Enter termina la edición
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    });

    // botón eliminar
    const del = document.createElement('button');
    del.textContent = 'Eliminar';
    del.addEventListener('click', () => {
      tasks = tasks.filter(x => x.id !== t.id);
      render();
    });

    li.appendChild(chk);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });

  // Contadores
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  document.getElementById('done-count').textContent = done;
  document.getElementById('todo-count').textContent = total - done;
  document.getElementById('total-count').textContent = total;
}

// Agregar tarea
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ id: uid(), text, done: false });
    input.value = '';
    render();
  });

  // Estado inicial (De ejemplo)
  tasks = [
    { id: uid(), text: 'Repasar JS', done: false },
    { id: uid(), text: 'Leer instrucciones', done: true }
  ];
  render();
});