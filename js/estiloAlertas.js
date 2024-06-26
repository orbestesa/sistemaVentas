let noButton = "#EA0808";
let siButton = "#02A241";
let backgroundAlerta = "#FCBEE4";
let okButton = "#8C0458";

function alertaConfirmacion(titulo,texto,icono){
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showConfirmButton: false,
        timer: 2500,
        confirmButtonColor: okButton,
        background: backgroundAlerta
    })
}