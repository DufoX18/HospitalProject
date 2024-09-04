function MostrarConsulta(bd) {
    const transaction = bd.transaction(["Consulta"], "readwrite");
    const store = transaction.objectStore("Consulta");
    const request = store.openCursor();

    request.onsuccess = function (evento) {
        const cursor = evento.target.result;
        if (cursor) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                    <td>${cursor.value.Nombre}</td>
                    <td>${cursor.value.Apellidos}</td>
                    <td>${cursor.value.Cedula}</td>
                    <td><input type="text" class="form-control" data-peso="${cursor.value.Cedula}" value="${cursor.value.Peso}"></td>
                    <td><input type="text" class="form-control" data-altura="${cursor.value.Cedula}" value="${cursor.value.Altura}"></td>
                    <td><input type="text" class="form-control" data-presion="${cursor.value.Cedula}" value="${cursor.value.Presion}"></td>
                    <td>${cursor.value.Sintomas}</td>
                    <td>${cursor.value.ExamenOrina}</td>
                    <td>${cursor.value.ExamenSangre}</td>
                    <td><button onclick="ActualizarConsulta('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-arrow-clockwise"></i></button></td>
                    <td><button onclick="EliminarConsulta('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-trash"></i></button></td> 
                `;
            document.querySelector("#TablaConsulta").tBodies[0].appendChild(tr);
            cursor.continue();
        }
    };
}


function ActualizarConsulta(cedula) {
    const nuevoPeso = document.querySelector(`input[data-peso="${cedula}"]`).value;
    const nuevaAltura = document.querySelector(`input[data-altura="${cedula}"]`).value;
    const nuevaPresion = document.querySelector(`input[data-presion="${cedula}"]`).value;

    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Consulta"], "readwrite");
        const store = transaction.objectStore("Consulta");

        const getRequest = store.get(cedula);

        getRequest.onsuccess = function (event) {
            const consulta = event.target.result;
            consulta.Peso = nuevoPeso;
            consulta.Altura = nuevaAltura;
            consulta.Presion = nuevaPresion;

            const updateRequest = store.put(consulta);

            updateRequest.onsuccess = function (event) {
                alert("Consulta actualizada correctamente");
                refreshpage();
            };

            updateRequest.onerror = function (event) {
                alert("Error al actualizar la consulta");
            };
        };

        getRequest.onerror = function (event) {
            console.error("Error al obtener la consulta:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}


function EliminarConsulta(cedula) {
    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Consulta"], "readwrite");
        const store = transaction.objectStore("Consulta");
        const deleteRequest = store.delete(cedula);

        deleteRequest.onsuccess = function (event) {

            console.log("Paciente eliminado correctamente");
            refreshpage();
        };
        deleteRequest.onerror = function (event) {
            console.error("Error al eliminar el paciente");
        };
    };
    request.onerror = function (event) {
        console.error("Error al abrir la base de datos");
    };
}

function refreshpage (){
    window.location.reload();
}