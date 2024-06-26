const modal = document.getElementById("modalProveedor");
const instanciaModal = new bootstrap.Modal(modal);

let proveedores = JSON.parse(localStorage.getItem('proveedores'));
let compras = JSON.parse(localStorage.getItem('compras'));
listar();

function irFormulario(){
    window.location.href = "proveedor-formulario.html";
}

function listar(){
    let tabla = document.querySelector("#tablaProveedores tbody");
    tabla.innerHTML = "";
    let texto = "";
    if(proveedores != null && proveedores.length>0){
        proveedores.forEach((proveedor,index)=>{
            texto += `<tr>
            <td>${proveedor.id}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.apellido}</td>
            <td>${proveedor.identificacion}</td>
            <td>${proveedor.contacto}</td>
            <td><span class="badge bg-${proveedor.estado ? "success" : "danger"}">${proveedor.estado ? "Activo" : "Inactivo"}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-warning btn-sm" onclick="mostrar(${index})"><i class="fas fa-pencil-alt"></i></button>
                    <button type="button" class="btn btn-${proveedor.estado ? "danger" : "success"} btn-sm" onclick="estado(${index})">${proveedor.estado? '<i class="far fa-times-circle"></i>': '<i class="far fa-check-circle"></i>'}</button>
                </div>
            </td>
            </tr>`;
        })
    }
    else{
        texto += `<tr><td class="text-danger fs-1" colspan="5">No existen proveedores registrados</td></tr>`;
    }
    tabla.innerHTML = `${texto}`;
}

function estado(param){
    Swal.fire({
        icon: 'question',
        title: 'Cambio de estado',
        html: `<p>¿Desea cambiar el estado del proveedor "${proveedores[param].nombre +" "+proveedores[param].apellido}"?</p><p><b>Nota:</b> Considere que al cambiar el estado del proveedor, el estado de sus compras asociadas tambien sera cambiado.</p>`,
        confirmButtonText: "Si, cambiar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
        }).then((result)=>{
            if(result.isConfirmed){
                proveedores[param].estado = !proveedores[param].estado;
                if(!proveedores[param].estado)
                    cambiarEstadoComprasAsociadas(param);
                registrarProveedoresCompras();
                let tituloA = 'Cambio de estado exitoso';
                let textoA = `El estado del proveedor fue cambiado de manera exitosa.`;
                let iconoA = 'success';
                alertaConfirmacion(tituloA,textoA,iconoA);
                listar();
            }
        })
}


let parametro = null;
function mostrar(param){
    parametro = param;
    document.getElementById("nombre").value = proveedores[param].nombre;
    document.getElementById("apellido").value = proveedores[param].apellido;
    document.getElementById("identificacion").value = proveedores[param].identificacion;
    document.getElementById("contacto").value = proveedores[param].contacto;
    instanciaModal.show();
}

function editar(){
    Swal.fire({
        icon: 'question',
        title: 'Editar proveedor',
        html: `<p>¿Desea modificar los datos del proveedor "${proveedores[parametro].nombre +" "+proveedores[parametro].apellido}"?</p><p><b>Nota:</b> Considere que al modificar los datos del proveedor sus compras asociadas tambien seran modificadas.</p>`,
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
                let contacto = document.getElementById("contacto").value;
                if((nombre!="" || apellido!="")&&identificacion!=""&&contacto!=""){
                    let proveedorAntiguoIde = proveedores[parametro].identificacion; 
                    proveedores[parametro].nombre = document.getElementById("nombre").value;
                    proveedores[parametro].apellido = document.getElementById("apellido").value;
                    proveedores[parametro].identificacion = document.getElementById("identificacion").value;
                    proveedores[parametro].contacto = document.getElementById("contacto").value;
                    //modificarComprasAsociadas(proveedorAntiguoIde);
                    registrarProveedoresCompras();
                    instanciaModal.hide();
                    let tituloA = 'Edición exitosa';
                    let textoA = `Los datos del proveedor y las compras asociadas fueron modificadas de manera exitosa.`;
                    let iconoA = 'success';
                    alertaConfirmacion(tituloA,textoA,iconoA);
                    listar();
                }
                else{
                    let tituloA = 'Error de edición';
                    let textoA = `No se puede modificar los datos de proveedor sin:`;
                    let iconoA = 'error';
                    textoA += (nombre=="" || apellido=="")?'nombre o apellido':(identificacion=="")?`numero de identificación`:(contacto=="")?`número de contacto`:``;
                    alertaConfirmacion(tituloA,textoA,iconoA);
                }
            }
        })
}

/*function modificarComprasAsociadas(identificacionA){
    if(compras != null && compras.length>0){
        compras.forEach((compra,index)=>{
            if(compra.proveedor.identificacion == identificacionA){
                compras[index].proveedor = proveedores[parametro];
            }
        })
    }
}*/

function cambiarEstadoComprasAsociadas(param){
    let proveedor = proveedores[param];
    if(compras != null && compras.length>0){
        compras.forEach((compra,index)=>{
            if((compra.id_proveedor==proveedor.id) && compras[index].estado){
                compras[index].estado = false;
            }
        })
    }
}

function registrarProveedoresCompras(){
    localStorage.setItem('proveedores',JSON.stringify(proveedores));
    localStorage.setItem('compras',JSON.stringify(compras));
}

