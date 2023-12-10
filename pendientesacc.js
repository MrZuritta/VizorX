function createACCChart(canvasId, country) {
    const canvas = document.getElementById(canvasId).getContext("2d");
    
    fetch("users.json")
      .then((response) => response.json())
      .then((usuarios) => {
        Promise.all(
          usuarios.users.map((usuario) =>
            fetch(usuario.user + ".json").then((response) => response.json())
          )
        )
          .then((datos) => {
            const labels = usuarios.users.map((usuario) => usuario.user);
    
            const dataset = datos.map(
              (objeto) =>
                objeto.data.filter(
                  (item) => item.status.toLowerCase() === "pendiente" && item.pais.toLowerCase() === country.toLowerCase()
                ).length
            );
    
            new Chart(canvas, {
              type: "bar",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Pendientes " + country,
                    data: dataset,
                    backgroundColor: "rgba(135,65,165,0.5)",
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value, index, values) {
                        return value.toFixed(0); // Redondea a un decimal
                      },
                    },
                  },
                },
              },
            });
          })
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error:", error));
  }
  
  // Llama a la función createACCChart para cada elemento <canvas>
  createACCChart("accargentina", "Argentina");
  createACCChart("accbrasil", "Brasil");
  createACCChart("acccolombia", "Colombia");
  createACCChart("accmexico", "Mexico");
  createACCChart("accuruguay", "Uruguay");
  

  