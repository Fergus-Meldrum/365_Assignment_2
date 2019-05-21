<template id="singleProfile" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-container md6>
      <v-flex xs12 sm12 md12 class="text-xs-right">
        <div v-if="ownProfile" class="container">
          <div class="large-12 medium-12 small-12 cell">
            <label>File
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
            <v-btn v-on:click="changeProfilePic()">Upload</v-btn>
            <v-btn v-if="!noProfilePic" v-on:click="deleteProfilePic()">Delete</v-btn>
            <div v-if="picErrorFlag" style="color: red;">
              {{picError}}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex
        xs12
        align-center
        justify-center
        layout
        text-xs-center
      >
        <v-avatar
          :size="250"
          color="grey lighten-4"
        >
          <img :src=this.profilePicSrc alt="avatar">
        </v-avatar>
      </v-flex>
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
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            :disabled="!ownProfile"
            v-on="on"
          >
            Edit Profile
          </v-btn>
        </template>

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Edit Profile
          </v-card-title>

          <v-form ref="form" v-model="givenNameValid" lazy-validation>
            <v-spacer align="center">
              <v-flex xs6>
                <v-text-field
                  label="Given Name"
                  v-model="givenName"
                  :rules="requiredRules"
                ></v-text-field>
                <v-btn color="red lighten-2" :disabled="!givenNameValid" v-on:click="changeGivenName(givenName)">Change
                  Given Name
                </v-btn>
              </v-flex>
            </v-spacer>
          </v-form>
          <v-form ref="form" v-model="familyNameValid" lazy-validation>
            <v-spacer align="center">
              <v-flex xs6>
                <v-text-field
                  label="Family name"
                  v-model="familyName"
                  :rules="requiredRules"
                ></v-text-field>
                <v-btn color="red lighten-2" :disabled="!familyNameValid" v-on:click="changeFamilyName(familyName)">
                  Change Family Name
                </v-btn>
              </v-flex>
            </v-spacer>

          </v-form>

          <v-form ref="form" v-model="passwordValid" lazy-validation>
            <v-spacer align="center">
              <v-flex xs6>
                <v-text-field
                  label="Current Password"
                  type="password"
                  :rules="passwordRules"
                  v-model="userPassword"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="New Password"
                  type="password"
                  :rules="passwordRules"
                  v-model="userNewPassword"
                ></v-text-field>
                <v-btn color="red lighten-2" :disabled="!passwordValid" v-on:click="changePassword(userNewPassword)">
                  Change Password
                </v-btn>
              </v-flex>
            </v-spacer>
          </v-form>
          <div v-if="errorFlag" style="color: red;">
            {{error}}
          </div>

          <v-divider></v-divider>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script>
  export default {

    data() {
      return {
        requiredRules: [v => v != "" || "Required", v => v != undefined || "Required"],
        passwordRules: [v => v != "" || "Required", v => v != undefined || "Required", v => this.userPassword === this.$cookies.get('password') || "Incorrect current password"],

        username: "",
        givenName: "",
        familyName: "",
        email: "",
        userPassword: "",
        userNewPassword: "",

        ownProfile: false,

        fontSize: '20px',
        color: 'blue',

        headers: {},

        error: "",
        errorFlag: false,
        dialog: false,

        givenNameValid: false,
        familyNameValid: false,
        passwordValid: false,
        profilePicSrc: "",

        picErrorFlag: false,
        picError: "",

        validImageTypes: ['image/jpeg', 'image/png'],

        picData: "",
        noProfilePic: false,


      }
    },

    mounted: function () {
      this.getUser();
      this.getProfilePic();
    },
    methods: {
      handleFileUpload() {
        this.picData = this.$refs.file.files[0]
      },
      changeProfilePic() {
        if (!(this.validImageTypes.includes(this.picData.type))) {
          this.picError = "cannot have this type of image. .png or .jpeg only";
          this.picErrorFlag = true;
        } else if (this.picData.type.size > 20000000) {
          this.picError = "image too big, must be less than 20MB";
          this.picErrorFlag = true;
        } else {
          this.picErrorFlag = false;
          let headers = {
            'Content-Type': this.picData.type,
            'X-Authorization': this.$cookies.get('authToken')
          };
          console.log(this.picData)
          let photoData = this.picData;

          this.$http.put('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo', photoData, {headers: headers})
            .then(function () {
              this.errorFlag = false;
              document.location.reload();
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }

      },
      getUser() {
        if (this.$cookies.get('authToken')) {
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

      },
      changeGivenName(givenName) {
        let requestBody = {
          "givenName": givenName,
        };
        let headers = {
          'X-Authorization': this.$cookies.get("authToken")
        };
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id, JSON.stringify(requestBody), {headers: headers})
          .then(function () {
            this.dialog = false;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      changeFamilyName(familyName) {
        let requestBody = {
          "familyName": familyName,
        };
        let headers = {
          'X-Authorization': this.$cookies.get("authToken")
        };
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id, JSON.stringify(requestBody), {headers: headers})
          .then(function () {
            this.dialog = false;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      changePassword(newPassword) {
        let requestBody = {
          "password": newPassword,
        };
        let headers = {
          'X-Authorization': this.$cookies.get("authToken")
        };
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id, JSON.stringify(requestBody), {headers: headers})
          .then(function () {
            this.dialog = false;
            this.$cookies.set('password', newPassword);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getProfilePic() {
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo')
          .then(function (response) {
            this.profilePicSrc = 'http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo';
          }, function (error) {
            this.noProfilePic = true;
            this.profilePicSrc = "https://vuetifyjs.com/apple-touch-icon-180x180.png";
          })
      },
      deleteProfilePic() {
        let headers = {
          'X-Authorization': this.$cookies.get('authToken')
        };
        this.$http.delete('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo', {headers: headers})
          .then(function () {
            document.location.reload();

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>
