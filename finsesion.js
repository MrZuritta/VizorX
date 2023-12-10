const logOff = document.querySelector("#out");
const cuadroAbajo = document.querySelector("#cuadro-abajo");
logOff.addEventListener("click", () => {
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
  confirmationDiv.style.zIndex = "200";
  confirmationDiv.style.transform = "translate(-50%, -50%)";

  // Crear el mensaje de confirmación
  const message = document.createElement("p");
  message.textContent = "¿Estás seguro de que quieres deslogarte?";
  message.style.marginBottom = "10px";
  confirmationDiv.appendChild(message);
  cuadroAbajo.style.display = "block";
  // Crear el botón de confirmar
  const confirmButtonOut = document.createElement("button");
  confirmButtonOut.textContent = "Confirmar";
  confirmButtonOut.style.backgroundColor = "#28a745";
  confirmButtonOut.style.color = "white";
  confirmButtonOut.style.border = "none";
  confirmButtonOut.style.padding = "10px 20px";
  confirmButtonOut.style.marginRight = "10px";
  confirmButtonOut.style.cursor = "pointer";
  confirmButtonOut.addEventListener("click", () => {
    window.location.href = "login.html";
    // window.location.reload(); // Recargar la página después de eliminar el elemento
  });
  confirmationDiv.appendChild(confirmButtonOut);

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
    cuadroAbajo.style.display = "none";
  });
  confirmationDiv.appendChild(cancelButton);

  // Agregar el div de confirmación al cuerpo del documento
  document.body.appendChild(confirmationDiv);
});
