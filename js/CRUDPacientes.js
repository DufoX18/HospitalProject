function MostrarPaciente(bd) {
    const transaction = bd.transaction(["Paciente"], "readwrite");
    const store = transaction.objectStore("Paciente");
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
                    <td><input type="number" class="form-control" data-edad="${cursor.value.Cedula}" value="${cursor.value.Edad}"></td>
                    <td>${cursor.value.TipoSangre}</td>
                    <td><input type="text" class="form-control" data-enfermedades="${cursor.value.Cedula}" value="${cursor.value.Enfermedades}"></td>
                    <td><input type="text" class="form-control" data-medicamentos="${cursor.value.Cedula}" value="${cursor.value.Medicamentos}"></td>
                    <td><a href="#" onclick="MostrarContactoEmergencia('${cursor.value.ContactoEmergencia.Nombre}','${cursor.value.ContactoEmergencia.Telefono}', '${cursor.value.ContactoEmergencia.Relacion}', '${cursor.value.ContactoEmergencia.Direccion}')" class="btn btn-dark contacto-emergencia-link">Contacto</a></td>
                    <td><button onclick="ActualizarPaciente('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-arrow-clockwise"></i></button></td>
                    <td><button onclick="EliminarPaciente('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-trash"></i></button></td> 
                `;
            document.querySelector("#TablaPaciente").tBodies[0].appendChild(tr);
            cursor.continue();
        }
    };
}

function MostrarContactoEmergencia(nombre, telefono, relacion, direccion) {
    const modal = document.getElementById("contactoEmergenciaModal");
    modal.querySelector(".modal-body").innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Telefono :</strong> ${telefono}</p>
        <p><strong>Relación:</strong> ${relacion}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
    `;
    $('#contactoEmergenciaModal').modal('show');
}



function ActualizarPaciente(cedula) {
    const nuevoPeso = document.querySelector(`input[data-peso="${cedula}"]`).value;
    const nuevaEdad = document.querySelector(`input[data-edad="${cedula}"]`).value;
    const nuevosMedicamentos = document.querySelector(`input[data-medicamentos="${cedula}"]`).value;
    const nuevasEnfermedades = document.querySelector(`input[data-enfermedades="${cedula}"]`).value;

    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Paciente"], "readwrite");
        const store = transaction.objectStore("Paciente");

        const getRequest = store.get(cedula);

        getRequest.onsuccess = function (event) {
            const paciente = event.target.result;
            paciente.Peso = nuevoPeso;
            paciente.Edad = nuevaEdad;
            paciente.Medicamentos = nuevosMedicamentos;
            paciente.Enfermedades = nuevasEnfermedades;

            const updateRequest = store.put(paciente);

            updateRequest.onsuccess = function (event) {
                alert("Paciente actualizado correctamente");
                refreshpage();
            };

            updateRequest.onerror = function (event) {
                alert("Error al actualizar el paciente");
            };
        };

        getRequest.onerror = function (event) {
            console.error("Error al obtener el paciente:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}


function EliminarPaciente(cedula) {
    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Paciente"], "readwrite");
        const store = transaction.objectStore("Paciente");
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