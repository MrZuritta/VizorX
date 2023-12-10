function readJsonFile() {
  // Obtener la ruta del archivo JSON usando el nombre de usuario almacenado en localStorage
  const appPath = path.join(__dirname, "/");
  const username = localStorage.getItem("username");
  const filePath = path.join(appPath, `${username}.json`);

  try {
    // Intentar leer y parsear el contenido del archivo JSON
    const jsonData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    // Si hay un error (por ejemplo, el archivo no existe), devolver un objeto vacío
    return {};
  }
}

function appendDataToJsonFile(newData) {
  // Obtener el contenido existente del archivo JSON
  const existingData = readJsonFile();

  // Combinar el contenido existente con los nuevos datos
  const updatedData = {
    ...existingData,
    data: [...existingData.data, ...newData],
  };

  // Escribir el resultado de vuelta al archivo
  const username = localStorage.getItem("username");
  const filePath = path.join(__dirname, `${username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");
}
function convertCsvToJson() {
    const fileInput = document.getElementById('csvInput');
    const file = fileInput.files[0];

    if (file) {
        Papa.parse(file, {
            complete: function(result) {
                const csvData = result.data;

                // Supongamos que el primer elemento del array contiene los nombres de las propiedades
                const headers = csvData[0];

                // Filtrar el array para excluir la fila de encabezados
                const dataRows = csvData.slice(1);

                const jsonDataArray = dataRows.map(row => {
                    const jsonObject = {};

                    // Definir los nombres específicos de las propiedades
                    const propertyNames = [
                        "agente",
                        "status",
                        "pais",
                        "fechaTicket",
                        "ticket",
                        "issuesMl",
                        "issuesAcc",
                        "req",
                        "candidato",
                        "nationalID",
                        "cargo",
                        "clabeBanc",
                        "departamento",
                        "lider",
                        "ingreso",
                        "geid",
                        "comentarios",
                        "username"
                    ];

                    // Asignar los valores del CSV a las propiedades correspondientes
                    propertyNames.forEach((propertyName, index) => {
                        // Verificar si el valor no es undefined antes de llamar a trim
                        const value = row[index];
                        jsonObject[propertyName] = value !== undefined ? value.trim() : '';
                    });

                    return jsonObject;
                });

                // Agregar los nuevos datos al archivo JSON existente
                appendDataToJsonFile(jsonDataArray);

                // Recargar la página después de realizar la conversión
                location.reload();
            },
            skipEmptyLines: true, // Omitir líneas vacías en el archivo CSV
        });
    }
}

