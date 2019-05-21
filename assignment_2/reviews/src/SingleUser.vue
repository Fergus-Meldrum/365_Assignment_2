<template id = "singleProfile">
  <v-card>
    <v-container md6>
    <div class="profile-heading-section">
      <h3 class="headline font-weight-light user-username">{{username}}</h3>
    </div>
    <v-divider></v-divider>
    <div class="field-section">
      <p v-bind:style="{color: color}">Name:</p>
      <p v-bind:style="{fontSize: fontSize}">{{givenName}}</p>
    </div>
    <v-divider></v-divider>
    <div class="field-section">
      <p v-bind:style="{color: color}">Family Name:</p>
      <p v-bind:style="{fontSize: fontSize}">{{familyName}}</p>
    </div>
    <v-divider></v-divider>
    <div v-if="ownProfile" class="field-section">
      <p v-bind:style="{color: color}">Email:</p>
      <p v-bind:style="{fontSize: fontSize}">{{email}}</p>
    </div>
      <v-divider></v-divider>
      <div v-if="ownProfile" class="field-section">
        <p v-bind:style="{color: color}">Password:</p>
        <p v-bind:style="{fontSize: fontSize}">{{$cookies.get('password')}}</p>
      </div>
    <div v-if="errorFlag" style="color: red;">
      {{error.statusText}}
    </div>
    </v-container>
  </v-card>
</template>

<script>
  export default {

    data() {
      return {
        username: "",
        givenName: "",
        familyName: "",
        email: "",

        ownProfile: false,

        fontSize: '20px',
        color: 'blue',

        headers: {},

        error: "",
        errorFlag: false,
      }
    },

    mounted: function () {
      this.getUser();
    },
    methods: {
      getUser() {
        if(this.$cookies.get('authToken')){
            this.headers = {
              'X-Authorization': this.$cookies.get('authToken')
            }
        }
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id, {headers: this.headers})
          .then(function (response) {
            let user = response.data;
            this.username = user.username;
            this.givenName = user.givenName;
            this.familyName = user.familyName;
            if (user.email) {
              this.ownProfile = true;
              this.email = user.email;
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })

      }
    }
  }
</script>
