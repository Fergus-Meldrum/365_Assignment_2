<template id="signup">
  <v-card>
    <v-form ref="form" v-model="isValid" lazy-validation>
    <v-container grid-list>
      <v-layout column>
        <v-spacer align="center">
          <v-flex xs4>
            <v-text-field
              label="Given Name"
              :rules="requiredRules"
              v-model="userName"
            ></v-text-field>
            <!--:value="fname"-->
          </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Family Name"
            :rules="requiredRules"
            v-model="userFamilyName"
          ></v-text-field>
          <!--:value="fname"-->
        </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Username"
            maxlength="64"
            :counter="64"
            :rules="usernameRules"
            v-model="userUsername"
          ></v-text-field>
          <!--:value="fname"-->
        </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Email Address"
            :rules="emailRules"
            v-model="userEmailAddress"
          ></v-text-field>
          <!--:value="fname"-->
        </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Password"
            type="password"
            :rules="requiredRules"
            v-model="userPassword"
          ></v-text-field>
          <!--:value="fname"-->
        </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Confirm Password"
            type="password"
            :rules="passwordRules"
            v-model="userConfirmPassword"
          ></v-text-field>
          <!--:value="fname"-->
        </v-flex>
        <v-flex xs4>
          <v-btn :disabled="!isValid" v-on:click="signUp(userUsername, userName, userFamilyName, userEmailAddress, userPassword)">Sign Up</v-btn>
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
      return{
        requiredRules: [v => v != "" || "Required", v => v != undefined || "Required"],
        usernameRules: [v => v != "" || "Required", v => v != undefined || "Required", v => /^[0-9a-zA-Z]+$/.test(v) || "Must be alphanumeric"],
        emailRules: [v => v != "" || "Required", v => v != undefined || "Required", v => /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v)
          || "enter valid email"],
        passwordRules: [v => v != "" || "Required", v => v != undefined || "Required", v => this.userPassword === this.userConfirmPassword || "Passwords do not match"],
        isValid: false,
        requestBody: {},
        userName: "",
        userFamilyName: "",
        userUsername: "",
        userEmailAddress: "",
        userPassword: "",
        userConfirmPassword: "",

        errorFlag: false,
        error: "",



      }
    },
    methods: {
      signUp(username, givenName, familyName, email, passowrd) {
        if (this.$refs.form.validate()){
          this.requestBody = {
            "username": username,
            "givenName": givenName,
            "familyName": familyName,
            "email": email,
            "password": passowrd
          };
          this.$http.post('http://localhost:4941/api/v1/users/', JSON.stringify(this.requestBody))
            .then(function (){
              this.logIn(this.userUsername, this.userPassword)

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      logIn(username, password){
        let loginDetails = {
          "username": username,
          "password": password
        }
        this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify(loginDetails))
          .then(function (response) {
            let authToken = response.data.token;
            let userId = response.data.userId;
            this.$cookies.set('authToken', authToken);
            this.$cookies.set('userId', userId);
            this.$cookies.set('password', this.userPassword);
            this.$router.push("/")
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

          }
      }

  }
</script>
