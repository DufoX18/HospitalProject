function MostrarConsulta(bd) {
    const transaction = bd.transaction(["Consulta"], "readwrite");
    const store = transaction.objectStore("Consulta");
    const request = store.openCursor();

    request.onsuccess = function (evento) {
        const cursor = evento.target.result;
        if (cursor) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td><input type="text" class="form-control" data-nombre="${cursor.value.Cedula}" value="${cursor.value.Nombre}" readonly></td>
            <td><input type="text" class="form-control" data-apellidos="${cursor.value.Cedula}" value="${cursor.value.Apellidos}" readonly></td>
            <td><input type="text" class="form-control" data-cedula="${cursor.value.Cedula}" value="${cursor.value.Cedula}" readonly></td>
            <td><input type="text" class="form-control" data-peso="${cursor.value.Cedula}" value="${cursor.value.Peso}" readonly></td>
            <td><input type="text" class="form-control" data-altura="${cursor.value.Cedula}" value="${cursor.value.Altura}" readonly></td>
            <td><input type="text" class="form-control" data-presion="${cursor.value.Cedula}" value="${cursor.value.Presion}" readonly></td>
            <td><input type="text" class="form-control" data-sintomas="${cursor.value.Cedula}" value="${cursor.value.Sintomas}" readonly></td>
            <td>
                <select id="examenOrina-${cursor.value.Cedula}">
                    <option value="Ninguno">Ninguno</option>
                    <option value="Glucosa">Glucosa</option>
                    <option value="Eritrocitos">Eritrocitos</option>
                    <option value="Color">Color</option>
                    <option value="Leucocitos">Leucocitos</option>
                </select>
            </td>
            <td>
                <select id="examenSangre-${cursor.value.Cedula}">
                    <option value="Ninguno">Ninguno</option>
                    <option value="Hemoglobina">Hemoglobina</option>
                    <option value="Hematocrito">Hematocrito</option>
                    <option value="Trigliceridos">Trigliceridos</option>
                    <option value="Colesterol">Colesterol</option>
                    <option value="AcidoUrico">Acido Urico</option>
                    <option value="Creatinina">Creatinina</option>
                </select>
            </td>
            <td><button onclick="GuardarExamen('${cursor.value.Cedula}')" class="btn btn-dark"><i class="bi bi-save"></i></button></td>
            `;
            document.querySelector("#TablaConsulta").tBodies[0].appendChild(tr);
            cursor.continue();
        }
    };
}

function GuardarExamen(cedula) {
    const dbRequest = indexedDB.open('Hospital', 1);

   
    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["Examen"], "readwrite");
        const store = transaction.objectStore("Examen");

        const nuevaConsulta = {
            Cedula: cedula,
            Nombre: document.querySelector(`input[data-nombre="${cedula}"]`).value,
            Apellidos: document.querySelector(`input[data-apellidos="${cedula}"]`).value,
            Peso: document.querySelector(`input[data-peso="${cedula}"]`).value,
            Altura: document.querySelector(`input[data-altura="${cedula}"]`).value,
            Presion: document.querySelector(`input[data-presion="${cedula}"]`).value,
            Sintomas: document.querySelector(`input[data-sintomas="${cedula}"]`).value,
            ExamenOrina: document.getElementById(`examenOrina-${cedula}`).value,
            ExamenSangre: document.getElementById(`examenSangre-${cedula}`).value
        };

        const request = store.put(nuevaConsulta);

        request.onsuccess = function() {
            alert('Consulta guardada correctamente.');
            refreshpage();
        };

        request.onerror = function(event) {
            alert('Error al guardar la consulta:', event.target.error);
        };
    };

    dbRequest.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}

function refreshpage() {
    window.location.reload();
}