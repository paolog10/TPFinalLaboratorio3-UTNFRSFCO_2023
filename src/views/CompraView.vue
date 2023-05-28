<template>
  <div>
    <nav class="barra">
      <div>
        <span>{{ darMensajeBienvenida }}</span>
      </div>
      <button @click="cerrarSesion" class="botonCerrarSesion">Cerrar sesión</button>
    </nav>
  </div>

  <hr>
  
  
  <div>
    <h2>Panel de Criptomonedas</h2>
    <button @click="obtenerPrecios()" class="botonCerrarSesion">Obtener Precios hoy</button>
    
    <div class="tabla">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Precio de compra $ARS</th>
            <th>Precio de venta $ARS</th>
          </tr>
        </thead>
        <tbody>
          <!--<tr v-for="(icono, index) in iconosCriptomonedas" :key="index">
            <td><img :src="icono" alt="Logo Criptomoneda" style="height: 40px; width: 40px;"></td>
            <td>{{ preciosCriptomonedas[index] }}</td>
          </tr>-->
          <tr v-for="(criptoMoneda, index) in criptoMonedas" :key="index">
            <!--<td><img v-for="(icono, id) in iconosCriptomonedas" :key="id" :src="icono"></td>-->
            <td><img :src="iconosCriptomonedas[index]" alt=""></td> <!--bindeo la imagen en la posicion index-->
            <td>{{ criptoMoneda.ask }}</td>
            <td>{{ criptoMoneda.bid }}</td>
          </tr>
        </tbody>
      </table>

    </div>
    
  </div>

  <hr>
  
  <h3>Formulario de compra</h3>
  <div class="formularioCompra">
    <form @submit.prevent="validarCompra">
      <div>
        <label>Cantidad:</label>
        <input type="text" id="cantidad" v-model.number="cantidadCompraCriptomoneda" required>
      </div>

      <div>
        <label>Criptomoneda:</label>
        <select id="criptomoneda" required v-model="criptomoneda">
          <option disabled selected>Selecciona criptomoneda</option>
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="usdt">USDT</option>
          <option value="dai">Dai</option>
        </select>
      </div>

      <button type="submit" class="botonCompra">Comprar</button>
      <p v-if="compraExitosa" class="exito">Compra con éxito.</p>
    </form>

    <!--<p v-if="numeroValido">Número decimal válido: {{ numeroDecimal }}</p>-->
    <p v-show="numeroValido" class="notaAlPie">Error, verifique! Si desea comprar porción de criptomoneda utilice Ej: 10.05</p>
  </div>

  <hr>
  
  <h3>Historial de compras por criptomoneda</h3>
  <div v-for="(compra, id) in compras" :key="id" class="compra-box">
    <h3>Detalles de la compra:</h3>
    <p><strong>Criptomoneda:</strong> {{ compra.crypto_code }}</p>
    <p><strong>Cantidad:</strong> {{ compra.crypto_amount }}</p>
    <p><strong>Precio $ARS:</strong> {{ compra.money }}</p>
    <p><strong>Fecha y hora:</strong> {{ compra.datetime }}</p>
  </div>
  <button @click="obtenerCompras">Mirá el historial</button>

  <hr>

</template>


