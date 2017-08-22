import Vue from 'vue';
import VueAxios from 'vue-axios';

import App from './App.vue';
import store from './store';
import router from './router';
import axios from './http';

Vue.use(VueAxios, axios);

new Vue({
    el: '#app',
    router: router,
    store: store,
    template: '<app/>',
    components: { App }
});