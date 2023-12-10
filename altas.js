const { ipcRenderer, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const table_rows = document.querySelectorAll("tbody tr");
const username = localStorage.getItem("username");

// Obtener el nombre del archivo y ubicacion
const appPath = path.join(__dirname, "/");
const filePath = path.join(appPath, `${username}.json`);

window.onload = function () {
  // sistema de backup

  ipcRenderer.send("start-backup", { username: username });

  ipcRenderer.on("backup-data-response", (event, response) => {
    if (response.success) {
      log("Operación de copia de seguridad exitosa: ", response.message);
    } else {
      log("Error durante la operación de copia de seguridad: ", response.error);
    }
  });

  const appPath = path.join(__dirname, "/");
  const filePath = path.join(appPath, `${username}.json`);

  // tabla de datos
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      var tbody = document.getElementById("content");

      // Iterar sobre los datos y agregar filas a la tabla
      data.data.forEach((item, index) => {
        var row = tbody.insertRow();

        var cell1 = row.insertCell();
        cell1.innerHTML = username;

        var cell2 = row.insertCell();
        cell2.innerHTML = '<p class="statusTr">' + item.status + "</p>";

        var cell3 = row.insertCell();
        cell3.innerHTML = item.pais;

        var cell4 = row.insertCell();
        cell4.innerHTML = item.fechaTicket;

        var cell5 = row.insertCell();
        cell5.innerHTML = item.ticket;

        var cell6 = row.insertCell();
        cell6.innerHTML = item.candidato;

        var cell7 = row.insertCell();
        cell7.innerHTML = item.nationalID;

        var cell8 = row.insertCell();
        cell8.innerHTML = item.cargo;

        var cell9 = row.insertCell();
        cell9.innerHTML = item.departamento;

        var cell10 = row.insertCell();
        cell10.innerHTML = item.lider;

        var cell11 = row.insertCell();
        cell11.innerHTML = item.ingreso;

        var cell12 = row.insertCell();
        cell12.innerHTML = item.geid;

        var cell13 = row.insertCell();
        cell13.innerHTML = item.comentarios;

        var cell14 = row.insertCell();
        cell14.innerHTML =
          '<button class="delete-row" data-index="' +
          index +
          '"><i class="fi fi-rr-cross-circle"></i></button>' +
          '<button class="edit-row" data-index="' +
          index +
          '"><i class="fi fi-rs-user-pen"></i></button>';

        // ----------------- boton para eliminar
        // Agregar controladores de eventos a los botones de eliminación y edición
        const deleteButton = cell14.querySelector(".delete-row");
        deleteButton.addEventListener("click", () => {
          const rowIndex = deleteButton.getAttribute("data-index");

          // Crear el div de confirmación
          const confirmationDiv = document.createElement("div");
          confirmationDiv.style.backgroundColor = "#f8f9fa";
          confirmationDiv.style.border = "1px solid #dee2e6";
          confirmationDiv.style.padding = "20px";
          confirmationDiv.style.marginTop = "20px";
          confirmationDiv.style.width = "300px";
          confirmationDiv.style.textAlign = "center";
          confirmationDiv.style.position = "absolute";
          confirmationDiv.style.top = "50%";
          confirmationDiv.style.left = "50%";
          confirmationDiv.style.transform = "translate(-50%, -50%)";

          // Crear el mensaje de confirmación
          const message = document.createElement("p");
          message.textContent =
            "¿Estás seguro de que quieres eliminar esta fila?";
          message.style.marginBottom = "10px";
          confirmationDiv.appendChild(message);

          // Crear el botón de confirmar
          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Confirmar";
          confirmButton.style.backgroundColor = "#28a745";
          confirmButton.style.color = "white";
          confirmButton.style.border = "none";
          confirmButton.style.padding = "10px 20px";
          confirmButton.style.marginRight = "10px";
          confirmButton.style.cursor = "pointer";
          confirmButton.addEventListener("click", () => {
            deleteRowAndData(filePath, data, rowIndex);
            // window.location.reload(); // Recargar la página después de eliminar el elemento

            // Eliminar el div de confirmación
            document.body.removeChild(confirmationDiv);
          });
          confirmationDiv.appendChild(confirmButton);

          // Crear el botón de cancelar
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "Cancelar";
          cancelButton.style.backgroundColor = "#dc3545";
          cancelButton.style.color = "white";
          cancelButton.style.border = "none";
          cancelButton.style.padding = "10px 20px";
          cancelButton.style.cursor = "pointer";
          cancelButton.addEventListener("click", () => {
            // Eliminar el div de confirmación
            document.body.removeChild(confirmationDiv);
          });
          confirmationDiv.appendChild(cancelButton);

          // Agregar el div de confirmación al cuerpo del documento
          document.body.appendChild(confirmationDiv);
        });

        // -------------------  boton para editar

        const cuadroaAbajo = document.getElementById("cuadro-abajo");
        const editButton = cell14.querySelector(".edit-row");
        editButton.addEventListener("click", () => {
          cuadroaAbajo.style.display = "block";
          const rowIndex = editButton.getAttribute("data-index");
          editRow(data.data[rowIndex], rowIndex, data, filePath);
        });
      });

      // --------------- Cambiar el color de status
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
          } else if (texto === "pendiente") {
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

      $(document).ready(function () {
        var table = $("#miTabla").DataTable({
          dom: '<"top"fl<"clear">>rt<"bottom"ip<"clear">>',
          pageLength: 20, // Establecer el mínimo de filas a mostrar
          lengthMenu: [
            [10, 20, 50, -1],
            [10, 20, 50, "All"],
          ], // Definir las opciones del menú
        });

        $("#customSearchInput").on("keyup", function () {
          table.search(this.value).draw();
        });
      });
      cambiarColorTexto();
    });
};

