let lista_proveedores = JSON.parse(localStorage.getItem('proveedores'));
limpiarRegistro();

function volverListaProveedores(){
    localStorage.setItem('proveedores',JSON.stringify(lista_proveedores));
    window.location.href = 'proveedores-lista.html';
}

function guardarProveedor(){
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let identificacion = document.getElementById("identificacion").value;
    let contacto = document.getElementById("contacto").value;
    if((nombre != "" || apellido != "") && identificacion!= "" && contacto != ""){
        let proveedor = {
            id:lista_proveedores==null?1:lista_proveedores[lista_proveedores.length-1].id +1,
            nombre: nombre,
            apellido: apellido,
            identificacion: identificacion,
            contacto: contacto,
            estado: document.getElementById("estado").checked
        }
        if(lista_proveedores == null)
            lista_proveedores = [];
        lista_proveedores.push(proveedor);
        Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            html: `<p>El proveedor fue registrado en la lista de proveedores con exito.</p><p><b>¿Desea registrar un nuevo proveedor o volver a la lista de proveedores?</b></p>`,
            confirmButtonText: "➕ Otro proveedor",
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
                volverListaProveedores();
            }
            })
            
    }
    else{
        let tituloA = 'Error de registro';
        let textoA = `No se puede registrar un nuevo proveedor sin: `;
        let iconoA = 'warning';
        textoA += (nombre == "" && apellido == "")?'un nombre u apellido': (identificacion == "")?'una identificación':(contacto=="")?'un contacto':'';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function limpiarRegistro(){
    document.getElementById("nombre").value="";
    document.getElementById("apellido").value="";
    document.getElementById("identificacion").value="";
    document.getElementById("contacto").value="";
    document.getElementById("estado").checked = true;
}

 