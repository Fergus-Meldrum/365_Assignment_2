<template id="venue" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout row>
      <v-flex lg6>
        <SingleVenueInfo
          :name.sync="venueName"
          :catagory.sync="venueCategoryName"
          :admin.sync="venueAdmin"
          :adminId.sync="venueAdminId"
          :city.sync="venueCity"
          :address.sync="venueAddress"
          :date.sync="venueDateAdded"
          :starRating.sync="venueMeanStarRating"
          :costRating.sync="venueCostRating"
          :shortDescription.sync="venueShortDescription"
          :longDescription.sync="venueLongDescription"
        />

        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="!isVenueAdmin"
              v-on="on"
            >
              Edit Venue
            </v-btn>
          </template>

          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              Edit Venue
            </v-card-title>

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
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    label="Latitude"
                    v-model.number="venueLatitude"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-btn color="red lighten-2" :disabled="!isValid" v-on:click="editVenue(venueName, venueCategoryName, venueShortDescription, venueLongDescription, venueCity, venueAddress,
              venueLongitude, venueLatitude)">Confirm
                  </v-btn>
                </v-flex>
                <div v-if="errorFlag" style="color: red;">
                  {{error}}
                </div>
              </v-spacer>
            </v-form>

            <v-divider></v-divider>
          </v-card>
        </v-dialog>

        <v-btn v-on:click="viewVenueReviews()">See Reviews</v-btn>
        <v-btn :disabled="!($cookies.get('authToken'))" v-on:click="addVenueReview()">Add Review</v-btn>


      </v-flex>
      <v-flex lg6>
        <v-card>
          <p>PHOTOS</p>
          <v-layout row wrap>
            <v-flex
              v-for="photoName in venuePhotoNames"
              xs4
              d-flex
            >
              <v-card flat tile class="d-flex">
                <v-img
                  :src="`http://localhost:4941/api/v1/venues/4/photos/` + photoName"
                  :lazy-src="`http://localhost:4941/api/v1/venues/4/photos/` + photoName"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-layout
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SingleVenueInfo from "./SingleVenueInfo";

  export default {
    components: {SingleVenueInfo: SingleVenueInfo},

    data() {
      return {
        error: "",
        errorFlag: false,
        venueName: "",
        venueCategoryName: "",
        venueAdmin: "",
        venueAdminId: 0,
        venueCity: "",
        venueAddress: "",
        venueDateAdded: "",
        venueMeanStarRating: 0,
        venueCostRating: 0,
        venueShortDescription: "",
        venueLongDescription: "",

        venue: {},
        venuePhotoNames: [],

        allVenuesWithCatId: [],

        dialog: false,

        requiredRules: [v => v != "" || "Required", v => v != undefined || "Required"],
        isValid: false,
        allCategories: [],
        categoryNames: [],
        venueLongitude: "",
        venueLatitude: "",
      }

    },

    mounted: function () {
      this.setVenueFromAll(this.$route.params.id);
      this.setVenueSingle(this.$route.params.id);
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
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      setVenueFromAll(id) {
        this.$http.get('http://localhost:4941/api/v1/venues?categoryId=' + this.$route.params.categoryId)
          .then(function (response) {
            //what does this line do?
            this.allVenuesWithCatId = response.data;
            for (var i = 0; i < this.allVenuesWithCatId.length; i++) {
              if (this.allVenuesWithCatId[i].venueId == id) {
                this.venueName = this.allVenuesWithCatId[i].venueName;
                this.venueCity = this.allVenuesWithCatId[i].city;
                this.venueMeanStarRating = this.allVenuesWithCatId[i].meanStarRating;
                this.venueCostRating = this.allVenuesWithCatId[i].modeCostRating;
                this.venueLatitude = this.allVenuesWithCatId[i].latitude;
                this.venueLongitude = this.allVenuesWithCatId[i].longitude;
              }
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      setVenueSingle(id) {
        this.$http.get('http://localhost:4941/api/v1/venues/' + id)
          .then(function (response) {
            this.venue = response.data;
            this.venueCategoryName = this.venue.category.categoryName;
            this.venueAdmin = this.venue.admin.username;
            this.venueAdminId = this.venue.admin.userId;
            this.venueAddress = this.venue.address;
            let date = new Date(this.venue.dateAdded);

            this.venueDateAdded = date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear();
            this.venueShortDescription = this.venue.shortDescription;
            if (this.venue.longDescription == "") {
              this.venueLongDescription = "N/A";
            } else {
              this.venueLongDescription = this.venue.longDescription
            }
            for (var i = 0; i < this.venue.photos.length; i++) {
              this.venuePhotoNames.push(this.venue.photos[i].photoFilename);
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addVenueReview() {
        this.$router.push({
          name: 'addReview',
          params: {id: this.$route.params.id, categoryId: this.$route.params.categoryId}
        })
      },
      viewVenueReviews() {
        this.$router.push({name: 'venueReviews', params: {id: this.$route.params.id}})
      },
      editVenue(venueName, venueCategoryName, venueShortDescription, venueLongDescription, venueCity, venueAddress,
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
          this.$http.patch('http://localhost:4941/api/v1/venues/' + this.$route.params.id, JSON.stringify(requestBody), {headers: headers})
            .then(function () {
              this.dialog = false;
              this.errorFlag = false;
              // document.location.reload();
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      getCategoryId(categoryName) {
        for (var i = 0; i < this.allCategories.length; i++) {
          if (categoryName === this.allCategories[i].categoryName) {
            return this.allCategories[i].categoryId;
          }
        }
      },
    },
    computed: {
      isVenueAdmin() {
        if (this.venueAdminId == (this.$cookies.get('userId'))) {
          return true;
        }
      }
    }
  }
</script>
