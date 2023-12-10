const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const imageUser = localStorage.getItem("userImage");
function show() {
  // Toggle the "active" class for the navbar
  document.getElementById("navbar").classList.toggle("active");
  document.getElementById("NavButton").classList.toggle("active");
  // Toggle the "active" class for all elements with class "ListaBox"
  const listaBoxes = document.getElementsByClassName("enlaces");
  for (let i = 0; i < listaBoxes.length; i++) {
    listaBoxes[i].classList.toggle("active");
  }

  // Toggle the "active" class for all <span> elements inside <nav> <li>
  const navItems = document.querySelectorAll("nav div span");
  navItems.forEach(function (item) {
    item.classList.toggle("active");
  });
}
window.onload = function () {
  fetch("users.json")
    .then((response) => response.json())
    .then((usersData) => {
      var tbody = document.getElementById("content");

      // Iteramos sobre cada usuario
      usersData.users.forEach((user, index) => {
        // Para cada usuario, creamos una nueva fila en la tabla
        var row = tbody.insertRow();

        var cell1 = row.insertCell();
        cell1.innerHTML = user.user;

        var cell2 = row.insertCell();
        cell2.innerHTML = user.password;

        var cell3 = row.insertCell();
        cell3.innerHTML = user.admin;

        var cell4 = row.insertCell();
        cell4.innerHTML =
          '<button class="delete-row" data-index="' +
          index +
          '"><i class="fi fi-rr-cross-circle"></i></button>' +
          '<button class="edit-row" data-index="' +
          index +
          '" onclick="mostrar()">' +
          '<i class="fi fi-rs-user-pen"></i></button>';

        cell4
          .querySelector(".delete-row")
          .addEventListener("click", function () {
            deleteRow(index);
            ipcRenderer.send("delete-data", index);
            deleteUser(index, user.user);
          });

        cell4.querySelector(".edit-row").addEventListener("click", function () {
          // Muestra el formulario con los datos actuales del usuario
          document.getElementById("user-input").value = user.user;
          document.getElementById("password-input").value = user.password;

          // Guarda el índice de la fila que se está editando
          document.getElementById("edit-index").value = index;
        });
      });
    });
  

  document
    .getElementById("user-form")
    .addEventListener("submit", function (event) {
      // event.preventDefault();
      // Evita que se envíe el formulario

      var index = document.getElementById("edit-index").value;
      var user = document.getElementById("user-input").value;
      var password = document.getElementById("password-input").value;
      var admin = document.getElementById("admin-input").value;

      if (index !== "") {
        // Si se está editando una fila, actualiza los datos
        editRow(index, user, password, admin);
        const fileName = user + ".json";
        saveData(fileName, { user, password, admin }, false); // Pasa false para editar datos existentes
        // Envía los datos al proceso principal para guardarlos en el archivo
        ipcRenderer.send("save-data", { index, user, password, admin });
      } else {
        // Si se está agregando una nueva fila, agrega los datos
        addRow(user, password, admin);
        const fileName = user + ".json";
        saveData(fileName, { user, password, admin });
        // Envía los datos al proceso principal para guardarlos en el archivo
        ipcRenderer.send("save-data", { index, user, password, admin });
      }
    });

  // Cambiar el color de status
  var resultadoElements = document.querySelectorAll("table td .statusTr");

  // Función para cambiar la clase según el texto
  function cambiarColorTexto() {
    for (var i = 0; i < resultadoElements.length; i++) {
      var elemento = resultadoElements[i];
      var texto = elemento.textContent.trim().toLowerCase();

      if (texto === "finalizada") {
        elemento.className = "finalizado";
      } else if (texto === "en curso") {
        elemento.className = "encurso";
      } else if (texto === "cancelada") {
        elemento.className = "cancelada";
      } else if (texto === "pendiente acción acc") {
        elemento.className = "accionAcc";
      } else if (texto === "pendiente acción acc") {
        elemento.className = "accionAcc";
      } else if (texto === "pendiente acción ml/candidato") {
        elemento.className = "accionMl";
      } else if (texto === "no-show") {
        elemento.className = "noshow";
      } else {
        elemento.className = "";
      }
    }
  }
  cambiarColorTexto();

  function addRow(user, password, admin) {
    var tbody = document.getElementById("content");
    var row = tbody.insertRow();

    var cell1 = row.insertCell();
    cell1.innerHTML = user;

    var cell2 = row.insertCell();
    cell2.innerHTML = password;

    var index = tbody.rows.length - 1;

    var cell3 = row.insertCell();
    cell3.innerHTML = admin;

    var cell4 = row.insertCell();
    cell4.innerHTML =
      '<button class="delete-row" data-index="' +
      index +
      '"><i class="fi fi-rr-cross-circle"></i></button>' +
      '<button class="edit-row" data-index="' +
      index +
      '"><i class="fi fi-rs-user-pen"></i></button>';
  }

  // Editar una fila
  function editRow(index, user, password, admin) {
    var tbody = document.getElementById("content");
    var row = tbody.rows[index];

    row.cells[0].innerHTML = user;
    row.cells[1].innerHTML = password;
    row.cells[2].innerHTML = admin;
  }

  function deleteRow(index) {
    var tbody = document.getElementById("content");
    tbody.deleteRow(index);
  }

  // crear un nuevo usuario
  function saveData(fileName, data, isNewData = true) {
    try {
      // Concatena fileName con appPath para obtener la ruta completa
      const appPath = path.join(__dirname, "/");
      const filePath = path.join(appPath, fileName);

      if (isNewData) {
        // Leer el archivo JSON actual, si existe
        let jsonData;
        try {
          jsonData = fs.readFileSync(filePath);
        } catch (error) {
          // Si el archivo no existe, crear un objeto vacío
          jsonData = `{
            "users": [
            ],
            "data": []
          }`;
        }

        // Parsear el JSON existente o el objeto vacío
        const usersData = JSON.parse(jsonData);

        // Agregar el nuevo dato al arreglo de usuarios
        usersData.users.push(data);

        // Guardar los datos actualizados en el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2)); // null, 2 son opciones de formato para legibilidad
      }
    } catch (error) {
      console.error("Error al guardar los datos: " + error);
    }
  }

  function deleteUser(index, userName) {
    // Elimina el usuario del archivo users.json
    const appPath = path.join(__dirname, "/");
    const usersFilePath = path.join(appPath, "users.json");

    try {
      const jsonData = fs.readFileSync(usersFilePath);
      const usersData = JSON.parse(jsonData);
      usersData.users.splice(index, 1); // Elimina el usuario del arreglo

      // Guarda los datos actualizados en users.json
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 1));

      // Elimina el archivo JSON correspondiente al usuario
      const userJsonFilePath = path.join(appPath, userName + ".json");
      fs.unlinkSync(userJsonFilePath);

      // Elimina la fila de la tabla
      deleteRow(index);
    } catch (error) {
      console.error("Error al eliminar el usuario: " + error);
    }
  }

  // seccion de edicion de NEWS
};


