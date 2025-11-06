# 📋 CRM con IndexedDB
Este proyecto es una aplicación de gestión de clientes (CRM) que permite almacenar, validar y listar clientes en el navegador usando IndexedDB. Es un ejercicio didáctico y está enfocado en poner en práctica acciones básicas de almacenamiento en local, validación de formularios y manejo del DOM.

## 🚩 Estado del proyecto
En progreso. Actualmente incluye:

- Estructura inicial del proyecto (HTML, CSS, JS)

- Validación de campos del formulario cliente con expresiones regulares

- Activación dinámica del botón "Agregar Cliente" solo cuando los datos son válidos

- Inicio de integración con IndexedDB (creación de la base y almacén)

- Primer commit subido a GitHub

## 📁 Estructura de carpetas
```
Protecto_crm-indexeddb/
│
├── index.html                # Página principal (Usando CSS en el HTML)
└── js/
    └── crm-indexeddb.js      # Lógica JS (validaciones e IndexedDB)

``` 
## ⚙️ Tecnologías usadas
- HTML5 y CSS3 (estilos básicos en línea)

- JavaScript (puro, sin frameworks)

- IndexedDB API para almacenamiento en el navegador

## ✅ Funcionalidades actuales

- Validación de nombre (mínimo dos letras, permite letras acentuadas)

- Validación de email y teléfono pendiente de perfeccionar, pero estructurada

- Activación/desactivación automática del botón "Agregar Cliente" según validez de los campos

- Preparación del listener para enviar el formulario y almacenar los datos en IndexedDB

## 🔜 Próximos pasos
- Completar la validación de los campos de email y teléfono

- Implementar la función para insertar clientes en IndexedDB

- Listar los clientes guardados en pantalla

- Añadir funciones para editar y eliminar clientes

## 🛠️ Cómo colaborar o probar
1. Clona el repositorio:

```
git clone https://github.com/Naleper90/Protecto_crm-indexeddb.git
```

2. Abre la carpeta en Visual Studio Code o tu editor favorito.

3. Abre index.html en tu navegador (doble clic o desde el editor).

4. Realiza pruebas en el formulario para ver la validación básica actual.

5. Consulta la consola del navegador si quieres debuggear la base de datos (Cmd + Option + J en Mac).

# 🙋‍♂️ Autor
Natalia Alejo Pérez - Estudiante de 2º DAW
Enlace al repositorio: [https://github.com/Naleper90/Protecto_crm-indexeddb.git](https://github.com/Naleper90/Protecto_crm-indexeddb.git) 