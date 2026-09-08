// Referencias a elementos del DOM
const contactForm = document.getElementById('contact-form');
const inputName = document.getElementById('input-name');
const inputPhone = document.getElementById('input-phone');
const errorName = document.getElementById('error-name');
const errorPhone = document.getElementById('error-phone');
const contactList = document.getElementById('contact-list');

// Expresión Regular para Validar: Nombre y Apellido iniciando con Mayúscula
// Ej: "Luis Montano" (Válido), "luis montano" (Inválido)
const NAME_REGEX = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/;

// Expresión Regular para Validar Teléfonos en formato Venezolano o 10-11 dígitos
const PHONE_REGEX = /^(0412|0414|0424|0416|0426)\d{7}$/;

// Estado de la lista inicial (Punto 1 y 3)
let contacts = [
  { id: 1, name: 'luis Montano', phone: '04141234567', isEditing: false },
  { id: 2, name: 'David Hernandez', phone: '04141234567', isEditing: false },
  { id: 3, name: 'Dabiel Perez', phone: '04141234567', isEditing: false }
];

// Carga inicial y persistencia en LocalStorage
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('contacts');
  if (saved) {
    contacts = JSON.parse(saved);
  }
  render();
});

function saveToLocalStorage() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Renderiza la lista usando elementos <input> para Nombre y Número (Punto 3)
function render() {
  contactList.innerHTML = '';

  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.className = 'contact-item';

    li.innerHTML = `
      <input type="text" class="edit-name" value="${escapeHtml(contact.name)}" ${contact.isEditing ? '' : 'disabled'}>
      <input type="text" class="edit-phone" value="${escapeHtml(contact.phone)}" ${contact.isEditing ? '' : 'disabled'}>
      <button class="action-btn btn-edit" onclick="toggleEdit(${contact.id}, this)">
        ${contact.isEditing ? '💾' : '✏️'}
      </button>
      <button class="action-btn btn-delete" onclick="deleteContact(${contact.id})">✕</button>
    `;

    contactList.appendChild(li);
  });
}

// Manejo del envío del formulario con Validación
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = inputName.value.trim();
  const phoneValue = inputPhone.value.trim();

  const isNameValid = NAME_REGEX.test(nameValue);
  const isPhoneValid = PHONE_REGEX.test(phoneValue);

  // Validar Nombre
  if (!isNameValid) {
    inputName.classList.add('invalid');
    errorName.classList.remove('hidden');
  } else {
    inputName.classList.remove('invalid');
    errorName.classList.add('hidden');
  }

  // Validar Teléfono
  if (!isPhoneValid) {
    inputPhone.classList.add('invalid');
    errorPhone.classList.remove('hidden');
  } else {
    inputPhone.classList.remove('invalid');
    errorPhone.classList.add('hidden');
  }

  // Si ambos son válidos, crea el contacto
  if (isNameValid && isPhoneValid) {
    contacts.push({
      id: Date.now(),
      name: nameValue,
      phone: phoneValue,
      isEditing: false
    });

    inputName.value = '';
    inputPhone.value = '';
    saveToLocalStorage();
    render();
  }
});

// Editar / Guardar Contacto de la lista
function toggleEdit(id, btnElement) {
  const contact = contacts.find(c => c.id === id);
  const li = btnElement.parentElement;
  const nameInput = li.querySelector('.edit-name');
  const phoneInput = li.querySelector('.edit-phone');

  if (contact.isEditing) {
    // Modo Guardar: Validar antes de guardar cambios
    const newName = nameInput.value.trim();
    const newPhone = phoneInput.value.trim();

    if (NAME_REGEX.test(newName) && PHONE_REGEX.test(newPhone)) {
      contact.name = newName;
      contact.phone = newPhone;
      contact.isEditing = false;
      saveToLocalStorage();
      render();
    } else {
      alert('Nombre o teléfono no válidos al editar. Verifica el formato.');
    }
  } else {
    // Activar modo edición
    contact.isEditing = true;
    render();
  }
}

// Eliminar Contacto
function deleteContact(id) {
  contacts = contacts.filter(c => c.id !== id);
  saveToLocalStorage();
  render();
}

// Limpiar estados de error mientras el usuario escribe
inputName.addEventListener('input', () => {
  inputName.classList.remove('invalid');
  errorName.classList.add('hidden');
});

inputPhone.addEventListener('input', () => {
  inputPhone.classList.remove('invalid');
  errorPhone.classList.add('hidden');
});

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}