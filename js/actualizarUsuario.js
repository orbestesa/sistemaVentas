let perfilUsuario = JSON.parse(localStorage.getItem('perfil'));
if(perfilUsuario != null)
    document.getElementById("usuario").innerHTML = `<img
    src="https://c0.klipartz.com/pngpicture/924/414/gratis-png-ilustracion-de-mujer-perfil-de-usuario-icono-de-mujer-avatar-de-chica.png"
    width="40px"
    height="40px"
    class="rounded-circle"
    alt=""
    />${perfilUsuario.usuario}`;
else
 console.log("no se encontro");