// Función para guardar los datos en el archivo JSON
function saveDataToFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
}

// Función para eliminar una fila y sus datos
function deleteRowAndData(filename, data, rowIndex) {
  data.data.splice(rowIndex, 1);
  saveDataToFile(filename, data);
}

// Escuchar el evento de envío del formulario
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  //  e.preventDefault()
  // evita el envio del formulario
  // Obtener los valores del formulario
  const agente = username;
  const status = document.querySelector("#status").value;
  const pais = document.querySelector("#pais").value;
  const fechaTicket = document.querySelector("#fechaTicket").value;
  const ticket = document.querySelector("#ticket").value;
  const candidato = document.querySelector("#candidato").value;
  const nationalID = document.querySelector("#nationalID").value;
  const cargo = document.querySelector("#cargo").value;
  const departamento = document.querySelector("#departamento").value;
  const lider = document.querySelector("#Lider").value;
  const ingreso = document.querySelector("#ingreso").value;
  const geid = document.querySelector("#geid").value;
  const comentarios = document.querySelector("#comentarios").value;

  // Enviar datos al proceso principal
  ipcRenderer.send("submit-data", {
    agente,
    status,
    pais,
    fechaTicket,
    ticket,
    candidato,
    nationalID,
    cargo,
    departamento,
    lider,
    ingreso,
    geid,
    comentarios,
    username,
  });
});

// Función para editar una fila
function editRow(rowData, rowIndex, data, filePath) {
  // Obtener elementos del formulario en el modal de edición
  const editPais = document.querySelector("#editpais");
  const editStatus = document.querySelector("#editstatus");
  const editfechaTicket = document.querySelector("#editfechaTicket");
  const editTicket = document.querySelector("#editticket");
  const editCandidato = document.querySelector("#editcandidato");
  const editNationalID = document.querySelector("#editnationalID");
  const editCargo = document.querySelector("#editcargo");
  const editdepartamento = document.querySelector("#editdepartamento");
  const editlider = document.querySelector("#editLider");
  const editIngreso = document.querySelector("#editingreso");
  const editGeid = document.querySelector("#editgeid");
  const editComentarios = document.querySelector("#editcomentarios");

  // Llenar los campos del formulario con los datos de la fila seleccionada
  editStatus.value = rowData.status;
  editPais.value = rowData.pais;
  editfechaTicket.value = rowData.fechaTicket;
  editTicket.value = rowData.ticket;
  editCandidato.value = rowData.candidato;
  editNationalID.value = rowData.nationalID;
  editCargo.value = rowData.cargo;
  editdepartamento.value = rowData.departamento;
  editlider.value = rowData.lider;
  editIngreso.value = rowData.ingreso;
  editGeid.value = rowData.geid;
  editComentarios.value = rowData.comentarios;

  // Mostrar el modal de edición
  const editModal = document.getElementById("editModal");
  editModal.style.display = "block";

  // Agregar controlador de evento al formulario de edición
  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", (e) => {
    // e.preventDefault()
    //evita el envio de formulario
    console.log("Formulario de edición enviado");
    // Actualizar los datos en el array de datos
    data.data[rowIndex] = {
      agente: username,
      status: editStatus.value,
      pais: editPais.value,
      fechaTicket: editfechaTicket.value,
      ticket: editTicket.value,
      candidato: editCandidato.value,
      nationalID: editNationalID.value,
      cargo: editCargo.value,
      departamento: editdepartamento.value,
      lider: editlider.value,
      ingreso: editIngreso.value,
      geid: editGeid.value,
      comentarios: editComentarios.value,
    };

    // Actualizar la fila en la tabla
    updateTableRow(table_rows[rowIndex], data.data[rowIndex]);

    // Guardar los datos actualizados en el archivo JSON
    saveDataToFile(filePath, data);

    // Cerrar el modal
    editModal.style.display = "none";
  });
}

