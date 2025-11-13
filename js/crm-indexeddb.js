// INICIALIZACIÓN de INDEXEDDB

let db;

const request = indexedDB.open("CRM_Database", 1);

// Manejo de errores al abrir la base de datos

request.onerror = function(event) {
    console.error("Error abriendo IndexedDB", event);
};

// Conexión ok

request.onsuccess = function(event) {
    db = event.target.result;
    fetchClients(); // Cargar clientes almacenados
};

//Crear o actualizar la base de datos (estructura)

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if(!db.objectStoreNames.contains('clients')) {
        const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('phone', 'phone', { unique: false });
    }
};

// Validaciones y activar botón

const form = document.getElementById('client-form');
const addBtn = document.getElementById('add-btn');
const inputs = form.querySelectorAll('input');

// Botón deshabilitado hasta que todos los campos sean válidos

addBtn.disabled = true; 

const nameInput = document.getElementById('name');
// Regex para validar nombre: 
// - Mínimo 2 caracteres
// - Solo letras (mayúsculas y minúsculas)
// - Permite espacios, letras con acento (ÁÉÍÓÚ) y la letra ñ
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;

const emailInput = document.getElementById('email');
// Regex para validar email en formato estándar:
// - usuario: letras, números, puntos, guiones bajos, + y -
// - @dominio.extensión
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const phoneInput = document.getElementById('phone');
// Regex para validar teléfono:
// - 9-10 dígitos numéricos
// - Guiones opcionales entre grupos (formato: 123-456-789 o 123456789)
const phoneRegex = /^\d{3}-?\d{3}-?\d{3,4}$/;

// Validación en tiempo real del campo nombre
nameInput.addEventListener('blur', function() {
    if(nameRegex.test(nameInput.value.trim())) {
        nameInput.classList.remove('invalid');
        nameInput.classList.add('valid');
    } else {
        nameInput.classList.remove('valid');
        nameInput.classList.add('invalid');
    }
    checkFormValidity();
});

// Validación en tiempo real del campo email
emailInput.addEventListener('blur', function() {
    if(emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
    } else {
        emailInput.classList.remove('valid');
        emailInput.classList.add('invalid');
    }
    checkFormValidity();
});

// Validación en tiempo real del campo teléfono
phoneInput.addEventListener('blur', function() {
    if(phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.classList.remove('invalid');
        phoneInput.classList.add('valid');
    } else {
        phoneInput.classList.remove('valid');
        phoneInput.classList.add('invalid');
    }
    checkFormValidity();
});

// Verifica si todos los campos son válidos para habilitar el botón

function checkFormValidity() {
    if (nameInput.classList.contains('valid') && emailInput.classList.contains('valid') && phoneInput.classList.contains('valid')) {
        addBtn.disabled = false;
    } else {
        addBtn.disabled = true;
    }
}

// Agregar cliente
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    // Agregar nuevo cliente
    if (!form.dataset.editingId) {
        const transaction = db.transaction(["clients"], "readwrite");
        const store = transaction.objectStore("clients");
        const newClient = { name, email, phone };
        const request = store.add(newClient);
        request.onsuccess = function() {
            alert("Cliente guardado con éxito.");
            form.reset();
            addBtn.textContent = "Agregar Cliente";
            addBtn.disabled = true;
            nameInput.classList.remove("valid", "invalid");
            emailInput.classList.remove("valid", "invalid");
            phoneInput.classList.remove("valid", "invalid");
            fetchClients();
        };
        request.onerror = function() {
            alert("No se pudo agregar el cliente, email ya existente.");
        };
        return;
    }

    // Editar cliente existente 
    const id = Number(form.dataset.editingId);
    const updatedClient = { id, name, email, phone };
    const transaction = db.transaction(["clients"], "readwrite");
    const store = transaction.objectStore("clients");
    const request = store.put(updatedClient);
    request.onsuccess = function() {
        alert('Cliente actualizado correctamente.');
        form.reset();
        form.removeAttribute('data-editing-id');
        addBtn.textContent = 'Agregar Cliente';
        addBtn.disabled = true;
        nameInput.classList.remove('valid', 'invalid');
        emailInput.classList.remove('valid', 'invalid');
        phoneInput.classList.remove('valid', 'invalid');
        fetchClients();
    };
    request.onerror = function() {
        alert('Error al actualizar el cliente. Email duplicado o error en la BD.');
    };
});

// Listado dinámico

function fetchClients() {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = '';

    const transaction = db.transaction(['clients'], 'readonly');
    const store = transaction.objectStore('clients');

    const request = store.getAll();

    request.onsuccess = function() {
        const clients = request.result;

        if (clients.length === 0) {
            clientList.innerHTML = '<li>No hay clientes registrados.</li>';
            return;
        }

        clients.forEach(client => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${client.name}</strong> - ${client.email} - ${client.phone}</span>
                <div class="actions">
                    <button onclick="editClient(${client.id})">Editar</button>
                    <button onclick="deleteClient(${client.id})">Eliminar</button>
                </div>
            `;
            clientList.appendChild(li);
        });
    };

    request.onerror = function() {
        console.error('Error al cargar clientes');
        clientList.innerHTML = '<li>Error al cargar los clientes</li>';
    };
}

// Editar clientes
window.editClient = function(id) {
    const transaction = db.transaction(["clients"], "readonly");
    const store = transaction.objectStore("clients");
    const request = store.get(Number(id));

    request.onsuccess = function() {
        const client = request.result;
        if(!client) {
            alert('Cliente no encontrado')
            return;
        }

        nameInput.value = client.name;
        emailInput.value = client.email;
        phoneInput.value = client.phone;

        form.dataset.editingId = client.id;
        addBtn.textContent = 'Guardar cambios';
        addBtn.disabled = false;
        nameInput.classList.add('valid');
        emailInput.classList.add('valid');
        phoneInput.classList.add('valid');
    };
};

// Eliminar cliente
window.deleteClient = function(id) {
    const confirmar = confirm('¿Eliminar cliente?');
    if (!confirmar) {
        return;
    }

    const transaction = db.transaction(['clients'], 'readwrite');
    const store = transaction.objectStore('clients');
    const request = store.delete(Number(id));

    request.onsuccess = function() {
        alert('Cliente eliminado.')
        fetchClients();
    };

    request.onerror = function() {
        alert('Error al eliminar el cliente.');
        console.error('Error:', request.error);
    };
};

