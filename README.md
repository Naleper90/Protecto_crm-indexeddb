# 📋 CRM con IndexedDB
Este proyecto es una aplicación de gestión de clientes (CRM) que permite almacenar, validar, editar, eliminar y listar clientes en el navegador usando IndexedDB. Es un ejercicio didáctico enfocado en poner en práctica acciones CRUD (Create, Read, Update, Delete) con almacenamiento local, validación de formularios y manejo del DOM.

***

## 🚩 Estado del proyecto
✅ Proyecto completado - Todas las funcionalidades CRUD están implementadas y funcionando correctamente.

---

## 📁 Estructura de carpetas
```
Protecto_crm-indexeddb/
│
├── index.html                # Página principal (Usando CSS en el HTML)
└── js/
    └── crm-indexeddb.js      # Lógica JS (validaciones e IndexedDB)

``` 

---

## ⚙️ Tecnologías usadas
- HTML5 y CSS3 (estilos básicos en línea)

- JavaScript (puro, sin frameworks)

- IndexedDB API para almacenamiento en el navegador

---

## ✅ Funcionalidades implementadas

1. Validación de formularios con expresiones regulares
- Nombre: Mínimo 2 caracteres, solo letras (incluye acentos y ñ)

- Email: Formato estándar usuario@dominio.extensión

- Teléfono: 9-10 dígitos con guiones opcionales (ej: 123-456-789)

- Validación en tiempo real con feedback visual (clases CSS valid/invalid)

- Botón "Agregar Cliente" solo se activa cuando todos los campos son válidos

2. Agregar clientes (Create)
- Almacenamiento en IndexedDB con generación automática de ID

- Validación de email único (no permite duplicados)

- Mensajes de confirmación y error

3. Listar clientes (Read)
- Carga automática de todos los clientes al abrir la página

- Visualización dinámica en formato lista

- Botones de "Editar" y "Eliminar" por cada cliente

4. Editar clientes (Update)
- Al pulsar "Editar", el formulario se rellena con los datos del cliente

- El botón cambia a "Guardar cambios"

- Actualización mediante .put() de IndexedDB

- Restauración automática del formulario tras guardar

5. Eliminar clientes (Delete)
- Confirmación antes de eliminar

- Eliminación mediante .delete() de IndexedDB

- Actualización automática del listado

6. Manejo de errores
- Control de errores en todas las operaciones IndexedDB

- Mensajes informativos para el usuario

- Validación de existencia de clientes antes de editar

---

## 🛠️ Cómo usar el proyecto

**Instalación**

1. Clona el repositorio:

```
git clone https://github.com/Naleper90/Protecto_crm-indexeddb.git
```

2. Abre la carpeta en Visual Studio Code o tu editor favorito.

3. Abre index.html en tu navegador (doble clic o desde el editor).

4. Realiza pruebas en el formulario para ver la validación básica actual.

5. Consulta la consola del navegador si quieres debuggear la base de datos (Cmd + Option + J en Mac).

**Uso**

1. Agregar un cliente:

- Rellena los campos (nombre, email, teléfono)

- Los campos se validarán automáticamente al perder el foco

- Cuando todos sean válidos, pulsa "Agregar Cliente"

2. Editar un cliente:

- Pulsa el botón "Editar" del cliente que quieras modificar

- Los datos se cargarán en el formulario

- Modifica lo que necesites y pulsa "Guardar cambios"

3. Eliminar un cliente:

- Pulsa el botón "Eliminar" del cliente que quieras borrar

- Confirma la acción en el cuadro de diálogo

4. Ver la lista de clientes:

- Todos los clientes guardados se muestran automáticamente debajo del formulario

---

## 🛠️ Estructura de IndexedDB
- Base de datos: CRM_Database (versión 1)

- Object Store: clients

    - keyPath: id (autoincremental)

    - Índices:

        - name (no único)

        - email (único - no permite duplicados)

        - phone (no único)

---

## 📝 Validaciones implementadas 

**Nombre:**
- Validación: Mínimo 2 caracteres, solo letras y espacios
- Regex: `/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/`

**Email:**
- Validación: Formato estándar email
- Regex: `/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/`

**Teléfono:**
- Validación: 9-10 dígitos con guiones opcionales
- Regex: `/^\d{3}-?\d{3}-?\d{3,4}$/`

---

## 🔗 Recursos adicionales

- [MDN - Usando IndexedDB](https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Tutorial de JavaScript Moderno - IndexedDB](https://es.javascript.info/indexeddb)
- [Web.dev - Trabajar con IndexedDB](https://web.dev/articles/indexeddb)
- [MDN - Expresiones Regulares](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions)

---

# 🙋‍♂️ Autor
Natalia Alejo Pérez - Estudiante de 2º DAW

Enlace al repositorio: [https://github.com/Naleper90/Protecto_crm-indexeddb.git](https://github.com/Naleper90/Protecto_crm-indexeddb.git) 