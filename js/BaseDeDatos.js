var bd;

function IniciarBD() {
    var solicitud = indexedDB.open("Hospital");
    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);

    var BtnRegistro = document.querySelector("#btn-registro");
    BtnRegistro.addEventListener("click", AlmacenarUsuario);

    var BtnIniciar = document.querySelector("#btn-iniciar");
    BtnIniciar.addEventListener("click", IniciarSesion);

    var BtnRegistrarCita = document.querySelector("#btn-agendar");
    BtnRegistrarCita.addEventListener("click", AlmacenarCita);

    var BtnRegistrarPaciente = document.querySelector("#btn-registro")
    BtnRegistrarPaciente.addEventListener("click", AlmacenarPaciente);

}

function MostrarError(evento) {
    alert("Error al conectar: " + evento.target.errorCode);
}

function Comenzar(evento) {
    bd = evento.target.result;
    MostrarDatos(bd);

}


function CrearAlmacen(evento) {
    var basedatos = evento.target.result;

    var almacenUsuario = basedatos.createObjectStore("Usuario", { keyPath: "Cedula" });
    almacenUsuario.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenUsuario.createIndex("BuscarRol", "Rol", { unique: false });
    almacenUsuario.createIndex("BuscarCedula", "Cedula", { unique: true });

    var almacenPaciente = basedatos.createObjectStore("Paciente", { keyPath: "Cedula" });
    almacenPaciente.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenPaciente.createIndex("BuscarCedula", "Cedula", { unique: true });

    var almacenCita = basedatos.createObjectStore("Cita", { keyPath: "Cedula" });
    almacenCita.createIndex("BuscarNombre", "NombreCompleto", { unique: false });
    almacenCita.createIndex("BuscarCedula", "Cedula", { unique: true });

    
    var almacenUsuario = basedatos.createObjectStore("Consulta", { keyPath: "Cedula" });
    almacenUsuario.createIndex("BuscarNombre", "Nombre", { unique: false });
    almacenUsuario.createIndex("BuscarCedula", "Cedula", { unique: true });

    var almacenUsuario = basedatos.createObjectStore("Examen", { keyPath: "Cedula" });
    almacenUsuario.createIndex("BuscarNombre", "Nombre", { unique: false });
    almacenUsuario.createIndex("BuscarCedula", "Cedula", { unique: true });
}

function AlmacenarUsuario() {
    var N = document.querySelector("#nombre-registro").value;
    var T = document.querySelector("#telefono-registro").value;
    var C = document.querySelector("#cedula-registro").value;
    var P = document.querySelector("#contraseña-registro").value;
    var Rol = "Publico";

    var transaccion = bd.transaction(["Usuario"], "readwrite");
    var almacen = transaccion.objectStore("Usuario");

    var usuario = {
        NombreCompleto: N,
        Telefono: T,
        Cedula: C,
        Contrasena: P,
        Rol: Rol
    };

    var solicitud = almacen.add(usuario);

    solicitud.onsuccess = function (evento) {
        console.log("Usuario agregado a la base de datos correctamente.");
        limpiarCampos();

    };

    solicitud.onerror = function (evento) {
        console.error("Error al agregar el usuario a la base de datos: " + evento.target.errorCode);
    };
}

function IniciarSesion() {
    var C = document.querySelector("#cedula-iniciar").value;
    var P = document.querySelector("#contraseña-iniciar").value;

    var transaccion = bd.transaction(["Usuario"], "readwrite");
    var almacen = transaccion.objectStore("Usuario");
    var solicitud = almacen.get(C);

    solicitud.onsuccess = function (evento) {
        var usuario = evento.target.result;
        if (usuario && usuario.Contrasena === P) {
            console.log("Inicio de sesión exitoso para: " + usuario.NombreCompleto);
            redirigirSegunRol(usuario.Rol);
        } else {
            alert("Cédula o contraseña incorrecta. Por favor, inténtalo de nuevo.");
        }
    };

    solicitud.onerror = function (evento) {
        console.error("Error al iniciar sesión: " + evento.target.errorCode);
    };
}

function redirigirSegunRol(rol) {
    switch (rol) {
        case "Publico":
            window.location.href = "publico.html";
            break;
        case "Medico":
            window.location.href = "medico.html";
            break;
        case "Administrador":
            window.location.href = "administrador.html";
            break;
        case "Recepcionista":
            window.location.href = "recepcionista.html";
            break;
        default:
            alert("Rol no reconocido.");
    }
}

function limpiarCampos() {
    document.querySelector("#nombre-registro").value = "";
    document.querySelector("#telefono-registro").value = "";
    document.querySelector("#cedula-registro").value = "";
    document.querySelector("#contraseña-registro").value = "";
}

window.addEventListener("load", IniciarBD);
