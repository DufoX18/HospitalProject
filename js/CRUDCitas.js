    function MostrarCita(bd) {
        const transaction = bd.transaction(["Cita"], "readwrite");
        const store = transaction.objectStore("Cita");
        const request = store.openCursor();

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${cursor.value.Nombre}</td>
                    <td>${cursor.value.Apellidos}</td>
                    <td>${cursor.value.Correo}</td>
                    <td>${cursor.value.Cedula}</td>
                    <td>${cursor.value.Telefono}</td>
                    <td>${cursor.value.Especialidad}</td>
                    <td>${cursor.value.Medico}</td>
                    <td>${cursor.value.Dia}</td>
                    <td>${cursor.value.Hora}</td>
                    <td><button onclick="EliminarCita('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-trash"></i></button></td>
                `;
                document.querySelector("#TablaCita").tBodies[0].appendChild(tr);
                cursor.continue();
            }
        };

        request.onerror = function(event) {
            console.error("Error al abrir el cursor:", event.target.error);
        };
    }


    function EliminarCita(cedula) {
        const request = indexedDB.open('Hospital');

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["Cita"], "readwrite");
            const store = transaction.objectStore("Cita");
            const deleteRequest = store.delete(cedula);

            deleteRequest.onsuccess = function(event) {
                console.log("Cita eliminada correctamente");
                refreshpage();
            };
            deleteRequest.onerror = function(event) {
                console.error("Error al eliminar la cita");
            };
        };
        
        request.onerror = function(event) {
            console.error("Error al abrir la base de datos");
        };
    }

    function refreshpage (){
        window.location.reload();
    }
    