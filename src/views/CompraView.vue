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
    <button @click="mostrarDatosCriptoMonedas()">datos cripto</button>
    
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
          <tr v-for="criptoMoneda in criptoMonedas" :key="criptoMoneda.id">
            <td>BTC</td>
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
        <input type="text" id="cantidad" v-model="cantidadCompraCriptomoneda" required>
      </div>

      <div>
        <label>Criptomoneda:</label>
        <select id="criptomoneda" required>
          <option value="">Selecciona criptomoneda</option>
          <option value="Bitcoin">BTC</option>
          <option value="Ethereum">ETH</option>
          <option value="Tether">USDT</option>
          <option value="Dai">DAI</option>
        </select>
      </div>

      <button type="submit" class="botonCompra">Comprar</button>
      <p v-if="compraExitosa" class="exito">Compra con éxito.</p>
    </form>

    <!--<p v-if="numeroValido">Número decimal válido: {{ numeroDecimal }}</p>-->
    <p v-show="numeroValido" class="notaAlPie">Error, verifique! Si desea comprar porción de criptomoneda utilice Ej: 10.05</p>
  </div>

  <hr>
  TODO:
  Mostrar las diferentes criptos en un cuadro con sus precios;
  Ya pude hacer una compra para una criptomoneda, ahora quiero para varias (Acordasrse SIEMPRE habilitar extension CORS);
  acá va un get que muestre la compra desde la bd

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
        cantidadCompraCriptomoneda: '',
        compraExitosa: false,
        numeroValido: false,
        cantidadCompraCriptomonedaDecimal: null,
      };
    },
    
    computed:{
      darMensajeBienvenida(){
        //console.log(this.clienteId)
        return `Bienvenido ${this.clienteId}!!!`
      }
    },
    
    methods: {
      cerrarSesion() {
        // redirigir al usuario a la página de inicio de sesión
        alert('Cerrando sesión...');
      },

      async mostrarDatosCriptoMonedas(){
        try {
          let response = await criptoYaConnectionService.get(`/btc/ars/0.1`); //endpoint argenbtc/{coin}/{fiat} /dai/ars/0.1 - /eth/ars/0.1 - /usdt/ars/0.1
          //console.log(response);
          console.log(response.data.argenbtc)
          this.criptoMonedas.push(response.data.argenbtc) 
          //let criptoMonedas = await response.json();
          //console.log(criptoMonedas);
          //this.criptoMonedas = response.data;
        } catch (error) {
          console.error('Error al obtener los datos de la API:', error);
        }
      },

      validarCompra(){
        if (/^\d*\.?\d+$/.test(this.cantidadCompraCriptomoneda)) {
          // Convertir el número a decimal si passa el test de convertir string en numero
          this.cantidadCompraCriptomonedaDecimal = parseFloat(this.cantidadCompraCriptomoneda);
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
          crypto_code: "btc",
          crypto_amount: this.cantidadCompraCriptomonedaDecimal,
          money: this.criptoMonedas[0].ask, //criptoMonedas[0].ask => posicion 0 es btc en el array y ask es el atributo compra qu viene de traer datos
          datetime: new Date().toISOString() //formato iso
        }

        //lo envío a la bd con la ruta y el objeto creado
        try {
          let response = await utnConnectionService.post('https://laboratorio3-f36a.restdb.io/rest/transactions', compraCriptomoneda);
          console.log(response)
        } catch (error) {
          console.error('Error al obtener los datos de la API:', error);
        }
        
      }

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
</style>