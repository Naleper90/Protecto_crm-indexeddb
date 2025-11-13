let db;

const request = indexedDB.open("CRM_Database", 1);

request.onerror = function(event) {
    console.error("Error abriendo IndexedDB", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    fetchClients(); // Cargar clientes almacenados
};

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

addBtn.disabled = true; 

const nameInput = document.getElementById('name');
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;

const emailInput = document.getElementById('email');
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const phoneInput = document.getElementById('phone');
const phoneRegex = /^\d{3}-?\d{3}-?\d{3,4}$/;

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
    }
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
};

