let lista_clientes = JSON.parse(localStorage.getItem('clientes'));
limpiarRegistro();

function volverListaClientes(){
    localStorage.setItem('clientes',JSON.stringify(lista_clientes));
    window.location.href = 'clientes-lista.html';
}

function guardarCliente(){
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let identificacion = document.getElementById("identificacion").value;
    if((nombre != "" || apellido != "") && identificacion!= ""){
        let cliente = {
            id:lista_clientes==null?1:lista_clientes[lista_clientes.length-1].id +1,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            identificacion: document.getElementById("identificacion").value,
            estado: document.getElementById("estado").checked
        }
        if(lista_clientes == null)
            lista_clientes = [];
        lista_clientes.push(cliente);
        Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            html: `<p>El cliente fue registrado en la lista de clientes con exito.</p><p><b>¿Desea registrar un nuevo cliente o volver a la lista de cliente?</b></p>`,
            confirmButtonText: "➕ Otro cliente",
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
                volverListaClientes();
            }
            })
            
    }
    else{
        let tituloA = 'Error de registro';
        let textoA = `No se puede registrar un nuevo cliente sin: `;
        let iconoA = 'warning';
        textoA += (nombre == "" && apellido == "")?'un nombre u apellido': (identificacion == "")?'una identificación':"";
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function limpiarRegistro(){
    document.getElementById("nombre").value="";
    document.getElementById("apellido").value="";
    document.getElementById("identificacion").value="";
    document.getElementById("estado").checked = true;
}

 