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

        // Crear un array con la cantidad de objetos en el array 'data' de cada archivo que tienen 'country': 'mexico'
        const dataset = datos.map((objeto) => objeto.data.length);

        new Chart(mediostac, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                data: dataset,
                borderColor: "rgba(135,65,200,0.6)",
                backgroundColor: "rgba(135,65,165,0.2)",
              },
            ],
          },
          options: {},
        });
      })
      .catch((error) => console.error("Error:", error));
  })
  .catch((error) => console.error("Error:", error));
