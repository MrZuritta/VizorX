function createChart(canvasId, country) {
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
                  (item) => item.status.toLowerCase() === "finalizada" && item.pais.toLowerCase() === country.toLowerCase()
                ).length
            );
    
            new Chart(canvas, {
              type: "bar",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Finalizadas " + country,
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
                        return value.toFixed(0);
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
  
  // Llama a la función createChart para cada elemento <canvas>
  createChart("finalizadasargentina", "Argentina");
  createChart("finalizadasbrasil", "Brasil");
  createChart("finalizadascolombia", "Colombia");
  createChart("finalizadasmexico", "Mexico");
  createChart("finalizadasuruguay", "Uruguay");
  