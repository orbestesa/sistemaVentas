let perfil = JSON.parse(localStorage.getItem('perfil'));
mostrarPerfil();
function mostrarPerfil(){
    if(perfil!=null){
        document.getElementById('first_name').value = perfil.nombre;
        document.getElementById('last_name').value = perfil.apellido;
        document.getElementById('username').value = perfil.usuario;
        document.getElementById('email').value = perfil.email;
        document.getElementById('imagen_perfil_url').value = perfil.imagen;
        document.getElementById('imagen_perfil').scr = perfil.imagen;
    }

}

function actualizarPerfil(){
    Swal.fire({
        icon: 'question',
        title: 'Editar datos de perfil',
        text: `Esta seguro de modificar los datos de perfil de usuario?`,
        confirmButtonText: "Si, actualizar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
    }).then((result)=>{
        if(result.isConfirmed){
            let nombre = document.getElementById('first_name').value;
            let apellido = document.getElementById('last_name').value;
            let usuario = document.getElementById('username').value;    
            let email = document.getElementById('email').value;
            let imagen = document.getElementById('imagen_perfil_url').value;
            if(nombre != "" && apellido != "" && usuario != "" && email != "" && imagen != ""){
                perfil.nombre = nombre;
                perfil.apellido = apellido;
                perfil.usuario = usuario;    
                perfil.email = email;
                perfil.imagen = imagen;
                localStorage.setItem('perfil',JSON.stringify(perfil));
                Swal.fire({
                    icon: 'success',
                    title: 'Actualización correcta',
                    html: `<p>Los datos del perfil de usuario fueron editados de manera correcta.</p><p><b>¿Salir de la página de perfil?</b></p>`,
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
            }
            else{
                let tituloA = 'Error de actualización';
                let textoA = `No se puede actualizar los datos de perfil registre los datos faltantes.`;
                let iconoA = 'error';
                alertaConfirmacion(tituloA,textoA,iconoA);
            }
        }
    })
}

function actualizarPassword(){
    Swal.fire({
        icon: 'question',
        title: 'Editar password',
        text: `Esta seguro de modificar el password del perfil de usuario?`,
        confirmButtonText: "Si, actualizar",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonColor: siButton,
        cancelButtonColor: noButton,
        background: backgroundAlerta
    }).then((result)=>{
        if(result.isConfirmed){
            let password_actual = document.getElementById('password_actual').value; 
            let password_nuevo = document.getElementById('password_nuevo').value;
            let re_password_actual = document.getElementById('repassword').value;
            if(password_actual != "" && password_nuevo != "" && re_password_actual != ""){
                if(password_actual == perfil.password){
                    if(password_actual != password_nuevo){ 
                        if(password_nuevo == re_password_actual){
                            perfil.password = password_nuevo;
                            localStorage.setItem('perfil',JSON.stringify(perfil));
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
                        }
                        else{
                            let tituloA = 'Re-password error';
                            let textoA = `El passowrd nuevo no es igual a la repetición del password, verifique los datos.`;
                            let iconoA = 'warning';
                            alertaConfirmacion(tituloA,textoA,iconoA);
                        }
                    }
                    else{
                        let tituloA = 'Password repetido';
                        let textoA = `No puede actualizar el password con un password antiguo, cambielo por favor.`;
                        let iconoA = 'warning';
                        alertaConfirmacion(tituloA,textoA,iconoA);
                    }
                }
                else{
                    let tituloA = 'Password erroneo';
                    let textoA = `El password registrado no es el password actual de lperfil. Revise sus datos por favor`;
                    let iconoA = 'error';
                    alertaConfirmacion(tituloA,textoA,iconoA);    
                }
            }
            else{
                let tituloA = 'Error de actualización';
                let textoA = `No se pudo actualizar el password de perfil, registre los datos faltantes.`;
                let iconoA = 'error';
                alertaConfirmacion(tituloA,textoA,iconoA);
            }
        }
    })
}

function ver_imagen(){
    document.getElementById("imagen_perfil").src = document.getElementById("imagen_perfil_url").value;
}

