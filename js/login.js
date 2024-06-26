let perfilExistente = JSON.parse(localStorage.getItem('perfil'));
let perfil = {};
function limpiarRegistro(){
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function registrarUsuario(){
    if(perfilExistente == null){
        let nombre = document.getElementById("first_name").value;
        let apellido = document.getElementById("last_name").value;
        let usuario = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if(nombre != "" && apellido != "" && usuario != "" && email != "" && password != ""){
            perfil.nombre = nombre;
            perfil.apellido = apellido;
            perfil.usuario = usuario;
            perfil.email = email;
            perfil.password = password; 
            localStorage.setItem('perfil',JSON.stringify(perfil));
            let tituloA = 'Registro exitoso';
            let textoA = `Un perfil fue registrado de manera exitosa`;
            let iconoA = 'success';
            alertaConfirmacion(tituloA,textoA,iconoA);
            perfilExistente = perfil;
            perfilExistente.imagen = "";
            limpiarRegistro();
        }
        else{
            let tituloA = 'Error de registro';
            let textoA = `No se puede registrar un perfil nuevo sin: `;
            let iconoA = 'error';
            textoA += nombre==""?'un nombre':apellido==""?'un apellido':usuario==""?'un usuario':email==""?'un email':password==""?'un password':''; 
            alertaConfirmacion(tituloA,textoA,iconoA);
        }
    }
    else{
        let tituloA = 'Perfil existente';
        let textoA = `Un perfil ya esta registrado, ingrese al sistema con el email y password registrados`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);        
    }
}

function olvidastePassword(){
    if(perfilExistente != null){
        let tituloA = 'Olvidaste contraseña';
        let textoA = `Esta es tu contraseña: ${perfilExistente.password}`;
        let iconoA = 'question';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
    else{
        let tituloA = 'Perfil no existente';
        let textoA = `No existe un perfil registrado, por favor registrese primero`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}

function limpiarInicio(){
    document.getElementById("emailUser").value="";
    document.getElementById("passwordP").value="";
}

function iniciarSesion(){
    if(perfilExistente != null){
        let emailUser = document.getElementById("emailUser").value;
        let password = document.getElementById("passwordP").value;
        //console.log(password);
        if(emailUser != "" && password !=""){
            if((emailUser == perfilExistente.email || emailUser == perfilExistente.user) && password == perfilExistente.password){
                limpiarInicio();
                window.location.href = "dashboard.html";
            }
            else{
                let tituloA = 'Datos erroneos';
                let textoA = `El email, usurio o password no coinciden con los datos del perfil. Revise sus datos`;
                let iconoA = 'error';
                alertaConfirmacion(tituloA,textoA,iconoA);
            }
        }
        else{
            let tituloA = 'Error de inicio de sesion';
            let textoA = `No se puede ingresar al sistema sin:`;
            let iconoA = 'error';
            textoA += emailUser==""?'email o usuario.': password==""?'password':'';
            alertaConfirmacion(tituloA,textoA,iconoA);
        }
    }
    else{
        let tituloA = 'Perfil no existente';
        let textoA = `No existe un perfil registrado, por favor registrese primero`;
        let iconoA = 'error';
        alertaConfirmacion(tituloA,textoA,iconoA);
    }
}