var bd;

function IniciarBD() {
    var solicitud = indexedDB.open("Hospital");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);


    var BtnRegistrarPaciente = document.querySelector("#btn-consulta")
    BtnRegistrarPaciente.addEventListener("click", AlmacenarConsulta);

}

function MostrarError(evento) {
    alert("Error al conectar: " + evento.target.errorCode);
}

function Comenzar(evento) {
    bd = evento.target.result;
    MostrarConsulta(bd);
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


function AlmacenarConsulta() {
    var N = document.querySelector("#nombre-consulta").value;
    var A = document.querySelector("#apellidos-consulta").value;
    var I = document.querySelector("#identificacion-consulta").value;
    var P = document.querySelector("#peso-consulta").value;
    var AL = document.querySelector("#altura-consulta").value;
    var PRE = document.querySelector("#presion-consulta").value;
    var S = document.querySelector("#sintomas-consulta").value;
    var C = document.querySelector("#seleccionar-consulta").value;
    var C2 = document.querySelector("#seleccionar-consulta2").value;
   


    var transaccion = bd.transaction(["Consulta"], "readwrite");
    var almacen = transaccion.objectStore("Consulta");

    var Consulta = {
        Nombre: N,
        Apellidos: A,
        Cedula: I,
        Peso: P,
        Altura: AL,
        Presion: PRE,
        Sintomas: S,
        ExamenOrina: C,
        ExamenSangre: C2
    }

    var solicitud = almacen.add(Consulta);

    solicitud.onsuccess = function (evento) {
        console.log("Paciente agregado correctamente a la base de datos");
        limpiarCampos();
       
    };

    solicitud.onerror = function (evento) {
        console.error("Error al agregar el paciente a la base de datos: " + evento.target.errorCode);
    };
}

function limpiarCampos() {
    document.querySelector("#nombre-consulta").value = "";
    document.querySelector("#apellidos-consulta").value = "";
    document.querySelector("#identificacion-consulta").value = "";
    document.querySelector("#peso-consulta").value = "";
    document.querySelector("#altura-consulta").value = "";
    document.querySelector("#presion-consulta").value = "";
    document.querySelector("#sintomas-consulta").value = "";
    document.querySelector("#seleccionar-consulta").value = "";
    document.querySelector("#seleccionar-consulta2").value = "";
}

window.addEventListener("load", IniciarBD);