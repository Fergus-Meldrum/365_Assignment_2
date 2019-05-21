<template id="Navigation">
  <v-toolbar dark colour="primary">
    <v-toolbar-title>App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat v-on:click="logout" v-if="loggedIn">Log Out</v-btn>
      <v-btn flat v-on:click="goToLogin" v-if="!loggedIn">Log In</v-btn>
      <v-btn flat v-on:click="goToOwnProfile" v-if="loggedIn">My Profile</v-btn>
      <v-btn flat v-on:click="searchVenuesPage">All Venues</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
   export default {
      data() {
        return {
          loggedIn: true
        }
      },
     mounted: function () {
        this.checkLoggedIn();
     },
     methods: {
       logout() {
         this.loggedIn = false;
         this.$cookies.remove("authToken");
         this.$cookies.remove("userId");
         this.$cookies.remove("password");
         document.location.reload();
       },
       goToLogin() {
         this.$router.push('/login');
       },
       goToOwnProfile() {
         this.$router.push({name: 'singleProfile', params: {id: this.$cookies.get('userId')}})
       },
       checkLoggedIn() {
         if (this.$cookies.get('authToken')) {
           this.loggedIn = true;
         } else {
           this.loggedIn = false;
         }
       },
       searchVenuesPage() {
         this.$router.push("/");
       }
     },
     watch: {
       $route(to, from) {
         this.checkLoggedIn();
       }
     }

   }
</script>
