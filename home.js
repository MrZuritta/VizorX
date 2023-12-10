const { ipcRenderer, shell } = require("electron");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const coloresPasteles = [
  "rgba(255, 204, 204, 0.6)", // Rosa pálido
  "rgba(255, 229, 204, 0.6)", // Melocotón
  "rgba(204, 255, 204, 0.6)", // Verde menta
  "rgba(204, 229, 255, 0.6)", // Azul cielo
  "rgba(255, 204, 255, 0.6)", // Lavanda
  "rgba(255, 255, 204, 0.6)", // Amarillo pastel
  "rgba(204, 204, 255, 0.6)", // Azul pastel
  "rgba(229, 204, 255, 0.6)", // Lila
  "rgba(255, 230, 204, 0.6)", // Albaricoque
];
// donut

let mediostac = document.getElementById("mediostac").getContext("2d");

// Carga la lista de usuarios
fetch("users.json")
  .then((response) => response.json())
  .then((usuarios) => {
    // Carga los datos de cada usuario individualmente
    Promise.all(
      usuarios.users.map((usuario) =>
        fetch(usuario.user + ".json").then((response) => response.json())
      )
    )
      .then((datos) => {
        // datos es un array que contiene los datos cargados de cada usuario

        // Crear un array con los nombres de los usuarios que quieres usar como etiquetas
        const labels = usuarios.users.map((usuario) => usuario.user);

        const dataset = datos.map((objeto) => objeto.data.length);

        new Chart(mediostac, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                data: dataset,
                borderColor: "rgba(135,65,200,0.6)",
                backgroundColor: coloresPasteles,
              },
            ],
          },
          options: {},
        });
      })
      .catch((error) => console.error("Error:", error));
  })
  .catch((error) => console.error("Error:", error));

// aqui termina el grafico donut

function show() {
  document.getElementById("navbar").classList.toggle("active");
  document.getElementById("NavButton").classList.toggle("active");

  const listaBoxes = document.getElementsByClassName("enlaces");
  for (let i = 0; i < listaBoxes.length; i++) {
    listaBoxes[i].classList.toggle("active");
  }

  const navItems = document.querySelectorAll("nav div span");
  navItems.forEach(function (item) {
    item.classList.toggle("active");
  });
}
window.onload = function () {
  fetch("users.json")
    .then((response) => response.json())
    .then((usersData) => {
      usersData.users.forEach((user) => {
        fetch(user.user + ".json")
          .then((response) => {
            var jsonTitle = response.url.split("/").pop().split(".")[0];
            return response.json().then((data) => {
              return { title: jsonTitle, data: data };
            });
          })
          .then((result) => {
            var tbody = document.getElementById("content");

            result.data.data.forEach((item, index) => {
              var row = tbody.insertRow();

              var cell1 = row.insertCell();
              cell1.innerHTML = result.title;
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
            });

            $(document).ready(function () {
              // Verificar si la tabla ya es una DataTable
              if ($.fn.DataTable.isDataTable("#miTabla")) {
                // Si la tabla ya es una DataTable, destruirla
                $("#miTabla").DataTable().destroy();
              }

              var table = $("#miTabla").DataTable({
                dom: '<"top"fl<"clear">>rt<"bottom"ip<"clear">>',
                pageLength: 20, // Establecer el mínimo de filas a mostrar
                lengthMenu: [
                  [10, 20, 50, -1],
                  [10, 20, 50, "All"],
                ],
                rowCallback: function (row, data, index) {
                  if (index % 2 === 1) {
                    $(row).css("background-color", "#F0F0F0");
                  }
                }, // Definir las opciones del menú
              });

              $("#customSearchInput").on("keyup", function () {
                table.search(this.value).draw();
              });
            });

            // Función para cambiar la clase según el texto
            // Cambiar el color de status
            var resultadoElements =
              document.querySelectorAll("table td .statusTr");

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

            cambiarColorTexto();
           
            
          });
      });
    });
};

// Función para mostrar las secciones basadas en la opción seleccionada
function filterSections(option) {
  const allSections = document.querySelectorAll(".listBox");
  allSections.forEach((section) => {
    section.classList.add("hidden");
    section.classList.remove("visible");
  });

  const selectedSections = document.querySelectorAll(
    `.listBox[data-state="${option}"]`
  );
  selectedSections.forEach((section) => {
    section.classList.remove("hidden");
    section.classList.add("visible");
  });
}

// Agregar eventos "click" a las opciones de radio
document.querySelectorAll(".input").forEach((radio) => {
  radio.addEventListener("click", () => {
    filterSections(radio.value);
  });
});

// Llamar a filterSections para mostrar la opción seleccionada inicialmente
const initialOption = document.querySelector(".input:checked");
if (initialOption) {
  filterSections(initialOption.value);
}

// carrusel
let currentIndex = 0;
const listBoxItems = document.querySelectorAll(".listBox.visible");
const numItems = listBoxItems.length;

function changeSlide(direction) {
  currentIndex += direction;

  if (currentIndex >= numItems) {
    currentIndex = 0;
  }
  if (currentIndex < 0) {
    currentIndex = numItems - 1;
  }

  const translateValue = -currentIndex * 280; // 300 es el ancho de cada listBox
  document.querySelector(
    ".carousel-container"
  ).style.transform = `translateX(${translateValue}px)`;
}

changeSlide(0);

// cargar datos de noticias

// seccion de noticias

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("left-news");
  const noticiaCompleta = document.getElementById("noticia-completa");

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
        txtCuadro.appendChild(contenido);

        // Agrega el elemento txtCuadro al contenedor principal
        container.appendChild(txtCuadro);
      });
      // Aplicar el clic al último txtCuadro
      const ultimoTxtCuadro = document.getElementById(
        "txtCuadro" + (data.length - 1)
      );
      if (ultimoTxtCuadro) {
        ultimoTxtCuadro.click();
      }
    })
    .catch((error) => {
      console.error("Error al cargar y procesar los datos:", error);
    });
});

function exportTableToExcel(tableID, filename = "") {
  // Obtener la tabla
  var table = document.getElementById(tableID);

  // Convertir la tabla a una hoja de trabajo de Excel
  var ws = XLSX.utils.table_to_sheet(table);

  // Aplicar formato de número a la columna 12 (columna L)
  var range = XLSX.utils.decode_range(ws['!ref']);
  for (var R = range.s.r; R <= range.e.r; ++R) {
      var cell_address = { c: 11, r: R }; 
      var cell_ref = XLSX.utils.encode_cell(cell_address);
  
      if (ws[cell_ref]) {
          ws[cell_ref].t = 's'; // Establecer el tipo de contenido como 's' (cadena de texto)
          ws[cell_ref].v = "'" + ws[cell_ref].v; // Agregar un apóstrofe al inicio de la celda
      }
  
  }

  // Crear un nuevo libro de trabajo y añadir la hoja de trabajo
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Guardar el libro de trabajo como un Blob
  var wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});

  // Crear un Blob a partir del libro de trabajo
  var buf = new ArrayBuffer(wbout.length);
  var view = new Uint8Array(buf);
  for (var i=0; i<wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;

  // Utilizar FileSaver para guardar el Blob como un archivo .xlsx
  saveAs(new Blob([buf], {type:'application/octet-stream'}), filename ? filename + ".xlsx" : "excel_data.xlsx");
}

// Añadir un controlador de eventos para el botón de exportación
document
  .getElementById("export-btn")
  .addEventListener("click", function () {
    exportTableToExcel("miTabla");
  });


  