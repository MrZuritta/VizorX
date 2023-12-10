// En tu archivo principal (main.js)

const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "ico.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("login.html");
}

app.whenReady().then(createWindow);

ipcMain.on("submit-data", (event, data) => {
  var username = data.username;
  const appPath = path.join(__dirname, "/");
  // Construye la ruta completa al archivo
  const filePath = path.join(appPath, `${username}.json`);

  fs.readFile(filePath, (err, fileData) => {
    if (err) throw err;

    let jsonData = JSON.parse(fileData);
    jsonData.data.push(data);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
  });
});

// editar y agregar datos en admin.js

ipcMain.on("save-data", (event, data) => {
  // Leer el archivo JSON
  const appPath = path.join(__dirname, "/users.json");
  fs.readFile(appPath, (err, fileData) => {
    if (err) throw err;
    let usersData = JSON.parse(fileData);

    if (typeof usersData !== "undefined" && usersData.users) {
      if (data.index !== "") {
        // Si se está editando una fila, actualiza los datos
        usersData.users[data.index] = {
          user: data.user,
          password: data.password,
          admin: data.admin,
        }; 45 
      } else {
        // Si se está agregando una nueva fila, agrega los datos
        usersData.users.push({
          user: data.user,
          password: data.password,
          admin: data.admin,
        });
      }
    } else {
      console.error("El archivo JSON no tiene la estructura esperada.");
    }

    // Guardar los datos actualizados en el archivo JSON
    fs.writeFile(appPath, JSON.stringify(usersData), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo JSON: " + err);
      } else {
        console.log("Datos guardados correctamente.");
      }
    });
  });
});

// eliminar fila en admin.js
ipcMain.on("delete-data", (event, index) => {
  const appPath = path.join(__dirname, "/users.json");
  // Leer el archivo JSON
  fs.readFile(appPath, (err, fileData) => {
    if (err) throw err;
    let usersData = JSON.parse(fileData);

    // Eliminar el usuario en el índice especificado
    usersData.users.splice(index, 1);

    // Guardar los datos actualizados en el archivo JSON
    fs.writeFile(appPath, JSON.stringify(usersData), (err) => {
      if (err) throw err;
      console.log("Usuario eliminado correctamente.");
    });
  });
});



// EDICION DE DATOS DE NEWS

ipcMain.on("submit-news-data", (event, data) => {
  const appPath = path.join(__dirname, "/");
  const filePath = path.join(appPath, "news.json");

  fs.readFile(filePath, (err, fileData) => {
    if (err) throw err;

    let jsonData = JSON.parse(fileData);
    jsonData.push(data); 

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
  });
});


// backup system
ipcMain.on('start-backup', (event, data) => {
  var username = data.username;
  const appPath = path.join(__dirname, "/");
  const filePath = path.join(appPath, `${username}.json`);
  
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      console.error(err);
      return;
    }
    
    let jsonData = JSON.parse(fileData);
    let backupData = { "data": [] };
    let newData = {
      "users": jsonData.users, // Copia los datos de 'users' del objeto original
      "data": []
    };
    
    jsonData.data.forEach((item) => {
      let ingresoDate = new Date(item.ingreso);
      let twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
      if (ingresoDate < twoMonthsAgo && item.status === "Finalizada" ||  item.status === "Cancelada" ) {
        backupData.data.push(item);
      } else {
        newData.data.push(item); // Guarda los datos que no se respaldarán
      }
    });
    
    const backupFilePath = path.join(appPath, 'backup.json');
    fs.readFile(backupFilePath, (err, backupFileData) => {
      if (err && err.code !== 'ENOENT') {
        console.error(err);
        return;
      }
      
      let backupJsonData = err ? { "data": [] } : JSON.parse(backupFileData);
      
      // Combina los datos de respaldo existentes con los nuevos datos de respaldo
      backupJsonData.data.push(...backupData.data);
      
      fs.writeFile(backupFilePath, JSON.stringify(backupJsonData, null, 2), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Data written to backup file");
          // Escribe los nuevos datos en el archivo original después de que los datos de respaldo se hayan escrito correctamente
          fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Original data updated");
            }
          });
        }
      });
    });
  });
});
