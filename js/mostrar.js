function Mostrar() {

    var transaccion = bd.transaction(["Usuario"], "readwrite");
    var almacen = transaccion.objectStore("Usuario")

    var puntero = almacen.openCursor();
    puntero.addEventListener("success", mostrarUsuarios)

}

function mostrarUsuarios(evento) {
    var sectionContactos = document.querySelector("#section-UsuariosRegistrados")
    var div = document.createElement("div");
    var cursor = evento.target.result;
    if (cursor) {

        div.innerHTML = `
        <div class="container text-center">
  <div class="row align-items-center">
    <div class="col">
      <p>${cursor.value.NombreCompleto}</p>
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns (new)
    </div>
    <div class="col">
      One of three columns (new)
    </div>
  </div>
</div>
<br>
<hr>
        `;

       



    }
    sectionContactos.appendChild(div);
}