// aqui comienza los cuadros

function mostrar() {
  const boton = document.getElementById("button-create");
  const cuadroaAbajo = document.getElementById("cuadro");
  const cuadro = document.getElementById("cuadro-abajo");

  boton.onclick = () => {
    cuadro.style.display = "block";
    cuadroaAbajo.style.display = "block";
  };

  const editElements = document.querySelectorAll("table tbody .edit-row");

  editElements.forEach((element) => {
    element.onclick = () => {
      cuadro.style.display = "block";
      cuadroaAbajo.style.display = "block";
    };
  });
}

function mostraraddnew() {
  const botonaddnew = document.getElementById("addnewbtn");
  const addnewModal = document.getElementById("addnewModal");
  const cuadroaAbajo = document.getElementById("cuadro-abajo");
  botonaddnew.onclick = () => {
    addnewModal.style.display = "block";
    cuadroaAbajo.style.display = "block";
  };
}

function quitar() {
  const editBtn = document.getElementById("quitarEdit");

  // Manejador de evento para editBtn
  editBtn.onclick = () => {
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    const cuadro = document.getElementById("editModal");
    cuadro.style.display = "none";
    cuadroaAbajo.style.display = "none";
  };
}

function quitarAddUser() {
  // Manejador de evento para botonuser
  const botonuser = document.getElementById("delete-cuadro");
  botonuser.onclick = () => {
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    const cuadro = document.getElementById("cuadro");
    cuadro.style.display = "none";
    cuadroaAbajo.style.display = "none";
  };
}

function quitarAddnew() {
  // Manejador de evento para botonuser
  const quitarbutton = document.getElementById("Adddit");
  quitarbutton.onclick = () => {
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    const cuadro = document.getElementById("addnewModal");
    cuadro.style.display = "none";
    cuadroaAbajo.style.display = "none";
  };
}

// seccion de noticias

const container = document.getElementById("left-news");
const noticiaCompleta = document.getElementById("noticia-completa");
const appPath = path.join(__dirname, "/");
const filePath = path.join(appPath, `news.json`);
// Declarar la variable data
let data;

