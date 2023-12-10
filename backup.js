const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

window.onload = function () {
    fetch("backup.json")
    .then((response) => response.json())
    .then((data) => {
      var tbody = document.getElementById("backupcontent");
      data.data.forEach((item) => {
        var row = tbody.insertRow();

  
        var cell1 = row.insertCell();
        cell1.innerHTML = item.agente;
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

        $(document).ready(function () {
          // Verificar si la tabla ya es una DataTable
          if ($.fn.DataTable.isDataTable("#backup")) {
            // Si la tabla ya es una DataTable, destruirla
            $("#backup").DataTable().destroy();
          }

          var table = $("#backup").DataTable({
            dom: '<"top"fl<"clear">>rt<"bottom"ip<"clear">>',
            pageLength: 20, // Establecer el mínimo de filas a mostrar
            lengthMenu: [
              [10, 20, 50, -1],
              [10, 20, 50, "All"],
            ], // Definir las opciones del menú
            rowCallback: function (row, data, index) {
              if (index % 2 === 1) {
                $(row).css("background-color", "#F0F0F0");
              }
            },
          });

          $("#customSearchInput").on("keyup", function () {
            table.search(this.value).draw();
          });
        });
      });
    });
}

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
      exportTableToExcel("backup");
    });
  
  