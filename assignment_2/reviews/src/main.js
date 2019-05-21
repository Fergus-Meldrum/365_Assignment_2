import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify, {
  iconfont: 'md'
})
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


import App from './App.vue';
import Home from './Home.vue'
import Venues from './Venues.vue'
import SingleVenue from './SingleVenue.vue'
import SignUpPage from './SignUpPage'
import CreateVenue from './CreateVenue'
import LoginPage from './LoginPage'
import VenueEdit from './VenueEdit'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
import addReview from "./addReview";
import SingleUser from "./SingleUser";
import VenueReviews from "./VenueReviews";
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes = [
  // {
  //   path: "/",
  //   component: Home
  //
  // },
  // {
  //   path: "/venues/:id",
  //   name: "venue",
  //   component: Venues
  // },
  {
    path: "/venues/:id/:categoryId",
    name: "venue",
    component: SingleVenue
  },
  {
    path: "/venue/create",
    name: "venueCreation",
    component: CreateVenue
  },
  {
    path: "venues/:id/:categoryId/addReview",
    name: "addReview",
    component: addReview
  },
  {
    path: "/",
    name: "venues",
    component: Venues
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpPage
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage
  },
  {
    path: "/profile/:id",
    name: "singleProfile",
    component: SingleUser
  },
  {
    path: "/venue/:id/reviews",
    name: "venueReviews",
    component: VenueReviews
  },
  {
    path: "venue/:id/edit",
    name: "venueEdit",
    component: VenueEdit
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
