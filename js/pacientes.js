var bd;

function IniciarBD() {
    var solicitud = indexedDB.open("Hospital");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);


    var BtnRegistrarPaciente = document.querySelector("#btn-registro")
    BtnRegistrarPaciente.addEventListener("click", AlmacenarPaciente);

}

function MostrarError(evento) {
    alert("Error al conectar: " + evento.target.errorCode);
}

function Comenzar(evento) {
    bd = evento.target.result;
    MostrarPaciente(bd)
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
}


function AlmacenarPaciente() {
    var N = document.querySelector("#nombre-paciente").value;
    var A = document.querySelector("#apellidos-paciente").value;
    var I = document.querySelector("#identificacion-paciente").value;
    var P = document.querySelector("#peso-paciente").value;
    var E = document.querySelector("#edad-paciente").value;
    var S = document.querySelector("#seleccionar-sangre").value;
    var EN = document.querySelector("#enfermedades-paciente").value;
    var M = document.querySelector("#medicamentos-paciente").value;
    var nombreContacto = document.querySelector("#nombre-contacto").value;
    var TelefonoContacto = document.querySelector("#telefono-contacto").value;
    var relacionContacto = document.querySelector("#relacion-contacto").value;
    var direccionContacto = document.querySelector("#direccion-contacto").value;


    var transaccion = bd.transaction(["Paciente"], "readwrite");
    var almacen = transaccion.objectStore("Paciente");

    var Paciente = {
        Nombre: N,
        Apellidos: A,
        Cedula: I,
        Peso: P,
        Edad: E,
        TipoSangre: S,
        Enfermedades: EN,
        Medicamentos: M,
        ContactoEmergencia: {
            Nombre: nombreContacto,
            Telefono: TelefonoContacto,
            Relacion: relacionContacto,
            Direccion: direccionContacto
        }
    }

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

function limpiarCampos() {
     document.querySelector("#nombre-paciente").value="";
     document.querySelector("#apellidos-paciente").value="";
     document.querySelector("#identificacion-paciente").value="";
     document.querySelector("#peso-paciente").value="";
     document.querySelector("#edad-paciente").value="";
     document.querySelector("#seleccionar-sangre").value="";
     document.querySelector("#enfermedades-paciente").value="";
     document.querySelector("#medicamentos-paciente").value="";
}

window.addEventListener("load", IniciarBD);