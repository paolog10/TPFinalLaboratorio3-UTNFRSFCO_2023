import axios from "axios";

const criptoYaInstance = axios.create({
  baseURL: "https://criptoya.com/api",
});

export default criptoYaInstance;