// Cargar los datos desde el archivo JSON
fetch("news.json")
  .then((response) => response.json())
  .then((jsonData) => {
    // Almacena los datos en la variable data
    data = jsonData;

    data.forEach((item, index) => {
      const txtCuadro = document.createElement("div");
      txtCuadro.className = "txtCuadro";
      txtCuadro.id = "txtCuadro" + index;

      const tittle = document.createElement("div");
      tittle.className = "tittle";
      tittle.id = "tittle" + index;

      const h2 = document.createElement("h2");
      h2.textContent = item.titulo;
      h2.id = "titulo" + index;

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fi fi-rr-cross-circle"></i>';
      deleteButton.classList.add("delete-news-row");
      deleteButton.setAttribute("data-index", index);

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<i class="fi fi-rs-user-pen"></i>';
      editBtn.classList.add("edit-news-row");
      editBtn.setAttribute("data-index", index);

      const contenido = document.createElement("div");
      contenido.className = "contenido";
      contenido.id = "contenido" + index;

      const p = document.createElement("p");
      p.textContent = item.previa;
      p.id = "previa" + index;

      // Agrega un evento clic al elemento txtCuadro para mostrar la noticia completa
      txtCuadro.addEventListener("click", () => {
        noticiaCompleta.innerHTML = `  <div class="txtresultado">
          <div class="tittle">
<h2>${item.titulo}</h2>
          </div><p>${item.contenido}</p>`;
      });

      tittle.appendChild(h2);
      contenido.appendChild(p);
      txtCuadro.appendChild(tittle);
      tittle.appendChild(editBtn);
      tittle.appendChild(deleteButton);
      txtCuadro.appendChild(contenido);

      // Agrega el elemento txtCuadro al contenedor principal
      container.appendChild(txtCuadro);
    });

    // ----------------- boton para eliminar
    const deleteButtons = document.querySelectorAll(".delete-news-row");
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const rowIndex = deleteButton.getAttribute("data-index");
        deleteRowAndData(filePath, data, rowIndex);
      });
    });
    // ----------------- boton para eliminar
    const editButtons = document.querySelectorAll(".edit-news-row");
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    editButtons.forEach((editButton) => {
      editButton.addEventListener("click", () => {
        cuadroaAbajo.style.display = "block";
        const rowIndex = editButton.getAttribute("data-index");
        const rowData = data[rowIndex];
        editRow(rowData, rowIndex, data, filePath);
      });
    });
  });

// edicion

// Escuchar el evento de envío del formulario
const form = document.getElementById("newsAdd");
form.addEventListener("submit", (e) => {
  // e.preventDefault();
  //  evita el envio del formulario
  // Obtener los valores del formulario
  const titulo = document.querySelector("#titulo").value;
  const previa = document.querySelector("#previa").value;
  const fecha = document.querySelector("#fecha").value;
  const contenido = document.querySelector("#contenido").value;

  // Enviar datos al proceso principal
  ipcRenderer.send("submit-news-data", {
    titulo,
    previa,
    fecha,
    contenido,
  });
});

// Función para guardar los datos en el archivo JSON
function saveDataToFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Función para eliminar una fila y sus datos
async function deleteRowAndData(filename, data, rowIndex) {
  // Elimina el elemento del array de datos
  data.splice(rowIndex, 1);

  // Guarda los datos actualizados en el archivo
  await saveDataToFile(filename, data);

  // Recarga la página
  window.location.reload();
}

// Función para editar una fila
function editRow(rowData, rowIndex, data, filePath) {
  // Obtener elementos del formulario en el modal de edición
  const edittitulo = document.querySelector("#edittitulo");
  const editprevia = document.querySelector("#editprevia");
  const editfecha = document.querySelector("#editfecha");
  const editcontenido = document.querySelector("#editcontenido");

  // Llenar los campos del formulario con los datos de la fila seleccionada
  edittitulo.value = rowData.titulo;
  editprevia.value = rowData.previa;
  editfecha.value = rowData.fecha;
  editcontenido.value = rowData.contenido;

  // Mostrar el modal de edición
  const editModal = document.getElementById("editModal");
  editModal.style.display = "block";

  // Agregar controlador de evento al formulario de edición
  const editForm = document.getElementById("newsEdit");
  editForm.addEventListener("submit", (e) => {
    // e.preventDefault()
    //evita el envio de formulario
    console.log("Formulario de edición enviado");
    // Actualizar los datos en el array de datos
    data[rowIndex] = {
      titulo: edittitulo.value,
      previa: editprevia.value,
      fecha: editfecha.value,
      contenido: editcontenido.value,
    };

    // Actualizar la fila en la tabla
    updateDivContent([rowIndex], data[rowIndex]);

    // Guardar los datos actualizados en el archivo JSON
    saveDataToFile(filePath, data);

    // Cerrar el modal
    editModal.style.display = "none";
  });
}

function updateDivContent(item, index) {
  const txtCuadro = document.getElementById("txtCuadro" + index);
  if (txtCuadro) {
    const tittle = document.getElementById("tittle" + index);
    if (tittle) {
      const h2 = document.getElementById("titulo" + index);
      if (h2) {
        h2.textContent = item.titulo;
      }
    }

    const contenido = document.getElementById("contenido" + index);
    if (contenido) {
      const p = document.getElementById("previa" + index);
      if (p) {
        p.textContent = item.previa;
      }
    }
  }
}
