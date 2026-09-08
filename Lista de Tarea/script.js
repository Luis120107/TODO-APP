// Referencias
const todoForm = document.getElementById('todo-form');
const inputName = document.getElementById('input-name');
const inputPhone = document.getElementById('input-phone');
const errorName = document.getElementById('error-name');
const errorPhone = document.getElementById('error-phone');
const taskList = document.getElementById('task-list');

const countTotal = document.getElementById('count-total');
const countCompleted = document.getElementById('count-completed');
const countIncomplete = document.getElementById('count-incomplete');

// Validaciones Regex
const NAME_REGEX = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/;
const PHONE_REGEX = /^(0412|0414|0424|0416|0426)\d{7}$/;

// Arreglo Principal de Estado (Estructura Backend)
let tasks = [
  { id: 1, name: 'Luis Montano', phone: '04141234567', completed: false },
  { id: 2, name: 'David Hernandez', phone: '04141234567', completed: false },
  { id: 3, name: 'Daniel Perez', phone: '04141234567', completed: false }
];

// Función para Renderizar la Lista y Contadores
function render() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <button class="btn-del" type="button" onclick="deleteTask(${task.id})">✕</button>
      <div class="item-inputs">
        <input type="text" value="${escapeHtml(task.name)}" disabled>
        <input type="text" value="${escapeHtml(task.phone)}" disabled>
      </div>
      <button class="btn-check" type="button" onclick="toggleTask(${task.id})">✓</button>
    `;

    taskList.appendChild(li);
  });

  updateCounters();
}

// Agregar Tarea / Contacto al presionar CREAR
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameVal = inputName.value.trim();
  const phoneVal = inputPhone.value.trim();

  const isNameValid = NAME_REGEX.test(nameVal);
  const isPhoneValid = PHONE_REGEX.test(phoneVal);

  // Mostrar u Ocultar Errores Visuales
  if (!isNameValid) {
    inputName.classList.add('invalid');
    errorName.classList.remove('hidden');
  } else {
    inputName.classList.remove('invalid');
    errorName.classList.add('hidden');
  }

  if (!isPhoneValid) {
    inputPhone.classList.add('invalid');
    errorPhone.classList.remove('hidden');
  } else {
    inputPhone.classList.remove('invalid');
    errorPhone.classList.add('hidden');
  }

  // Si ambos campos pasan la validación, procesar
  if (isNameValid && isPhoneValid) {
    tasks.push({
      id: Date.now(),
      name: nameVal,
      phone: phoneVal,
      completed: false
    });

    inputName.value = '';
    inputPhone.value = '';
    render();
  }
});

// Cambiar estado completado / incompletado
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  render();
}

// Eliminar
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}

// Recalcular los badges dinámicos
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const incomplete = total - completed;

  countTotal.textContent = total;
  countCompleted.textContent = completed;
  countIncomplete.textContent = incomplete;
}

// Limpiar estilos de error al escribir
inputName.addEventListener('input', () => {
  inputName.classList.remove('invalid');
  errorName.classList.add('hidden');
});

inputPhone.addEventListener('input', () => {
  inputPhone.classList.remove('invalid');
  errorPhone.classList.add('hidden');
});

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// Inicializar al cargar
render();