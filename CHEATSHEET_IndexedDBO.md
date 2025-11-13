# 📚 Cheatsheet de IndexedDB

Guía rápida de referencia con ejemplos de las operaciones más comunes de IndexedDB utilizadas en este proyecto.

***

## 🔧 1. Abrir/Crear Base de Datos

### Sintaxis
```
const request = indexedDB.open(nombreBD, version);
```

### Ejemplo del proyecto
```
let db;
const request = indexedDB.open("CRM_Database", 1);

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Base de datos abierta correctamente");
};

request.onerror = function(event) {
    console.error("Error al abrir la base de datos", event);
};
```
### Explicación

- indexedDB.open() abre una base de datos existente o la crea si no existe

- El segundo parámetro es la versión (número entero)

- Si cambias la versión, se ejecuta onupgradeneeded

*** 

## 🏗️ 2. Crear Object Store (Tabla)

### Sintaxis
```
db.createObjectStore(nombre, opciones);
```

### Ejemplo del proyecto

```
request.onupgradeneeded = function(event) {
    db = event.target.result;
    
    if(!db.objectStoreNames.contains('clients')) {
        const objectStore = db.createObjectStore('clients', { 
            keyPath: 'id', 
            autoIncrement: true 
        });
        
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('phone', 'phone', { unique: false });
    }
};
``` 

### Explicación

- keyPath: 'id' - Define qué propiedad será la clave primaria

- autoIncrement: true - Genera automáticamente IDs únicos

- Los índices permiten búsquedas rápidas y validaciones (email único)

## ➕ 3. Agregar Datos (CREATE)

### Sintaxis
```
const transaction = db.transaction([storeName], "readwrite");
const store = transaction.objectStore(storeName);
const request = store.add(objeto);
``` 

### Ejemplo del proyecto
```
const transaction = db.transaction(["clients"], "readwrite");
const store = transaction.objectStore("clients");

const newClient = { 
    name: "Juan Pérez", 
    email: "juan@example.com", 
    phone: "123456789" 
};

const request = store.add(newClient);

request.onsuccess = function() {
    console.log("Cliente agregado con ID:", request.result);
};

request.onerror = function() {
    console.error("Error al agregar cliente");
};
``` 

### Explicación

- "readwrite" permite escribir datos

- .add() inserta un nuevo registro (falla si la clave ya existe)

- No incluyas el id en el objeto si tienes autoIncrement: true

## 📖 4. Leer Todos los Datos (READ ALL)

### Sintaxis
```
const transaction = db.transaction([storeName], "readonly");
const store = transaction.objectStore(storeName);
const request = store.getAll();
``` 

### Ejemplo del proyecto
```
function fetchClients() {
    const transaction = db.transaction(['clients'], 'readonly');
    const store = transaction.objectStore('clients');
    const request = store.getAll();
    
    request.onsuccess = function() {
        const clients = request.result;
        console.log("Clientes obtenidos:", clients);
    };
}
```

### Explicación

- "readonly" es más eficiente cuando solo lees datos

- .getAll() devuelve un array con todos los registros

- También puedes usar .get(id) para obtener un solo registro

## 🔍 5. Leer Un Registro (READ ONE)

### Sintaxis
``` 
const request = store.get(clave);
``` 

### Ejemplo del proyecto
```
const transaction = db.transaction(["clients"], "readonly");
const store = transaction.objectStore("clients");
const request = store.get(5);

request.onsuccess = function() {
    const client = request.result;
    if (client) {
        console.log("Cliente encontrado:", client);
    } else {
        console.log("Cliente no encontrado");
    }
};
``` 

### Explicación:

- .get(clave) busca por la clave primaria (en nuestro caso, el id)

- Devuelve undefined si no encuentra el registro

## ✏️ 6. Actualizar Datos (UPDATE)

### Sintaxis
```
const request = store.put(objeto);
``` 

### Ejemplo del proyecto
``` 
const transaction = db.transaction(["clients"], "readwrite");
const store = transaction.objectStore("clients");

const updatedClient = { 
    id: 5,
    name: "Juan Pérez Actualizado", 
    email: "juan.nuevo@example.com", 
    phone: "987654321" 
};

const request = store.put(updatedClient);

request.onsuccess = function() {
    console.log("Cliente actualizado correctamente");
};
``` 

### Explicación

- .put() actualiza si existe o inserta si no existe

- Debe incluir la clave primaria (id) para actualizar

- Si no existe el registro, lo crea nuevo

## ❌ 7. Eliminar Datos (DELETE)

### Sintaxis
```
const request = store.delete(clave);
``` 

### Ejemplo del proyecto
```
const transaction = db.transaction(['clients'], 'readwrite');
const store = transaction.objectStore('clients');
const request = store.delete(5);

request.onsuccess = function() {
    console.log('Cliente eliminado correctamente');
};

request.onerror = function() {
    console.error('Error al eliminar cliente');
};
``` 

### Explicación:

- .delete(clave) elimina el registro con esa clave primaria

- No lanza error si la clave no existe

## 🔄 8. Transacciones

### Tipos de transacciones
- "readonly" - Solo lectura (más rápida)

- "readwrite" - Lectura y escritura

### Ejemplo
``` 
const txRead = db.transaction(['clients'], 'readonly');
const txWrite = db.transaction(['clients'], 'readwrite');
``` 

### Buenas prácticas:

- Usa readonly siempre que no necesites modificar datos

- Las transacciones se cierran automáticamente al finalizar

## ⚠️ 9. Manejo de Errores

### Patrón recomendado
```
request.onsuccess = function() {
    // Código cuando todo va bien
};

request.onerror = function() {
    console.error('Error:', request.error);
};
``` 

### Errores comunes:

- ConstraintError - Violación de restricción única (email duplicado)

- NotFoundError - Registro no encontrado

- AbortError - Transacción cancelada

## 🎯 10. Conversión de Tipos

### Importante para las claves
```
const id = Number(clientId);
store.get(id);
```

### En nuestro proyecto:

Siempre convertimos el id a número con Number(id)

Esto evita problemas al buscar, actualizar o eliminar

## 📊 Resumen de Operaciones CRUD

**Crear:**

- Método: store.add(objeto)

- Transacción: readwrite

**Leer todos:**

- Método: store.getAll()

- Transacción: readonly

**Leer uno:**

- Método: store.get(clave)

- Transacción: readonly

**Actualizar:**

- Método: store.put(objeto)

- Transacción: readwrite

**Eliminar:**

- Método: store.delete(clave)

- Transacción: readwrite

***

# 🙋‍♂️ Autor
Natalia Alejo Pérez - Estudiante de 2º DAW

Enlace al repositorio: [https://github.com/Naleper90/Protecto_crm-indexeddb.git](https://github.com/Naleper90/Protecto_crm-indexeddb.git) 