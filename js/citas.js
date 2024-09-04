var bd;

function IniciarBD() {

    var solicitud = indexedDB.open("Hospital");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);

    var BtnRegistrarPaciente = document.querySelector("#agendar")
    BtnRegistrarPaciente.addEventListener("click", AlmacenarCita);

}

function MostrarError(evento) {
    alert("Error al conectar: " + evento.target.errorCode);
}

function Comenzar(evento) {
    bd = evento.target.result;
    MostrarMedicos(bd);
    MostrarCita(bd);
}

function CrearAlmacen(evento) {
    var basedatos = evento.target.result;

    var almacenUsuario = basedatos.createObjectStore("Usuario", { keyPath: "Cedula" });
    almacenUsuario.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenUsuario.createIndex("BuscarCedula", "Cedula", { unique: true });

    var almacenPaciente = basedatos.createObjectStore("Paciente", { keyPath: "Cedula" });
    almacenPaciente.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenPaciente.createIndex("BuscarCedula", "Cedula", { unique: true });

    var almacenCita = basedatos.createObjectStore("Cita", { keyPath: "Cedula" });
    almacenCita.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenCita.createIndex("BuscarCedula", "Cedula", { unique: true });
    almacenCita.createIndex("BuscarDia", "Dia", { unique: false });

}



function AlmacenarCita() {
    var N = document.querySelector("#nombre-cita").value;
    var A = document.querySelector("#apellidos-cita").value;
    var C = document.querySelector("#correo-cita").value;
    var I = document.querySelector("#identificacion-cita").value;
    var T = document.querySelector("#telefono-cita").value;
    var E = document.querySelector("#seleccionar-especialidad").value;
    var DOC = document.querySelector("#seleccionar-medico").value;
    var D = document.querySelector("#calendario").value;
    var H = document.querySelector("#seleccionar-hora").value;

    var transaccion = bd.transaction(["Cita"], "readwrite");
    var almacen = transaccion.objectStore("Cita");

    var Cita = {
        Nombre: N,
        Apellidos: A,
        Correo: C,
        Cedula: I,
        Telefono: T,
        Especialidad: E,
        Medico: DOC,
        Dia: D,
        Hora: H,
    };

    var solicitud = almacen.add(Cita);

    solicitud.onsuccess = function (evento) {
        console.log("Cita agregada correctamente a la base de datos");
        limpiarCampos();
        selectedDay = null;
    };

    solicitud.onerror = function (evento) {
        console.error("Error al agregar la cita a la base de datos: " + evento.target.errorCode);
    };
}
var selectMedico = document.getElementById("seleccionar-medico");

function MostrarMedicos() {
    var transaction = bd.transaction(["Usuario"], "readwrite");
    var store = transaction.objectStore("Usuario");
    var index = store.index("BuscarNombre");

    index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.Rol === "Medico") {
                var option = document.createElement("option");
                option.value = cursor.value.NombreCompleto; 
                option.textContent = cursor.value.NombreCompleto; 
                selectMedico.appendChild(option);
            }
            cursor.continue();
        }
    };
}

document.addEventListener("DOMContentLoaded", function() {
    var calendario = document.getElementById("calendario");
    var fechaActual = new Date().toISOString().split("T")[0];
    calendario.setAttribute("min", fechaActual);

    calendario.addEventListener("input", function () {
        var fechaSeleccionada = new Date(calendario.value);
        var diaSeleccionado = fechaSeleccionada.getDay();
        if (diaSeleccionado === 5 || diaSeleccionado === 6) {
            alert("No se pueden seleccionar sábados ni domingos.");
            calendario.value = '';
        }
    });
});


function limpiarCampos() {
    document.querySelector("#nombre-cita").value = "";
    document.querySelector("#apellidos-cita").value = "";
    document.querySelector("#correo-cita").value = "";
    document.querySelector("#identificacion-cita").value = "";
    document.querySelector("#telefono-cita").value = "";
    document.querySelector("#seleccionar-especialidad").value = "";
    document.querySelector("#seleccionar-medico").value = "";
    document.querySelector("#calendario").value = "";
    document.querySelector("#seleccionar-hora").value = "";
}

window.addEventListener("load", IniciarBD);