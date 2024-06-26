let clientes = JSON.parse(localStorage.getItem("clientes"));
let productos = JSON.parse(localStorage.getItem("productos"));
let ventas = JSON.parse(localStorage.getItem("ventas"));
let compras = JSON.parse(localStorage.getItem("compras"));
let listaVendidos = null;

cargarPaneles();
cargarListaProductosVendidos();
cargarGrafico();

function cargarPaneles(){
    if(clientes != null && clientes.length > 0)
        document.getElementById("numeroClientes").innerHTML = `<b>${clientes.length}</b>`;
    else{
        document.getElementById("numeroClientes").innerHTML = `<b>0</b>`
    }
    if(productos != null && productos.length > 0)
        document.getElementById("numeroProductos").innerHTML = `<b>${productos.length}</b>`;
    else{
        document.getElementById("numeroProductos").innerHTML = `<b>0</b>`;
    }
    if(ventas != null && ventas.length > 0)
        document.getElementById("numeroVentas").innerHTML = `<b>${ventas.length}</b>`;
    else{
        document.getElementById("numeroVentas").innerHTML = `<b>0</b>`;
    }
    if(compras != null && compras.length > 0)
        document.getElementById("numeroCompras").innerHTML = `<b>${compras.length}</b>`; 
    else{
        document.getElementById("numeroCompras").innerHTML = `<b>0</b>`;
    }
}

function cargarListaProductosVendidos(){
    cargarProductos();
    ordenarLista();
    let texto = `<ul class="list-group">
    <li
    class="list-group-item list-group-item-danger-subtle  align-items-center text-danger text-center border-0"
    >
    <i class="fas fa-shopping-cart me-2 fs-3"></i>
    <span class="h4">Productos mas vendidos</span>
    </li>`;
    if(listaVendidos != null && listaVendidos.length > 0){
        for(let i=0; i<3 && i<listaVendidos.length; i++){
            texto += `<li
            class="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
            >
            ${listaVendidos[i].nombre}
            <span class="badge text-bg-danger rounded-pill">${listaVendidos[i].cantidad}</span>
            </li>`;
        }
    }
    
    texto += `</ul>`;
    document.getElementById("productosMasVendidos").innerHTML = `${texto}`;

}

function cargarProductos(){
    let producto = null;
    let indice = -1;
    ventas.forEach(venta => {
        venta.productos.forEach(productoV =>{
            indice = indexProductoVendido(productoV.producto.id); 
            if(indice > -1){
                listaVendidos[indice].cantidad += productoV.cantidad;
            }
            else{
                producto = {
                    id: productoV.producto.id,
                    nombre: productoV.producto.nombre,
                    cantidad: productoV.cantidad
                }
                if(listaVendidos == null)
                    listaVendidos = [];  
                listaVendidos.push(producto);
            }
        });
    });
    
}

function indexProductoVendido(id_producto){
    if(listaVendidos != null && listaVendidos.length > 0){
        for(let i=0; i<listaVendidos.length; i++){
            if(listaVendidos[i].id == id_producto){
                return i;
            }
        }
    }
    return -1;
}

function ordenarLista(){
    let productos_aux = [];
    let cantidad_mayor = 0;
    let indice_mayor=0;
    while(listaVendidos.length>0){
        indice_mayor=0;
        cantidad_mayor = 0;
        for(let i=0; i<listaVendidos.length; i++){
            
            if(listaVendidos[i].cantidad>cantidad_mayor){
                cantidad_mayor = listaVendidos[i].cantidad;
                indice_mayor = i;
            }
        }
        productos_aux.push(listaVendidos[indice_mayor]);
        listaVendidos.splice(indice_mayor,1);
    }

    listaVendidos = productos_aux;
}

function generarColor(){
    const red = Math.floor(Math.random()*256);
    const green = Math.floor(Math.random()*256);
    const blue = Math.floor(Math.random()*256);

    return `rgb(${red},${green},${blue})`;
}

function cargarGrafico(){
    let nombres = [];
    let cantidades =[];
    let colores = [];

    listaVendidos.forEach(producto=>{
        nombres.push(producto.nombre);
        cantidades.push(producto.cantidad);
        colores.push(generarColor());
    })

    const ctx = document.getElementById("chart").getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: nombres,
          datasets: [{
            label: 'food Items',
            backgroundColor: colores,
            borderColor: 'rgb(47, 128, 237)',
            data: cantidades,
          }]
        },
      });
}