<script>
  //import axios from 'axios';
  import criptoYaConnectionService from '../services/criptoYaConnectionService';
  import utnConnectionService from '../services/utnConnectionService';

  export default {
    data() {
      return {
        clienteId: localStorage.getItem('idUsuario'), //inicializo el idUsuario del localStorage
        criptoMonedas: [],
        iconosCriptomonedas: [
          "https://argenbtc.com/img/iconos/f_bitcoin.svg",
          "https://argenbtc.com/img/iconos/f_ethereum.svg",
          "https://argenbtc.com/img/iconos/f_tether.svg",
          "https://argenbtc.com/img/iconos/f_dai.svg",
        ],
        endpointsPrecios: [
          "/btc/ars/1", 
          "/eth/ars/1",
          "/usdt/ars/1", 
          "/dai/ars/1"
        ],
        criptomoneda: "",
        cantidadCompraCriptomoneda: '',
        compraExitosa: false,
        numeroValido: false,
        cantidadCompraCriptomonedaDecimal: null,
        compras: [],
        historial: [],
        preciosCriptomonedas: [],
      };
    },
    
    computed:{
      darMensajeBienvenida(){
        //console.log(this.clienteId)
        return `Bienvenido ${this.clienteId}!!!`
      },

    },

    //Si descomento esto me tira una tabla con las criptos y sus precios
    /*
    mounted() {
      this.obtenerPrecios()
        .then(precios => {
          // Asigna los precios obtenidos a una propiedad en los datos de Vue
          this.preciosCriptomonedas = precios;
        });
    },*/
    
    methods: {
      cerrarSesion() {
        // redirigir al usuario a la página de inicio de sesión
        alert('Cerrando sesión...');
      },

      async obtenerPrecios() {
        try {
          const precios = [];

          for (const endpoint of this.endpointsPrecios) {
            let response = await criptoYaConnectionService.get(endpoint);
            //precios.push(response.data.ask);
            this.criptoMonedas.push(response.data) 
          }

          return precios;
        } catch (error) {
          console.error('Error al obtener los precios de las criptomonedas:', error);
          return [];
        }
      },

      validarCompra(){
        if (/^\d*\.?\d+$/.test(this.cantidadCompraCriptomoneda)) {
          // Convertir el número a decimal si passa el test de convertir string en numero
          this.cantidadCompraCriptomonedaDecimal = parseFloat(this.cantidadCompraCriptomoneda); //esto lo podemos hacer en un computed property
          this.numeroValido = false;
          
          //console.log(this.cantidadCompraCriptomonedaDecimal)
          //console.log(this.numeroValido)
          this.registrarCompra()
          this.compraExitosa = true
          
        } else {
          this.numeroValido = true;
        }
      },

      async registrarCompra(){
        
        //tengo que crear un objeto con la compra
        let compraCriptomoneda = {
          user_id: this.clienteId,
          action: "purchase",
          crypto_code: this.criptomoneda,
          crypto_amount: this.cantidadCompraCriptomonedaDecimal,
          money: this.criptoMonedas[3].ask, //PROBLEMAS ACÁ, como hacer para comprar al precio correspondiente a la criptomoneda
          datetime: new Date().toISOString() //formato iso
        }

        //lo envío a la bd con la ruta y el objeto creado
        try {
          let response = await utnConnectionService.post('https://laboratorio3-f36a.restdb.io/rest/transactions', compraCriptomoneda);
          console.log(response)
        } catch (error) {
          console.error('Error al obtener los datos de la API:', error);
        }        
      },

      async obtenerCompras() {
        try {
          // Realiza GET para obtener la compra del cliente
          const response = await utnConnectionService.get(`transactions?q={"user_id":"${this.clienteId}"}`); //paolog1982
          this.compras = response.data;
          console.log(this.compras.length);
          console.log(this.compras);
        } catch (error) {
          console.error('Error al obtener la compra:', error);
        }
      },

    }
      
  }

</script>

<style scoped>
.barra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f2f2;
  padding: 10px 20px;
  font-weight: bold;
}

.botonCerrarSesion {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.tabla{
  max-width: 600px;
  margin: 0 auto;
}

table {
  font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
  font-size: 12px;
  margin: 45px;
  width: 480px;
  text-align: center;
  border-collapse: collapse;
}

th {
  font-size: 13px;
  font-weight: normal;
  padding: 8px;
  background: #4caf50;
  border-top: 4px solid #77b87f;
  border-bottom: 1px solid #fff;
}

td {
  padding: 8px;
  background: #e4f0df;
  border-bottom: 1px solid #fff;
  border-top: 1px solid transparent;
}

tr:hover td {
  background: #c8e4c3;
}

.notaAlPie{
  color: red;
  font-weight: bolder;
}

.formularioCompra {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

h3 {
  text-align: center;
}

form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="number"],
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.botonCompra {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.botonCompra:hover {
  background-color: #45a049;
}

p {
  margin-top: 20px;
  font-weight: bold;
}

.exito {
  color: green;
}

.error {
  color: red;
}

.imagen-miniatura {
  max-width: 50px;
  max-height: 50px;
}

.compra-box {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

</style>