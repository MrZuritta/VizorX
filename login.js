const { BrowserWindow } = require('electron')
const path = require("path");

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("uname");
    var password = document.getElementById("pwd");
    var errorElement = document.querySelector('#error');

    const appPath = path.join(__dirname, "/");
    const usersFilePath = path.join(appPath, "users.json");

    fetch(usersFilePath)
      .then((response) => response.json())
      .then((data) => {
        var user = data.users.find(
          (user) =>
            user.user == username.value && user.password == password.value
        );

        if (user) {
          localStorage.setItem("username", username.value);
          // Verificar si el usuario es administrador o no
          if (user.admin == "true") {
            window.location.href = "homeadmin.html";
          } else {
            window.location.href = "home.html";
          }
        } else {
          errorElement.style.display = 'block';
        }
      });
  });
