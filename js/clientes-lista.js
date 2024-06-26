const modal = document.getElementById("modalCliente");
const instanciaModal = new bootstrap.Modal(modal);

//let clientes = JSON.parse(localStorage.getItem("clientes"));
//console.log(clientes);

let clientes = JSON.parse(localStorage.getItem('clientes'));
let ventas = JSON.parse(localStorage.getItem('ventas'));
listar();

function irFormulario(){
    window.location.href = "cliente-formulario.html";
}

function listar(){
    let tabla = document.querySelector("#tablaClientes tbody");
    tabla.innerHTML = "";
    let texto = "";
    if(clientes != null && clientes.length>0){
        clientes.forEach((cliente,index)=>{
            texto += `<tr>
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.identificacion}</td>
            <td><span class="badge bg-${cliente.estado ? "success" : "danger"}">${cliente.estado ? "Activo" : "Inactivo"}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="mostrar(${index})"><i class="fas fa-pencil-alt"></i></button>
                    <button type="button" class="btn btn-${cliente.estado ? "danger" : "success"} btn-sm" onclick="estado(${index})">${cliente.estado? '<i class="far fa-times-circle"></i>': '<i class="far fa-check-circle"></i>'}</button>
                </div>
            </td>
        </tr>`;
        })
    }
    else{
        texto += `<tr><td class="text-danger fs-1" colspan="5">No existen clientes registrados</td></tr>`;
    }
    tabla.innerHTML = `${texto}`;
}

function estado(param){
    Swal.fire({
        icon: 'question',
        title: 'Cambio de estado',
        html: `<p>¿Desea cambiar el estado del cliente "${clientes[param].nombre +" "+clientes[param].apellido}"?</p><p><b>Nota:</b> Considere que al cambiar el estado del cliente, el estado de sus ventas asociadas tambien sera cambiado.</p>`,
        confirmButtonText: "Si, cambiar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
        }).then((result)=>{
            if(result.isConfirmed){
                clientes[param].estado = !clientes[param].estado;
                if(!clientes[param].estado)
                    cambiarEstadoVentasAsociadas(param);
                registrarClientesVentas();
                let tituloA = 'Cambio de estado exitoso';
                let textoA = `El estado del cliente fue cambiado de manera exitosa.`;
                let iconoA = 'success';
                alertaConfirmacion(tituloA,textoA,iconoA);
                listar();
            }
        })
}

let parametro = null;
function mostrar(param){
    parametro = param;
    document.getElementById("nombre").value = clientes[param].nombre;
    document.getElementById("apellido").value = clientes[param].apellido;
    document.getElementById("identificacion").value = clientes[param].identificacion;
    instanciaModal.show();
}

function editar(){
    Swal.fire({
        icon: 'question',
        title: 'Editar cliente',
        html: `<p>¿Desea modificar los datos del cliente "${clientes[parametro].nombre +" "+clientes[parametro].apellido}"?</p><p><b>Nota:</b> Considere que al modificar los datos del cliente sus ventas asociadas tambien seran modificadas.</p>`,
        confirmButtonText: "Si, modificar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
        }).then((result)=>{
            if(result.isConfirmed){
                let nombre = document.getElementById("nombre").value;
                let apellido = document.getElementById("apellido").value;
                let identificacion = document.getElementById("identificacion").value;
                if((nombre!="" || apellido!="")&&identificacion!=""){
                    let clienteAntiguoIde = clientes[parametro].identificacion; 
                    clientes[parametro].nombre = document.getElementById("nombre").value;
                    clientes[parametro].apellido = document.getElementById("apellido").value;
                    clientes[parametro].identificacion = document.getElementById("identificacion").value;
                    //modificarVentasAsociadas(clienteAntiguoIde);
                    registrarClientesVentas();
                    instanciaModal.hide();
                    let tituloA = 'Edición exitosa';
                    let textoA = `Los datos del cliente y las ventas asociadas fueron modificadas de manera exitosa.`;
                    let iconoA = 'success';
                    alertaConfirmacion(tituloA,textoA,iconoA);
                    listar();
                }
                else{
                    let tituloA = 'Error de edición';
                    let textoA = `No se puede modificar los datos de cliente sin:`;
                    let iconoA = 'error';
                    textoA += (nombre=="" || apellido=="")?'nombre o apellido':(identificacion=="")?`identificación`:``;
                    alertaConfirmacion(tituloA,textoA,iconoA);
                }
            }
        })
}

/*function modificarVentasAsociadas(identificacionA){
    if(ventas != null && ventas.length>0){
        ventas.forEach((venta,index)=>{
            if(venta.cliente.identificacion == identificacionA){
                ventas[index].cliente = clientes[parametro];
            }
        })
    }
}*/

function cambiarEstadoVentasAsociadas(param){
    let cliente = clientes[param];
    if(ventas != null && ventas.length>0){
        ventas.forEach((venta,index)=>{
            if((venta.id_cliente==cliente.id)&&ventas[index].estado){
                ventas[index].estado = false;
            }
        })
    }
}

function registrarClientesVentas(){
    localStorage.setItem('clientes',JSON.stringify(clientes));
    localStorage.setItem('ventas',JSON.stringify(ventas));
}