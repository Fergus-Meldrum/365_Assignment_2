import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


import App from './App.vue';
import Home from './Home.vue'
import Venues from './Venues.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    component: Home

  },
  {
    path: "/venues/:id",
    name: "venue",
    component: Venues
  },
  {
    path: "/venues",
    name: "venues",
    component: Venues
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),

})
