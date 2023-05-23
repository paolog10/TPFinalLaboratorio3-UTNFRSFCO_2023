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
    <table>
      <thead>
        <tr>
          <th>Moneda</th>
          <th>Precio de Compra</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in coins" :key="coin.id">
          <td>{{ coin.coin }}</td>
          <td>{{ coin.ask }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <hr>
  aca va el formulario de compra
</template>


<script>
  //import axios from 'axios';
  //import criptoYaInstance from '../services/criptoYaConnectionService';

  export default {
    data() {
      return {
        clienteId: localStorage.getItem('idUsuario'), //inicializo el idUsuario del localStorage
        coins: []
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
        console.log('Cerrando sesión...');
      },
      
      fetchCoins(){
        fetch('https://criptoya.com/api')
        .then(response => response.json())
        .then(data => {
          //this.apiData = Object.entries(data).map(([name, value]) => ({ name, value }));
          console.log(data);
        })
        .catch(error => {
          console.error('Error al obtener los datos de la API:', error);
        });   
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
</style>