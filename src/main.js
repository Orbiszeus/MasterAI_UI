import { createApp } from 'vue'
import App from './App.vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';


import './assets/main.css'

const app = createApp(App);

app.use(VueToast);

app.mount('#app');

