const modal = document.getElementById("modalCompra");
const instanciaModal = new bootstrap.Modal(modal);

let compras = JSON.parse(localStorage.getItem("compras"));
let stock = JSON.parse(localStorage.getItem("stock"));
let proveedores = JSON.parse(localStorage.getItem("proveedores"));
let proveedor = null;
listar();

function irFormulario() {
  window.location.href = "compra-formulario.html";
}

function listar() {
  let tabla = document.querySelector("#tablaCompras tbody");
  tabla.innerHTML = "";
  let texto = "";
  let proveedor = null;
  let total_item = 0;
  if (compras != null && compras.length > 0) {
    compras.forEach((compra, index) => {
        proveedor = proveedores[obtenerIndexProveedor(compra.id_proveedor)];
        console.log(proveedor);
        total_item = obtenerSubTotal(index);
      texto += `<tr>
            <td>${compra.id}</td>
            <td>${proveedor.nombre + " " + proveedor.apellido}</td>
            <td>${proveedor.contacto}</td>
            <td>${total_item}</td>
            <td><span class="badge bg-${
              compra.estado ? "success" : "danger"
            }">${compra.estado ? "Activo" : "Inactivo"}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="ver(${index})"><i class="far fa-eye"></i></button>
                    <button type="button" class="btn btn-${
                      compra.estado ? "danger" : "success"
                    } btn-sm" onclick="estado(${index})">${compra.estado ? '<i class="far fa-times-circle"></i>' : '<i class="far fa-check-circle"></i>'}</button>
                    <button type="button" class="btn btn-secondary btn-sm ${compra.estado?'d-none':''}" onclick="eliminar(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>`;
    });
  } else {
    texto += `<tr><td class="text-danger fs-1" colspan="5">No existen compras registradas</td></tr>`;
  }
  tabla.innerHTML = `${texto}`;
}


function obtenerIndexProveedor(id_proveedor){
  console.log(id_proveedor);
  if(proveedores!=null && proveedores.length>0){
    for(let i=0; i<proveedores.length; i++)
    {
        if(proveedores[i].id == id_proveedor){
          console.log(proveedores[i].id);
            return i;
        }
        //i = proveedores.length;
    }
  }
    return -1;
}

function obtenerSubTotal(param){
    let total = 0;
    compras[param].productos.forEach((productoC)=>{
        total += productoC.producto.precio_compra * productoC.cantidad;
    })
    return total;
}

function estado(param) {
  Swal.fire({
    icon: "question",
    title: "Cambio de estado",
    html: `<p>¿Desea cambiar el estado de la compra?</p><p><b>Nota:</b> Considere que si la compra esta en estado inactivo esta puede ser eliminada de la lista.</p>`,
    confirmButtonText: "Si, cambiar",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: siButton,
    cancelButtonColor: noButton,
    background: backgroundAlerta,
  }).then((result) => {
    if (result.isConfirmed) {
      compras[param].estado = !compras[param].estado;
      registrarCompras();
      let tituloA = "Cambio de estado exitoso";
      let textoA = `El estado de la compra fue cambiado de manera exitosa.`;
      let iconoA = "success";
      alertaConfirmacion(tituloA, textoA, iconoA);
      listar();
    }
  });
}

let parametro = null;
function ver(param) {
  listarCompra(param);
  instanciaModal.show();
}

function listarCompra(param){
  let tabla = document.querySelector("#tablaCompraModal tbody");
  tabla.innerHTML = "";
  let totalText = document.getElementById("totalCompra");
  totalText.innerHTML = "";
  let texto = "";
  let total_compra = 0;
  let sub_total = 0;
  compras[param].productos.forEach((productoC, index) => {
    sub_total = productoC.producto.precio_compra * productoC.cantidad;
    total_compra += sub_total;
      texto += `<tr>
            <td>${productoC.producto.id}</td>
            <td>${productoC.producto.nombre}</td>
            <td>${productoC.producto.codigo}</td>
            <td>${productoC.producto.marca}</td>
            <td>${productoC.cantidad}</td>
            <td>${productoC.producto.precio_compra}</td>
            <td>${sub_total}</td>
        </tr>`;
    });
  tabla.innerHTML = `${texto}`;
  totalText.value = `${total_compra}`;
}

function eliminar(param){
    Swal.fire({
        icon: 'question',
        title: 'Eliminar compra?',
        html: `<p>Esta seguro de eliminar la compra?</p><p><b>Nota:</b>
         Considere que al eliminar la compra de la lista, ya no estara disponible en los registros</p>`,
        confirmButtonText: "Si, eliminar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
        }).then((result)=>{
        if(result.isConfirmed){
            disminuirStock(param);
            compras.splice(param,1);
            let tituloA = 'Eliminación exitosa';
            let textoA = `La compra fue eliminada con exito.`;
            let iconoA = 'success';
            alertaConfirmacion(tituloA,textoA,iconoA);
            registrarCompras();
            registrarStock();
            listar();
        }
        })
        
}

function disminuirStock(param){
    compras[param].productos.forEach((productoC)=>{
        for(let i=0; i<stock.length; i++)
       {
            if(productoC.producto.id == stock[i].id){
                stock[i].cantidad -= productoC.cantidad; 
                i=stock.length;
            }
        }
    });

}

function registrarCompras(){
    localStorage.setItem("compras", JSON.stringify(compras));
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