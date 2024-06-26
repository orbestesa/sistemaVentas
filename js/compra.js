const modal = document.getElementById("modalCantidadProductoC");
const instanciaModal = new bootstrap.Modal(modal);

let productos = JSON.parse(localStorage.getItem("productos"));
let compras = JSON.parse(localStorage.getItem("compras"));
let stock = JSON.parse(localStorage.getItem("stock"));
let productos_carrito = JSON.parse(localStorage.getItem("carrito_compra"));
let proveedores = JSON.parse(localStorage.getItem("proveedores"));
listar();
cargarProveedores();
listaProductosCarrito();

function volverListaCompras(){
    regsitrarDatosEnStorage();
    window.location.href = 'compras-lista.html';
}

function registrarCarritoStorage(){
    localStorage.setItem('carrito_compra',JSON.stringify(productos_carrito));
}

function regsitrarDatosEnStorage(){
    localStorage.setItem('compras',JSON.stringify(compras));
    localStorage.setItem('stock',JSON.stringify(stock));
}

function listar() {
    let tabla = document.querySelector("#tablaProductos tbody");
    tabla.innerHTML = "";
    let texto = "";
    if (productos != null && productos.length > 0) {
      productos.forEach((producto, index) => {
        if(producto.estado){
            texto += `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.codigo}</td>
                <td>${producto.marca}</td>
                <td>${retornarCantidad(producto.id)}</td>
                <td>${producto.precio_compra}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary btn-sm" onclick="registrarCantidadP(${index})"><i class="fas fa-cart-plus"></i></button>
                    </div>
                </td>
            </tr>`;
            }
      });
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

function cargarProveedores(){
    let texto = `<option value="">Seleccione un proveedor...</option>`;
    if(proveedores != null && proveedores.length>0){
        proveedores.forEach((proveedor)=>{
            if(proveedor.estado){
                texto += `<option value="${proveedor.id}">${proveedor.nombre} ${proveedor.apellido}</option>`;
            }
        })
    }
    document.getElementById("proveedor").innerHTML = `${texto}`;
}
let parametro =null;
function registrarCantidadP(param){
    document.querySelector("#modalCantidadProductoC .modal-title").innerHTML = `<i class="fas fa-hashtag"></i>Cantidad de ${productos[param].nombre}`;
    parametro = param;
    instanciaModal.show();
}

function guardarCantidad(){
    let cantidad = parseInt(document.getElementById("cantidad").value);
    if(!isNaN(cantidad) && cantidad >0){
        instanciaModal.hide();
        limpiarModal();
        añadirACarrito(parametro,cantidad);
    }
    else{
        let tituloA = 'Error en el registro de cantidad';
        let textoA = `La cantidad del producto tiene que se un número valido.`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function limpiarModal(){
    document.getElementById("cantidad").value="";
}

function añadirACarrito(paramPro, cantidad){
    let index = indiceEnCarrito(productos[paramPro].id);
    if(index == -1){
        let productoC = {
            producto : productos[paramPro],
            cantidad : cantidad
        }
        if(productos_carrito == null)
            productos_carrito = [];
        productos_carrito.push(productoC);
        registrarCarritoStorage();
        listaProductosCarrito();
    }
    else{
        aumentar(index);
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
    let tabla = document.querySelector("#tablasCarrito tbody");
    tabla.innerHTML = "";
    let texto = "";
    let monto_total = 0;
    if (productos_carrito != null && productos_carrito.length > 0) {
        productos_carrito.forEach((productoC, index) => {
            texto += `<tr>
                    <td>${productoC.producto.nombre}</td>
                    <td>${productoC.producto.codigo}</td>
                    <td>${productoC.producto.marca}</td>
                    <td>
                        <div class="btn-group">
                            <div class="btn-group">
                                <button class="btn btn-success btn-sm" type="button" onclick="disminuir(${index})"><i class="fas fa-minus"></i></button>
                                <button class="btn btn-ligth btn-sm border border-success" type="button">${productoC.cantidad}</button>
                                <button class="btn btn-success btn-sm" type="button" onclick="aumentar(${index})"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        </td>
                    <td>${productoC.producto.precio_compra}</td>
                    <td>${productoC.cantidad*productoC.producto.precio_compra}</td>
                    <td>
                        <div class="btn-group">
                        <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProductoCarrito(${index})">
                        <i class="fas fa-backspace"></i>
                        </button>
                        </div>
                        
                    </td>
                </tr>`;
                monto_total += productoC.cantidad*productoC.producto.precio_compra;
        });
    }
    tabla.innerHTML = `${texto}`;
    document.getElementById("totalCompra").value = monto_total;
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

function aumentar(param){
    productos_carrito[param].cantidad++;
    registrarCarritoStorage();
    listaProductosCarrito(); 
}

function eliminarProductoCarrito(param){
    productos_carrito.splice(param,1);
    registrarCarritoStorage();
    listaProductosCarrito();
}

function guardarCompra(){
    let id_proveedor = document.getElementById("proveedor").value;
    if(id_proveedor != "" && (productos_carrito != null && productos_carrito.length > 0)){
        //console.log(compras);
        let compra = {
            id:(compras==null || compras.length==0)?1:compras[compras.length-1].id +1,
            id_proveedor: id_proveedor,
            productos: productos_carrito,
            estado: true
            }

        if(compras == null)
            compras = [];
        compras.push(compra);
        modificarStock();
        productos_carrito = null;
        regsitrarDatosEnStorage();
        registrarCarritoStorage();
        listar();
        
        Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            html: `<p>La compra fue registrada en la lista de compras con exito.</p><p><b>¿Desea registrar una nueva compra o volver a la lista de compras?</b></p>`,
            confirmButtonText: "➕ Otra compra",
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
                    volverListaCompras();
                }
            })            
    }
    else{
        let tituloA = 'Error de registro';
        let textoA = `No se puede registrar una nueva compra sin: `;
        let iconoA = 'warning';
        textoA += (id_proveedor == "")?'un proveedor seleccionado': (productos_carrito == null || productos_carrito.length == 0)?'por lo menos un producto registrado':"";
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function modificarStock(){
    let productoEncontrado = false;
    productos_carrito.forEach((productoC)=>{
        if(stock != null && stock.length>0){
            for(let i=0; i<stock.length; i++){
                if(productoC.producto.id == stock[i].id){
                    stock[i].cantidad += productoC.cantidad;
                    i = stock.length;
                    productoEncontrado = true;
                }
            }
            if(!productoEncontrado)
                cargarProductoStock(productoC);
        }
        else{
            cargarProductoStock(productoC);
        }
    });
}

function cargarProductoStock(productoC){
    let producto = {
        id: productoC.producto.id,
        cantidad: productoC.cantidad
    };
    if(stock == null)
        stock = [];
    stock.push(producto);
}

function limpiarRegistro(){
    document.getElementById("proveedor").value = "";
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
