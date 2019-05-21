<template id="login">
  <v-card>
    <v-form ref="form" v-model="isValid" lazy-validation>
      <v-container grid-list>
        <v-layout column>
          <v-spacer align="center">
            <v-flex xs4>
              <v-text-field
                label="Username or Email"
                :rules="requiredRules"
                v-model="usernameOrEmail"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
            <v-text-field
              label="Password"
              :rules="requiredRules"
              v-model="password"
            ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-btn :disabled="!isValid" v-on:click="login(usernameOrEmail, password)">Login</v-btn>
            </v-flex>
            <v-flex xs4>
              <v-btn v-on:click="goToSignUp()">Sign Up</v-btn>
            </v-flex>
            <div v-if="errorFlag" style="color: red;">
              {{error.statusText}}
            </div>
          </v-spacer>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
  export default {

    data(){
      return {
        requiredRules: [v => v !== "" || "Required", v => v !== undefined || "Required"],


        usernameOrEmail: "",
        password: "",
        email: "",
        username: "",
        loginReqBody: {},

        errorFlag: false,
        error: "",

        isValid: false,

      }
    },

    methods: {
      login(usernameOrPassword, password){
        if (this.$refs.form.validate()) {
          if(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(usernameOrPassword)){
            this.email = usernameOrPassword;
            this.loginReqBody = {
              "email": this.email,
              "password": password
            };
          } else {
            this.username = usernameOrPassword;
            this.loginReqBody = {
              "username": this.username,
              "password": password
            };
          }
          this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify(this.loginReqBody))
            .then(function (response) {
              let authToken = response.data.token;
              let userId = response.data.userId;
              this.$cookies.set('authToken', authToken);
              this.$cookies.set('userId', userId);
              this.$cookies.set('password', this.password);
              this.$router.push("/")
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      goToSignUp() {
        this.$router.push("/signup");
      }
    }
  }
</script>