// Función para actualizar una fila en la tabla
function updateTableRow(row, rowData) {
  if (row && row.cells) {
    row.cells[0].innerHTML = rowData.agente;
    row.cells[1].innerHTML = '<p class="statusTr">' + rowData.status + "</p>";
    row.cells[2].innerHTML = rowData.pais;
    row.cells[3].innerHTML = rowData.fechaTicket;
    row.cells[4].innerHTML = rowData.ticket;
    row.cells[5].innerHTML = rowData.candidato;
    row.cells[6].innerHTML = rowData.nationalID;
    row.cells[7].innerHTML = rowData.cargo;
    row.cells[8].innerHTML = rowData.departamento;
    row.cells[9].innerHTML = rowData.lider;
    row.cells[10].innerHTML = rowData.ingreso;
    row.cells[11].innerHTML = rowData.geid;
    row.cells[12].innerHTML = rowData.comentarios;
    row.cells[13].innerHTML =
      '<button class="delete-row" data-index="' +
      index +
      '"><i class="fi fi-rr-cross-circle"></i></button>' +
      '<button class="edit-row" data-index="' +
      index +
      '"><i class="fi fi-rs-user-pen"></i></button>';
  }
}

// Funciones para mostrar y quitar elementos del DOM
function show() {
  // Cambiar la clase "active" de la barra de navegación
  document.getElementById("navbar").classList.toggle("active");
  document.getElementById("NavButton").classList.toggle("active");

  // Cambiar la clase "active" de los elementos con clase "enlaces"
  const listaBoxes = document.getElementsByClassName("enlaces");
  for (let i = 0; i < listaBoxes.length; i++) {
    listaBoxes[i].classList.toggle("active");
  }

  // Cambiar la clase "active" de todos los <span> dentro de <nav> <li>
  const navItems = document.querySelectorAll("nav div span");
  navItems.forEach(function (item) {
    item.classList.toggle("active");
  });
}

function mostrar() {
  const boton = document.getElementById("button-create");
  boton.onclick = () => {
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    const cuadro = document.getElementById("cuadro");

    cuadro.style.display = "block";
    cuadroaAbajo.style.display = "block";
  };
}

function quitar() {
  const boton = document.getElementById("delete-cuadro");
  const editBtn = document.getElementById("quitarEdit");
  boton.onclick = () => {
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    const cuadro = document.getElementById("cuadro");

    cuadro.style.display = "none";
    cuadroaAbajo.style.display = "none";
  };
}

function quitaredit() {
  const cuadroEdit = document.getElementById("quitarEdit");
  quitarEdit.onclick = () => {
    const cuadroEdit = document.getElementById("editModal");
    const cuadroaAbajo = document.getElementById("cuadro-abajo");
    cuadroEdit.style.display = "none";
    cuadroaAbajo.style.display = "none";
  };
}

// habilitar status finalizada

function updateStatus() {
  var editgeidValue = document.getElementById("editgeid").value;
  var editstatusSelect = document.getElementById("editstatus");

  // Verifica si hay información en el campo editgeid
  if (editgeidValue.trim() !== "") {
    // Comprueba si la opción "Finalizada" ya está presente
    if (!optionExists(editstatusSelect, "Finalizada")) {
      // Agrega la opción "Finalizada"
      var option = document.createElement("option");
      option.text = "Finalizada";
      option.value = "Finalizada";
      editstatusSelect.add(option);
    }
  } else {
    // Elimina la opción "Finalizada" si existe
    removeOption(editstatusSelect, "Finalizada");
  }
}

function optionExists(select, value) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      return true;
    }
  }
  return false;
}

function removeOption(select, value) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      select.remove(i);
      break;
    }
  }
}

function validacionClave() {
  const valorCampo = document.getElementById("clabeBanc").value;
  const bttn = document.getElementById("enviarDatos");
  const etiqueta = document.getElementById("etiqueta");

  if (valorCampo.length !== 18 && valorCampo.length !== 0) {
    etiqueta.style.display = "block";
    bttn.disabled = true;
    return false;
  } else {
    etiqueta.style.display = "none";
    bttn.disabled = false;
    return true;
  }
}


function validacioneditClave() {
  const editValorCampo = document.getElementById("editClabeBanc").value;
  const etiqueta = document.getElementById("editetiqueta");
  const bttn = document.getElementById("botonEdit");
  
  if (editValorCampo.length !== 18 && editValorCampo.length !== 0) {
    etiqueta.style.display = "block";
    bttn.disabled = true;
    return false;
  } else {
    etiqueta.style.display = "none";
    bttn.disabled = false;
    return true;
  }
}

