<template id="addReview" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-md>
    <v-layout column>
      <v-form ref="form" v-model="isValid" lazy-validation>
        <v-spacer align="center">
          <v-flex xs6>
            <v-textarea
              v-model="venueReview"
              :rules="requiredRules"
            >
              <template v-slot:label>
                <div>
                  Review Body
                </div>
              </template>
            </v-textarea>
          </v-flex>
          <v-flex xs6>
            <div>
              Star Rating
            </div>
            <v-rating
              v-model.number="venueStarRating">
            </v-rating>
          </v-flex>
          <v-flex xs6>
            <div>
              Cost Rating
            </div>
            <v-rating
              v-model.number="venueCostRating">
            </v-rating>
            <div>
              {{getCostRating()}}
            </div>
          </v-flex>
          <v-flex xs4>
            <v-btn :disabled="!isValid" v-on:click="addReview(venueReview, costRating, venueStarRating)">Add</v-btn>
          </v-flex>
          <div v-if="errorFlag" style="color: red;">
            {{error.statusText}}
          </div>
          <div v-else-if="successFlag" style="color: red;">
            {{success}}
          </div>
          <v-flex xs4>
            <v-btn v-on:click="backToVenue($route.params.id)">Back</v-btn>
          </v-flex>
        </v-spacer>
      </v-form>
    </v-layout>
  </v-container>
</template>


<script>
  export default {

    data() {
      return {
        requiredRules: [v => v != "" || "Required", v => v != undefined || "Required"],
        costRatingRules: [v => v != "" || "Required", v => v != undefined || "Required", v=> v >= 0 || "must be greater than 0", v=> v <= 4 || "max rating is 4"],
        venueReview: "",
        venueStarRating: 1,
        venueCostRating: 1,

        errorFlag: false,
        error: "",

        successFlag: false,
        success: "review added!",

        isValid: false,


      }

    },
    methods: {
      getCostRating(){
        if (this.costRating === 0){
          return 'Free'
        } else {
          return ('$'.repeat(this.costRating));
        }
      },
      addReview(venueReview, costRating, starRating){
        if (this.$refs.form.validate()) {
          let requestBody = {
            "reviewBody": venueReview,
            "starRating": starRating,
            "costRating": costRating
          };
          let headers = {
            'X-Authorization': this.$cookies.get("authToken")
          };
          this.$http.post('http://localhost:4941/api/v1/venues/' + this.$route.params.id + "/reviews", JSON.stringify(requestBody), {headers: headers})
            .then(function () {
              this.successFlag = true;
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      backToVenue(id){
        this.$router.push({ name: 'venue', params: { id: this.$route.params.id, categoryId: this.$route.params.categoryId } })
      }
    },
    computed: {
      costRating() {
        if (this.venueCostRating > 0){
          return (this.venueCostRating - 1);

        } else {
          return 0
        }
      },
    }
  }
</script>
