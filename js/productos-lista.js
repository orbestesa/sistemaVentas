const modal = document.getElementById("modalProducto");
const instanciaModal = new bootstrap.Modal(modal);

let productos = JSON.parse(localStorage.getItem("productos"));
let compras = JSON.parse(localStorage.getItem("compras"));
let ventas = JSON.parse(localStorage.getItem("ventas"));
let stock = JSON.parse(localStorage.getItem("stock"));
listar();

function irFormulario() {
  window.location.href = "producto-formulario.html";
}

function retornarCantidad(idProducto){
  if(stock != null && stock.length>0){
      for(let i=0; i<stock.length; i++)
      {
          if(stock[i].id == idProducto){
              return stock[i].cantidad;
          }
      }
  }
  return 0;
}

function listar() {
  let tabla = document.querySelector("#tablaProductos tbody");
  tabla.innerHTML = "";
  let texto = "";
  if (productos != null && productos.length > 0) {
    productos.forEach((producto, index) => {
      texto += `<tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.codigo}</td>
            <td>${producto.precio_venta}</td>
            <td>${producto.precio_compra}</td>
            <td>${producto.marca}</td>
            <td>${producto.categoria}</td>
            <td>${retornarCantidad(producto.id)}</td>
            <td>${producto.unidad}</td>
            <td><span class="badge bg-${
              producto.estado ? "success" : "danger"
            }">${producto.estado ? "Activo" : "Inactivo"}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="mostrar(${index})"><i class="fas fa-pencil-alt"></i></button>
                    <button type="button" class="btn btn-${
                      producto.estado ? "danger" : "success"
                    } btn-sm" onclick="estado(${index})">${producto.estado ? '<i class="far fa-times-circle"></i>' : '<i class="far fa-check-circle"></i>'}</button>
                </div>
            </td>
        </tr>`;
    });
  } else {
    texto += `<tr><td class="text-danger fs-1" colspan="5">No existen productos registrados</td></tr>`;
  }
  tabla.innerHTML = `${texto}`;
}

function estado(param) {
  Swal.fire({
    icon: "question",
    title: "Cambio de estado",
    html: `<p>¿Desea cambiar el estado del producto"${productos[param].nombre}"?</p><p><b>Nota:</b> Considere que al cambiar el estado del producto, la lista de productos disponibles para compra y venta sera afectado.</p>`,
    confirmButtonText: "Si, cambiar",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: siButton,
    cancelButtonColor: noButton,
    background: backgroundAlerta,
  }).then((result) => {
    if (result.isConfirmed) {
      productos[param].estado = !productos[param].estado;
      registrarProductos();
      let tituloA = "Cambio de estado exitoso";
      let textoA = `El estado del producto fue cambiado de manera exitosa.`;
      let iconoA = "success";
      alertaConfirmacion(tituloA, textoA, iconoA);
      listar();
    }
  });
}

let parametro = null;
function mostrar(param) {
  parametro = param;
  document.getElementById("nombre").value = productos[param].nombre;
  document.getElementById("codigo").value = productos[param].codigo;
  document.getElementById("precio_venta").value = productos[param].precio_venta;
  document.getElementById("precio_compra").value = productos[param].precio_compra;
  document.getElementById("marca").value = productos[param].marca;
  document.getElementById("categoria").value = productos[param].categoria;
  document.getElementById("unidad_medida").value = productos[param].unidad;
  console.log(productos[param].unidad);
  instanciaModal.show();
}

function editar() {
  Swal.fire({
    icon: "question",
    title: "Editar producto",
    html: `<p>¿Desea modificar los datos del producto"${
      productos[parametro].nombre}"?</p><p><b>Nota:</b> Considere que al modificar los datos del producto, los productos en ventas y compras tambien se alterara.</p>`,
    confirmButtonText: "Si, modificar",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: siButton,
    cancelButtonColor: noButton,
    background: backgroundAlerta,
  }).then((result) => {
    if (result.isConfirmed) {
    let codigoA = productos[parametro].id; 
      let nombre = document.getElementById("nombre").value;
      let codigo = document.getElementById("codigo").value;
      let precio_venta = parseInt(document.getElementById("precio_venta").value);
      let precio_compra = parseInt(document.getElementById("precio_compra").value);
      let marca = document.getElementById("marca").value;
      let categoria = document.getElementById("categoria").value;
      let unidad = document.getElementById("unidad_medida").value;;
      if(nombre != "" && codigo != "" && marca!= "" && categoria!="" && unidad != "" && !isNaN(precio_venta) && !isNaN(precio_compra)){
            if(precio_venta >= precio_compra){
                productos[parametro].nombre = nombre;
                productos[parametro].codigo = codigo;
                productos[parametro].precio_venta = precio_venta;
                productos[parametro].precio_compra = precio_compra;
                productos[parametro].marca = marca;
                productos[parametro].categoria = categoria;
                productos[parametro].unidad = unidad;
                modificarComprasyVentasAsociadas(codigoA);
                registrarProductosComprasVentas();
                instanciaModal.hide();
                let tituloA = 'Edición exitosa';
                let textoA = `Los datos del producto, las compras y las ventas asociadas fueron modificadas de manera exitosa.`;
                let iconoA = 'success';
                alertaConfirmacion(tituloA,textoA,iconoA);
                listar();
            }
            else{
                let tituloA = 'Error en el precio';
                let textoA = `No se puede modificar un precio de compra mayor al precio de venta. `;
                let iconoA = 'error';
                alertaConfirmacion(tituloA,textoA,iconoA);
            }            
        }
        else{
            let tituloA = 'Error de edición';
            let textoA = `No se puede modificar los datos del producto sin: `;
            let iconoA = 'warning';
            textoA += (nombre == "")?'un nombre': (codigo == "")?'un codigo': (isNaN(precio_venta))?'un precio de venta':(isNaN(precio_compra))?'un precio de compra':(marca == "")?'una marca':(categoria == "")?'una categoria':(unidad=="")?'una unidad':"";
            alertaConfirmacion(tituloA,textoA,iconoA);
        }
    }
  });
}

function modificarComprasyVentasAsociadas(productoId){
    let producto = productos[parametro];
  if (compras != null && compras.length > 0) {
    compras.forEach((compra, indexC) => {
        compra.productos.forEach((producto_compra,indexPC)=>{
            if (producto_compra.id == productoId) {
                compras[indexC].productos[indexPC] = producto;
              }
        })
    });
  }
  if (ventas != null && ventas.length > 0) {
    ventas.forEach((venta, indexV) => {
        venta.productos.forEach((producto_venta,indexPV)=>{
            if (producto_venta.id == productoId) {
                ventas[indexV].productos[indexPV] = producto;
              }
        })
    });
  }
}

function registrarProductos(){
    localStorage.setItem("productos", JSON.stringify(productos));
}

function registrarProductosComprasVentas(){
  registrarProductos();
  localStorage.setItem("compras", JSON.stringify(compras));
  localStorage.setItem("ventas", JSON.stringify(ventas));
}