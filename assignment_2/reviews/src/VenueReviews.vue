<template id="venueReviews">
  <v-card>
    <v-container>
      <h1>Venue Reviews</h1>
      <div v-if="hasReviews" v-for="review in venueReviews">
            <v-container m3>
              <v-card>
                <div class="field-sections">
                  <div class="field-section">
                    <p v-bind:style="{color: color}">Review Body</p>
                    <p v-bind:style="{fontSize: fontSize}">{{review.reviewBody}}</p>
                  </div>
                  <v-divider></v-divider>
                  <div class="field-section">
                    <p v-bind:style="{color: color}">Star Rating</p>
                    <p v-bind:style="{fontSize: fontSize}">{{review.starRating}}</p>
                  </div>
                  <v-divider></v-divider>
                  <div class="field-section">
                    <p v-bind:style="{color: color}">Cost Rating</p>
                    <p v-bind:style="{fontSize: fontSize}">{{review.costRating}}</p>
                  </div>
                  <v-divider></v-divider>
                  <div class="field-section">
                    <p v-bind:style="{color: color}">Reviewer</p>
                    <p v-bind:style="{fontSize: fontSize}">{{review.reviewAuthor.username}}</p>
                  </div>
                  <div class="field-section">
                    <p v-bind:style="{color: color}">Time Posted</p>
                    <p v-bind:style="{fontSize: fontSize}">{{getTimePosted(review.timePosted)}}</p>
                  </div>
                  <v-divider></v-divider>
                </div>
              </v-card>
            </v-container>
          </div>
    </v-container>
  </v-card>
</template>

<script>

  export default {

    data() {
      return {
        venueReviews: [],

        fontSize: '20px',
        color: 'blue',

        reviewBody: "",
        starRating: 0,
        costRating: 0,
        reviewerName: "",
        timePosted: 0,

        error: "",
        errorFlag: false,

        hasReviews: false,


      }

    },
    mounted: function () {
      this.getVenueReviews(this.$route.params.id);
    },
    methods: {
      getVenueReviews(venueId) {
        this.$http.get('http://localhost:4941/api/v1/venues/' + venueId + '/reviews')
          .then(function (response) {
            this.venueReviews = response.data;
            if(this.venueReviews != null){
              this.hasReviews = true;
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getTimePosted(dateTimePosted){
        let date = new Date(dateTimePosted);
        let timePosted = "Date: " + date.getDate()+ "/" + date.getMonth() + "/" + date.getFullYear() +
          " Time: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return timePosted;
      }
    }
  }
</script>
