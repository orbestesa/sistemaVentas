const modal = document.getElementById("modalVenta");
const instanciaModal = new bootstrap.Modal(modal);

let ventas = JSON.parse(localStorage.getItem("ventas"));
let stock = JSON.parse(localStorage.getItem("stock"));
let clientes = JSON.parse(localStorage.getItem("clientes"));
let cliente = null;
listar();

function irFormulario() {
  window.location.href = "venta-formulario.html";
}

function listar() {
  let tabla = document.querySelector("#tablaVentas tbody");
  tabla.innerHTML = "";
  let texto = "";
  let cliente = null;
  let total_item = 0;
  if (ventas != null && ventas.length > 0) {
    ventas.forEach((venta, index) => {
        cliente = clientes[obtenerIndexCliente(venta.id_cliente)];
        
        total_item = obtenerSubTotal(index);
      texto += `<tr>
            <td>${venta.id}</td>
            <td>${cliente.nombre + " " + cliente.apellido}</td>
            <td>${cliente.identificacion}</td>
            <td>${total_item}</td>
            <td><span class="badge bg-${
              venta.estado ? "success" : "danger"
            }">${venta.estado ? "Activo" : "Inactivo"}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="ver(${index})"><i class="far fa-eye"></i></button>
                    <button type="button" class="btn btn-${
                      venta.estado ? "danger" : "success"
                    } btn-sm" onclick="estado(${index})">${venta.estado ? '<i class="far fa-times-circle"></i>' : '<i class="far fa-check-circle"></i>'}</button>
                    <button type="button" class="btn btn-secondary btn-sm ${venta.estado?'d-none':''}" onclick="eliminar(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>`;
    });
  } else {
    texto += `<tr><td class="text-danger fs-1" colspan="5">No existen ventas registradas</td></tr>`;
  }
  tabla.innerHTML = `${texto}`;
}


function obtenerIndexCliente(id_cliente){
    for(let i=0; i<clientes.length; i++)
    {
        if(clientes[i].id == id_cliente){
            return i;
        }
    }
    return null;
}

function obtenerSubTotal(param){
    let total = 0;
    ventas[param].productos.forEach((productoV)=>{
        total += productoV.producto.precio_venta * productoV.cantidad;
    })
    return total;
}

function estado(param) {
  Swal.fire({
    icon: "question",
    title: "Cambio de estado",
    html: `<p>¿Desea cambiar el estado de la venta?</p><p><b>Nota:</b> Considere que si la venta esta en estado inactivo esta puede ser eliminada de la lista.</p>`,
    confirmButtonText: "Si, cambiar",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: siButton,
    cancelButtonColor: noButton,
    background: backgroundAlerta,
  }).then((result) => {
    if (result.isConfirmed) {
      ventas[param].estado = !ventas[param].estado;
      registrarVentas();
      let tituloA = "Cambio de estado exitoso";
      let textoA = `El estado de la venta fue cambiado de manera exitosa.`;
      let iconoA = "success";
      alertaConfirmacion(tituloA, textoA, iconoA);
      listar();
    }
  });
}

let parametro = null;
function ver(param) {
  listarVenta(param);
  instanciaModal.show();
}

function listarVenta(param){
  let tabla = document.querySelector("#tablaVentaModal tbody");
  tabla.innerHTML = "";
  let totalText = document.getElementById("totalVenta");
  totalText.innerHTML = "";
  let texto = "";
  let total_venta = 0;
  let sub_total = 0;
  ventas[param].productos.forEach((productoV, index) => {
    sub_total = productoV.producto.precio_venta * productoV.cantidad;
    total_venta += sub_total;
      texto += `<tr>
            <td>${productoV.producto.id}</td>
            <td>${productoV.producto.nombre}</td>
            <td>${productoV.producto.codigo}</td>
            <td>${productoV.producto.marca}</td>
            <td>${productoV.cantidad}</td>
            <td>${productoV.producto.precio_venta}</td>
            <td>${sub_total}</td>
        </tr>`;
    });
  tabla.innerHTML = `${texto}`;
  totalText.value = `${total_venta}`;
}

function eliminar(param){
    Swal.fire({
        icon: 'question',
        title: 'Eliminar venta?',
        html: `<p>Esta seguro de eliminar la venta?</p><p><b>Nota:</b>
         Considere que al eliminar la venta de la lista, ya no estara disponible en los registros</p>`,
        confirmButtonText: "Si, eliminar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
        }).then((result)=>{
        if(result.isConfirmed){
            aumentarStock(param);
            ventas.splice(param,1);
            let tituloA = 'Eliminación exitosa';
            let textoA = `La venta fue eliminada con exito.`;
            let iconoA = 'success';
            alertaConfirmacion(tituloA,textoA,iconoA);
            registrarVentas();
            registrarStock();
            listar();
        }
        })
        
}

function aumentarStock(param){
    ventas[param].productos.forEach((productoV)=>{
        for(let i=0; i<stock.length; i++)
       {
            if(productoV.producto.id == stock[i].id){
                stock[i].cantidad += productoV.cantidad; 
                i=stock.length;
            }
        }
    });

}

function registrarVentas(){
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

function registrarStock(){
  localStorage.setItem("stock", JSON.stringify(stock));
}

/*
Swal.fire({
icon: 'success',
title: 'Actualización correcta',
html: `<p>El password de la cuenta fue actualizado de manera correcta.</p><p><b>¿Salir de la página de perfil?</b></p>`,
confirmButtonText: "Si, salir",
showCancelButton: true,
cancelButtonText: "No, quedarme",
confirmButtonColor: siButton,
cancelButtonColor: noButton,
background: backgroundAlerta
}).then((result)=>{
if(result.isConfirmed){
window.location.href = 'dashboard.html';
}
})

let tituloA = 'Re-password error';
let textoA = `El passowrd nuevo no es igual a la repetición del password, verifique los datos.`;
let iconoA = 'warning';
alertaConfirmacion(tituloA,textoA,iconoA);
*/