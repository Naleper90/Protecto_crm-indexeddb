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
const phoneRegex = /^[0-9]{9}$/;

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

    const transaction = db.transaction(["clients"], "readwrite");
    const store = transaction.objectStore("clients");

    const newClient = { name, email, phone };
    const request = store.add(newClient);

    request.onsuccess = function() {
        alert("Cliente guardado con éxito.")
        form.reset();
        [nameInput, emailInput, phoneInput].forEach(inp => inp.classList.remove("valid", "invalid"));
        addBtn.disabled = true;
        fetchClients(); 
    };
    request.onerror = function() {
        alert("No se pudo agregar el cliente, email ya existente.");
    };
});


// --- LISTADO DINÁMICO ---
// TODO: Implementar función para mostrar clientes guardados en IndexedDB
function fetchClients() {
    // Código eliminado para que alumnos implementen mecanismo de lectura
}

// --- EDITAR CLIENTE ---
window.editClient = function(id) {
    // Código eliminado para implementación del alumno
};

// --- ELIMINAR CLIENTE ---
window.deleteClient = function(id) {
    // Código eliminado para implementación del alumno
};

