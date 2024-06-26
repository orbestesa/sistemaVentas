const modal = document.getElementById("modalCantidadProductoV");
const instanciaModal = new bootstrap.Modal(modal);

let productos = JSON.parse(localStorage.getItem("productos"));
let ventas = JSON.parse(localStorage.getItem("ventas"));
let stock = JSON.parse(localStorage.getItem("stock"));
let productos_carrito = JSON.parse(localStorage.getItem("carrito_venta"));
let clientes = JSON.parse(localStorage.getItem("clientes"));
listar();
cargarClientes();
listaProductosCarrito();

function volverListaVentas(){
    regsitrarDatosEnStorage();
    window.location.href = 'ventas-lista.html';
}

function registrarCarritoStorage(){
    localStorage.setItem('carrito_venta',JSON.stringify(productos_carrito));
}

function regsitrarDatosEnStorage(){
    localStorage.setItem('ventas',JSON.stringify(ventas));
    localStorage.setItem('stock',JSON.stringify(stock));
}

function listar() {
    //console.log("entro a listar")
    let tabla = document.querySelector("#tablaProductos tbody");
    tabla.innerHTML = "";
    let texto = "";
    let cantidad_producto = 0;
    let hayProductosStock = false;
    if (productos != null && productos.length > 0) {
        
      productos.forEach((producto, index) => {
        if(producto.estado){
            cantidad_producto = retornarCantidad(producto.id);
            if(cantidad_producto > 0){
                hayProductosStock = true;
                texto += `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.codigo}</td>
                <td>${producto.marca}</td>
                <td>${cantidad_producto}</td>
                <td>${producto.precio_venta}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary btn-sm" onclick="registrarCantidadP(${index})"><i class="fas fa-cart-plus"></i></button>
                    </div>
                </td>
            </tr>`;
            }
        }
      });
      if(!hayProductosStock){
        texto += `<tr><td class="text-danger fs-1" colspan="5">No existestock de los productos registrados.</td></tr>`;
      }
    } else {
      texto += `<tr><td class="text-danger fs-1" colspan="5">No existen productos registrados</td></tr>`;
    }
    tabla.innerHTML = `${texto}`;
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

function cargarClientes(){
    let texto = `<option value="">Seleccione un cliente...</option>`;
    if(clientes != null && clientes.length>0){
        clientes.forEach((cliente)=>{
            if(cliente.estado){
                texto += `<option value="${cliente.id}">${cliente.nombre} ${cliente.apellido}</option>`;
            }
        })
    }
    document.getElementById("cliente").innerHTML = `${texto}`;
}

let parametro =null;

function registrarCantidadP(param){
    document.querySelector("#modalCantidadProductoV .modal-title").innerHTML = `<i class="fas fa-hashtag"></i>Cantidad de ${productos[param].nombre}`;
    parametro = param;
    instanciaModal.show();
}

function guardarCantidad(){
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let cantidadLimite = retornarCantidad(productos[parametro].id);
    if(!isNaN(cantidad) && cantidad >0){
        if(cantidad<=cantidadLimite){
            instanciaModal.hide();
            limpiarModal();
            let indicePCV = estaEnCarrito(parametro);
            //console.log(indicePCV); 
            if(indicePCV == -1)

                anadirACarrito(parametro,cantidad);
            else{
                //let index = obtenerIndiceCarrito(productos[parametro].id);
                aumentar(indicePCV,cantidad);
            }
        }
        else{
            let tituloA = 'Cantidad error';
            let textoA = `La cantidad de venta no puede superar al stock existente, revise por favor.`;
            let iconoA = 'error';
            alertaConfirmacion(tituloA,textoA,iconoA);
        }
    }
    else{
        let tituloA = 'Error en el registro de cantidad';
        let textoA = `La cantidad del producto tiene que ser un número valido.`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function estaEnCarrito(param){
    let indice = -1;
    if(productos_carrito!= null && productos_carrito.length>0){
        for(let i=0; i<productos_carrito.length ; i++)
        {
            if(productos[param].id == productos_carrito[i].producto.id){
                //console.log("esta");
                indice = i;
                i = productos_carrito.length;
            }
        }
    }
    return indice;
}

function obtenerIndiceCarrito(productoId){
    let indice = -1;
    productos_carrito.forEach((productoV,index)=>{
        if(productoV.producto.id == productoId){
            return index;
        }
    })

    return indice;
}

function limpiarModal(){
    document.getElementById("cantidad").value="";
}

function anadirACarrito(paramPro, cantidad){
    let index = indiceEnCarrito(productos[paramPro].id);
    if(index == -1){
        let productoV = {
            producto : productos[paramPro],
            cantidad : cantidad
        }
        if(productos_carrito == null)
            productos_carrito = [];
        productos_carrito.push(productoV);
        registrarCarritoStorage();
        listaProductosCarrito();
    }
    else{
        aumentar(index,cantidad);
    }
}

/*function disminuirAStock(id_producto,cantidad){
    stock.forEach((producto,index)=>{
        if(producto.id == id_producto)
            stock[index].cantidad = 
    })
}*/

function indiceEnCarrito(productoId){
    if(productos_carrito != null && productos_carrito.length>0){
        productos_carrito.forEach((producto, index)=>{
            if(producto.id == productoId)
                return index;
        });
    }

    return -1;
}

function listaProductosCarrito(){
    let tabla = document.querySelector("#tablaCarrito tbody");
    tabla.innerHTML = "";
    let texto = "";
    let monto_total = 0;
    if (productos_carrito != null && productos_carrito.length > 0) {
        productos_carrito.forEach((productoV, index) => {
            texto += `<tr>
                    <td>${productoV.producto.nombre}</td>
                    <td>${productoV.producto.codigo}</td>
                    <td>${productoV.producto.marca}</td>
                    <td>
                        <div class="btn-group">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" type="button" onclick="disminuir(${index})"><i class="fas fa-minus"></i></button>
                                <button class="btn btn-ligth btn-sm border border-success" type="button">${productoV.cantidad}</button>
                                <button class="btn btn-success btn-sm" type="button" onclick="aumentar(${index},1)"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        </td>
                    <td>${productoV.producto.precio_venta}</td>
                    <td>${productoV.cantidad*productoV.producto.precio_venta}</td>
                    <td>
                        <div class="btn-group">
                        <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProductoCarrito(${index})">
                        <i class="fas fa-backspace"></i>
                        </button>
                        </div>
                        
                    </td>
                </tr>`;
                monto_total += productoV.cantidad*productoV.producto.precio_venta;
        });
    }
    tabla.innerHTML = `${texto}`;
    document.getElementById("totalVenta").value = monto_total;
} 

function disminuir(param){
    if(productos_carrito[param].cantidad > 1){
        productos_carrito[param].cantidad--;
        registrarCarritoStorage();
        listaProductosCarrito();
    }
    else{
        eliminarProductoCarrito(param);
    } 
}

function aumentar(param,cantidad){
    //console.log(productos_carrito[param].producto.id);
    let cantidadLimite = retornarCantidad(productos_carrito[param].producto.id);
    if(cantidadLimite > productos_carrito[param].cantidad){
        productos_carrito[param].cantidad+= cantidad;
        registrarCarritoStorage();
        listaProductosCarrito();
    } 
    else{
        let tituloA = 'Cantidad error';
        let textoA = `La cantidad de venta no puede superar al stock existente, revise por favor.`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function eliminarProductoCarrito(param){
    productos_carrito.splice(param,1);
    registrarCarritoStorage();
    listaProductosCarrito();
}

function guardarVenta(){
    let id_cliente = document.getElementById("cliente").value;
    if(id_cliente != "" && (productos_carrito != null && productos_carrito.length > 0)){
        //console.log(ventas);
        let venta = {
            id:(ventas==null || ventas.length==0)?1:ventas[ventas.length-1].id +1,
            id_cliente: id_cliente,
            productos: productos_carrito,
            estado: true
            }

        if(ventas == null)
            ventas = [];
        ventas.push(venta);
        modificarStock();
        productos_carrito = null;
        regsitrarDatosEnStorage();
        registrarCarritoStorage();
        listar();
        
        Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            html: `<p>La venta fue registrada en la lista de ventas con exito.</p><p><b>¿Desea registrar una nueva venta o volver a la lista de ventas?</b></p>`,
            confirmButtonText: "➕ Otra venta",
            showCancelButton: true,
            cancelButtonText: "📑 Volver a la lista",
            confirmButtonColor: siButton,
            cancelButtonColor: noButton,
            background: backgroundAlerta
            }).then((result)=>{
                if(result.isConfirmed){
                    limpiarRegistro();
                }
                else{
                    volverListaVentas();
                }
            })            
    }
    else{
        let tituloA = 'Error de registro';
        let textoA = `No se puede registrar una nueva venta sin: `;
        let iconoA = 'warning';
        textoA += (id_cliente == "")?'un cliente seleccionado': (productos_carrito == null || productos_carrito.length == 0)?'por lo menos un producto registrado':"";
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function modificarStock(){
    let productoEncontrado = false;
    productos_carrito.forEach((productoV)=>{
        for(let i=0; i<stock.length; i++){
            if(productoV.producto.id == stock[i].id){
                stock[i].cantidad -= productoV.cantidad;
                i = stock.length;
                productoEncontrado = true;
            }
        }

    });
}

function limpiarRegistro(){
    document.getElementById("cliente").value = "";
    listaProductosCarrito();
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
