<template id="venueCreation" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-md>
    <v-layout column>
      <v-card>
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-spacer align="center">
            <v-flex xs6>
              <v-text-field
                label="Venue Name"
                v-model="venueName"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-select
                :items="categoryNames"
                label="Category"
                v-model="venueCategoryName"
                :rules="requiredRules"
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Short Description"
                v-model="venueShortDescription"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-textarea
                v-model="venueLongDescription"
                :rules="requiredRules"
              >
                <template v-slot:label>
                  <div>
                    Long Description
                  </div>
                </template>
              </v-textarea>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="City"
                v-model="venueCity"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Address"
                v-model="venueAddress"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Longitude"
                v-model.number="venueLongitude"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Latitude"
                v-model.number="venueLatitude"
                :rules="requiredRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-btn :disabled="!isValid" v-on:click="createVenue(venueName, venueCategoryName, venueShortDescription, venueLongDescription, venueCity, venueAddress,
              venueLongitude, venueLatitude)"> Create</v-btn>
            </v-flex>
            <div v-if="errorFlag" style="color: red;">
              {{error}}
            </div>
          </v-spacer>
        </v-form>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  export default {

    data() {
      return {
        requiredRules: [v => v != "" || "Required", v => v != undefined || "Required"],
        venueName: "",
        venueCategoryName: "",
        venueShortDescription: "",
        venueLongDescription: "",
        venueCity: "",
        venueAddress: "",
        venueLongitude: "",
        venueLatitude: "",

        allCategories: [],
        categoryNames : [],

        error: "",
        errorFlag: false,
        isValid: false,


      }
    },
    mounted: function () {
      this.getCategories();
    },

    methods: {
      getCategories() {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.allCategories = response.data;
            for (var i = 0; i < this.allCategories.length; i++) {
              this.categoryNames.push(this.allCategories[i].categoryName);
            }
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      createVenue(venueName, venueCategoryName, venueShortDescription, venueLongDescription, venueCity, venueAddress,
                  venueLongitude, venueLatitude) {
        if (this.$refs.form.validate()) {
          let venueCategoryId = this.getCategoryId(venueCategoryName);
          let requestBody = {
            "venueName": venueName,
            "categoryId": venueCategoryId,
            "city": venueCity,
            "shortDescription": venueShortDescription,
            "longDescription": venueLongDescription,
            "address": venueAddress,
            "latitude": venueLatitude,
            "longitude": venueLongitude,
          };
          let headers = {
            'X-Authorization': this.$cookies.get("authToken")
          };
          this.$http.post('http://localhost:4941/api/v1/venues', JSON.stringify(requestBody), {headers: headers})
            .then(function () {
              this.backToVenuesPage();
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },

      getCategoryId(categoryName) {
        for (var i = 0; i < this.allCategories.length; i++) {
          if(categoryName === this.allCategories[i].categoryName){
            return this.allCategories[i].categoryId;
          }
        }
        },
      backToVenuesPage() {
        this.$router.push("/");
      }




    }
  }
</script>
