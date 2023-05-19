<template>
  <div id="app">
    <section  class="templateLogin">
      <div>
        <img src="../assets/wallet.png" alt="wallet logo" class="logoWallet" />
        <h1>@MyBitWallet</h1>

        <form>
          <label>Ingrese Id Usuario</label>
          <br>
          <input id="idUsuario" type="text" placeholder="Ingrese ID alfanumérico"/>
          <button id="idBotonLogin" type="submit" @click="validarIdUsuario()">Ingresar</button>
          
        </form>
      </div>
      
      <p v-if="errorLoginUsuario">El ID es incorrecto</p>
    </section>
  </div>

</template>


<script>
  export default{
    data(){
      return{
        errorLoginUsuario: false,
      }
    },
    methods:{
      validarIdUsuario(){
        let idUsuario = document.getElementById('idUsuario').value;
        
        //validar idUsuario alfanúmerico y longitud id
        var caracteres = /^[a-zA-Z0-9]+$/;

        if (idUsuario.length < 10 || idUsuario.length > 10) {
          alert("Inconsistencia, verifique usuario");
          return;
        }
    
        var valido = caracteres.test(idUsuario.value);
        if (!valido){
          alert('No es alfanumérico');
          return;    
        }

        alert(valido + "; " + idUsuario);
      },
      
    }
  }

  /*
  window.onload = Iniciar;
  
  function Iniciar() {
    let idBotonLogin = document.getElementById(`idBotonLogin`);
    idBotonLogin.addEventListener(`click`, IngresarUsuario);
  }

  function IngresarUsuario(evento) {
    evento.preventDefault();

    let idUsuario = document.getElementById('idUsuario').value;
    
    validarIdUsuario(idUsuario);
    
    alert(idUsuario);
    document.getElementById('idUsuario').value = '';
  }

  //validar idUsuario alfanúmerico y longitud id
  var caracteres = /^[a-zA-Z0-9]+$/;
  function validarIdUsuario(idUsuario) {
    if (idUsuario.length < 10 || idUsuario.length > 10) {
      alert("Inconsistencia, verifique usuario");
      return;
    }
    
    var valido = caracteres.test(idUsuario.value);
    if (!valido){
      alert('No es alfanumérico');
      return;    
    }
    alert(valido);
  }
  */
</script>

<style scoped>
.templateLogin{
  background-color: none;
}

.logoWallet{
  height: 40px;
  width: 40px;
}

</style>