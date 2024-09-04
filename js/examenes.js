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



window.addEventListener("load", IniciarBD);