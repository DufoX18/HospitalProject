
function AlmacenarPaciente() {
    var N = document.querySelector("#nombre-paciente").value;
    var A = document.querySelector("#apellidos-paciente").value;
    var I = document.querySelector("#identificacion-paciente").value;
    var P = document.querySelector("#peso-paciente").value;
    var E = document.querySelector("#edad-paciente").value;
    var S = document.querySelector("#seleccionar-sangre").value;
    var EN = document.querySelector("#enfermedades-paciente").value;
    var M = document.querySelector("#medicamentos-paciente").value;

    var transaccion = bd.transaction(["Paciente"], "readwrite");
    var almacen = transaccion.objectStore("Paciente");

    var Paciente = {
        Nombre: N,
        Apellidos: A,
        Identificacion: I,
        Peso: P,
        Edad: E,
        TipoSangre: S,
        Enfermedades: EN,
        Medicamentos: M
    };

    var solicitud = almacen.add(Paciente);

    solicitud.onsuccess = function (evento) {
        console.log("Paciente agregado correctamente a la base de datos");
        limpiarCampos();
        selectedDay = null;
    };

    solicitud.onerror = function (evento) {
        console.error("Error al agregar el paciente a la base de datos: " + evento.target.errorCode);
    };
}

