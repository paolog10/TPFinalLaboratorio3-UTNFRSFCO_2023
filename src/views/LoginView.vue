<template>
  <section  class="templateLogin">
    <div>      
      <img src="../assets/wallet.png" alt="wallet logo" class="logoWallet" />
      <h1>@MyBitWallet</h1>

      <form @submit.prevent="preventForm"> <!--preventForm forma de prevenir el comportamiento de envío predeterminado de un formulario cuando se produce un evento de envío-->
        <label>Ingrese Id Usuario (10 caracteres alfanuméricos)</label>
        <br>
        <input v-model="idUsuario" id="idUsuario" type="text"/>
        <button id="idBotonLogin" type="submit">Ingresar</button>

        <p v-if="validarIdUsuario" class="exitoValidacionIdUsuario">El ID ES CORRECTO</p>
        <p v-else class="errorValidacionIdUsuario">El ID NO ES CORRECTO</p>
      </form>
    </div>
    
    
  </section>
</template>


<script>
  export default{
    data(){
      return{
        idUsuario: null,
      }
    },

    computed: {
      validarIdUsuario() {
        const caracteresAlfanumericos = /^[a-zA-Z0-9]{10}$/;
        return caracteresAlfanumericos.test(this.idUsuario);
      },
    },

    methods:{
      preventForm() {
        //evento.preventDefault();

        if (this.validarIdUsuario) {
          alert('Inicio de sesión exitoso');

          //me dirige a la pagina de compra de moneda
          //this.$router.push({name: "CompraView"})
        } else {
          alert('Error en el ID');
        }
      },
    }
  }
</script>

<style scoped>
.templateLogin{
  background-color: none;
}

.logoWallet{
  height: 40px;
  width: 40px;
}

.errorValidacionIdUsuario {
  color: red;
  font-size: xx-large;
}

.exitoValidacionIdUsuario {
  color: green;
  font-size: xx-large;
}

</style>