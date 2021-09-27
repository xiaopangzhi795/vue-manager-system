import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'

const app = createApp(App)
installElementPlus(app)
// 引入vue-UUID组件


app
    .use(store)
    .use(router)
    .mount('#app');

