
function MostrarDatos(bd) {
    const transaction = bd.transaction(["Usuario"], "readwrite");
    const store = transaction.objectStore("Usuario");
    const request = store.openCursor();
    
    request.onsuccess = function (evento) {
        const cursor = evento.target.result;
        if (cursor) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cursor.value.NombreCompleto}</td>
                <td>${cursor.value.Telefono}</td>
                <td>${cursor.value.Cedula}</td>
                <td>
                    <select onChange="CambiarRol(this)" data-id="${cursor.value.Cedula}">
                        ${cursor.value.Rol === "Publico" ? `<option selected>Publico</option>` : `<option>Publico</option>`}
                        ${cursor.value.Rol === "Administrador" ? `<option selected>Administrador</option>` : `<option>Administrador</option>`}
                        ${cursor.value.Rol === "Medico" ? `<option selected>Medico</option>` : `<option>Medico</option>`}
                        ${cursor.value.Rol === "Recepcionista" ? `<option selected>Recepcionista</option>` : `<option>Recepcionista</option>`}
                    </select>
                </td>
                <td><button onclick="ActualizarRol('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-arrow-clockwise"></i></button></td>
                <td><button onclick="EliminarUsuario('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-trash"></i></button></td> 
            `;
            document.querySelector("#TablaUsuario").tBodies[0].appendChild(tr);
            cursor.continue();
        }
    };
}

request.onerror = function (evento) {
    console.error("Error al abrir el cursor:", evento.target.error);
};

function ActualizarRol(cedula) {
    const nuevoRol = document.querySelector(`select[data-id="${cedula}"]`).value;

    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuario"], "readwrite");
        const store = transaction.objectStore("Usuario");
        const getRequest = store.get(cedula);

        getRequest.onsuccess = function (event) {
            const usuario = event.target.result;
            usuario.Rol = nuevoRol;
            const updateRequest = store.put(usuario);

            updateRequest.onsuccess = function (event) {
                alert("Rol actualizado correctamente");
                refreshpage();
            };
            updateRequest.onerror = function (event) {
                alert("Error al actualizar el rol del usuario");
            };
        };
        getRequest.onerror = function (event) {
            console.error("Error al obtener el usuario");
        };
    };
    request.onerror = function (event) {
        console.error("Error al abrir la base de datos");
    };
}

function EliminarUsuario(cedula) {
    const request = indexedDB.open('Hospital');

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuario"], "readwrite");
        const store = transaction.objectStore("Usuario");
        const deleteRequest = store.delete(cedula);

        deleteRequest.onsuccess = function (event) {
            console.log("Usuario eliminado correctamente");
            refreshpage();
        };
        deleteRequest.onerror = function (event) {
            console.error("Error al eliminar el usuario");
        };
    };
    request.onerror = function (event) {
        console.error("Error al abrir la base de datos");
    };
}

function refreshpage (){
    window.location.reload();
}
