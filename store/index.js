import { createApp } from 'vue'

//creamos instancia de la aplicación
const app = createApp({
  data(){
    return{
      errorLoginUsuario: true,
      message: 'Paolo Gamarra'
    }
  }
})

app.mount('#app')