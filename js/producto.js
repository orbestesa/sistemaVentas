let lista_productos = JSON.parse(localStorage.getItem('productos'));
limpiarRegistro();

function volverListaProductos(){
    localStorage.setItem('productos',JSON.stringify(lista_productos));
    window.location.href = 'productos-lista.html';
}

function guardarProducto(){
    let nombre = document.getElementById("nombre").value;
    let codigo = document.getElementById("codigo").value;
    let precio_venta = parseInt(document.getElementById("precio_venta").value);
    let precio_compra = parseInt(document.getElementById("precio_compra").value);
    let marca = document.getElementById("marca").value;
    let categoria = document.getElementById("categoria").value;
    let unidad = document.getElementById("unidad_medida").value;
    if(nombre != "" && codigo != "" && marca!= "" && categoria!="" && unidad != "" && !isNaN(precio_venta) && !isNaN(precio_compra)){
        if(precio_venta >= precio_compra){
        let producto = {
            id:lista_productos==null?1:lista_productos[lista_productos.length-1].id +1,
            nombre: nombre,
            codigo: codigo,
            precio_venta: precio_venta,
            precio_compra: precio_compra,
            marca: marca,
            categoria: categoria,
            unidad: unidad,
            estado: document.getElementById("estado").checked
        }
        if(lista_productos == null)
                lista_productos = [];
            lista_productos.push(producto);
            Swal.fire({
                icon: 'success',
                title: 'Registro correcto',
                html: `<p>El producto fue registrado en la lista de productos con exito.</p><p><b>¿Desea registrar un nuevo producto o volver a la lista de producto?</b></p>`,
                confirmButtonText: "➕ Otro producto",
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
                    volverListaProductos();
                }
            })
        }
        else{
            let tituloA = 'Error en el precio';
            let textoA = `No se puede registrar un precio de compra mayor al precio de venta. `;
            let iconoA = 'error';
            alertaConfirmacion(tituloA,textoA,iconoA);
        }            
    }
    else{
        let tituloA = 'Error de registro';
        let textoA = `No se puede registrar un nuevo producto sin: `;
        let iconoA = 'warning';
        textoA += (nombre == "")?'un nombre': (codigo == "")?'un codigo': (isNaN(precio_venta))?'un precio de venta':(isNaN(precio_compra))?'un precio de compra':(marca == "")?'una marca':(categoria == "")?'una categoria':(unidad=="")?'una unidad':"";
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function limpiarRegistro(){
    document.getElementById("nombre").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("precio_venta").value = "";
    document.getElementById("precio_compra").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("unidad_medida").value = "";
    document.getElementById("estado").checked = true;
}

 