<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-md text-xs-center>
    <v-layout>
      <v-flex xs16>
        <v-card>
          <div>
            <div v-if="errorFlag" style="color: red;">
              {{error}}
            </div>
            <div id="venues">
              <v-flex xs12 sm12 md12 class="text-xs-right">
                <v-btn
                  color="search"
                  v-on:click="createAVenue"
                  v-if="$cookies.get('authToken')"
                >Add a Venue
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select
                  :items="cities"
                  label="Select a City"
                  v-model="currentCity"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select
                  :items="categoryNames"
                  label="Select a Category"
                  v-model="currentCategoryName"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select
                  :items="allStarRatings"
                  label="Select a Minimum Star Rating"
                  v-model="minStarRating"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select
                  :items="allCostRatings"
                  label="Select a Maximum Cost Rating"
                  v-model="maxCostRating"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12 class="text-xs-left">
                <v-btn color="search" v-on:click="getSelectedVenues">Search</v-btn>
              </v-flex>
              <v-flex xs12 sm12 md12 class="text-xs-left">
                <v-btn
                  color="search"
                  v-on:click="getMyVenues"
                  v-if="$cookies.get('authToken')"
                >My Venues
                </v-btn>
              </v-flex>

              <!--<v-list three-line>-->
              <!--&lt;!&ndash;<tr v-for="venue in getSearchedVenues()">&ndash;&gt;-->
              <!--<template v-for = "(venue, index) in venues">-->

              <!--<v-divider></v-divider>-->

              <!--<v-list-tile-->
              <!--:key = venue.venueId-->
              <!--&gt;-->

              <!--<v-list-tile-avatar>-->
              <!--<img src="./assets/default.png">-->
              <!--</v-list-tile-avatar>-->


              <!--<v-list-tile-content-->
              <!--class="venueListElement"-->
              <!--v-on:click="viewVenue(venue.venueId, venue.categoryId)"-->
              <!--&gt;-->
              <!--<v-list-tile-title v-html="venue.venueName"></v-list-tile-title>-->
              <!--<v-list-tile-sub-title v-html="'category: ' + getCategoryName(venue.categoryId) +-->
              <!--',  star rating: ' + venue.meanStarRating + ', cost rating: ' + venue.modeCostRating"></v-list-tile-sub-title>-->
              <!--</v-list-tile-content>-->
              <!--</v-list-tile>-->
              <!--</template>-->
              <!--<v-divider></v-divider>-->


              <!--<tr v-for="venue in venues">-->
              <!--<td>{{venue.venueName}}</td>-->
              <!--<td>-->
              <!--<router-link :to="{name:'venue', params: {id: venue.venueId}}"> View</router-link>-->
              <!--</td>-->
              <!--</tr>-->
              <!--</v-list>-->
              <v-data-table
                :headers="headers"
                :items="venues"
                :pagination.sync="pagination"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:items="props">
                  <td v-on:click="viewVenue(props.item.venueId, props.item.categoryId)">{{ props.item.venueName }}</td>
                  <td class="text-xs-right">{{ getCategoryName(props.item.categoryId) }}</td>
                  <td class="text-xs-right">{{ props.item.meanStarRating }}</td>
                  <td class="text-xs-right">{{ props.item.modeCostRating }}</td>
                  <td class="text-xs-right" v-if="navSupported">{{ props.item.distance}}</td>
                  <img v-if="hasProfilePic(props.item.primaryPhoto)"
                       :src="`http://localhost:4941/api/v1/venues/4/photos/` + props.item.primaryPhoto" width="100"
                       height="100">
                  <img v-else src="./assets/default.png" width="150" height="150">
                </template>
              </v-data-table>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  export default {

    data() {
      return {
        error: "",
        errorFlag: false,
        venues: [],
        venueReviews: [],
        cities: [],
        queryParams: "",
        defaultVenuePic: "./assets/default.png",

        currentCity: "",
        currentCategoryName: "",
        minStarRating: 0,
        maxCostRating: 0,

        allCategories: [],
        categoryNames: [],
        allStarRatings: ['All', 1, 2, 3, 4, 5],
        allCostRatings: ['Any','Free', '$', '$$', '$$$', '$$$$'],

        search: "",

        navSupported: false,
        browserLatitude: 0,
        browserLongitude: 0,

        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'venueName'
          },
          {text: 'Category', sortable: false, value: 'venueCategory'},
          {text: 'Star Rating', value: 'meanStarRating'},
          {text: 'Cost Rating', value: 'modeCostRating'},
          {text: 'Distance (Km)', value: 'distance'},
          {text: 'Photo', sortable: false, value: 'venuePhoto'},

        ],
        pagination: {
          sortBy: 'meanStarRating',
          rowsPerPage: 10
        },

      }
    },

    mounted: function () {
      this.getLocation();
      this.toggleOrder();
      // this.getVenues();
      this.getCategories();
    },

    methods: {
      toggleOrder() {
        this.pagination.descending = !this.pagination.descending
      },
      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.venues = response.data;
            this.getCities();
            this.setStarRatings();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;

          });
      },
      getSelectedVenues() {
        this.createVenueQueryParams();
        this.$http.get('http://localhost:4941/api/v1/venues' + this.queryParams)
          .then(function (response) {
            this.venues = response.data;
            this.getCities();
            this.setStarRatings();
            if (this.navSupported) {
              this.setDistanceDecimalPlace();
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getMyVenues() {
        this.$http.get('http://localhost:4941/api/v1/venues?adminId=' + this.$cookies.get('userId'))
          .then(function (response) {
            this.venues = response.data;
            this.getCities();
            this.setStarRatings();
            if (this.navSupported) {
              this.setDistanceDecimalPlace();
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      setDistanceDecimalPlace() {
        for (var i = 0; i < this.venues.length; i++) {
            this.venues[i].distance = this.venues[i].distance.toFixed(2);
        }
      },
      createVenueQueryParams() {
        this.queryParams = "/";
        if (this.navSupported) {
          this.queryParams += ("&myLatitude=" + this.browserLatitude);
          this.queryParams += ("&myLongitude=" + this.browserLongitude);
        }
        if (this.currentCity !== "" && this.currentCity !== "All Cities") {
          this.queryParams += ("&city=" + this.currentCity);
        }
        if (this.currentCategoryName !== "" && this.currentCategoryName !== "All Categories") {
          this.queryParams += ("&categoryId=" + this.categoryId);
        }
        if (this.minStarRating !== 0 && this.minStarRating !== "All") {
          this.queryParams += ("&minStarRating=" + this.minStarRating);
        }
        if (this.maxCostRating !== 0 && this.maxCostRating !== "Any") {
          this.queryParams += ("&maxCostRating=" + this.maxCost);
        }
        if (this.queryParams === "/") {
          this.queryParams = "";
        }
        this.queryParams = this.queryParams.replace("&", "?");
        console.log("params = " + this.queryParams)
      },

      getCities: function () {
        this.cities.push("All Cities")
        for (var i = 0; i < this.venues.length; i++) {
          this.cities.push(this.venues[i].city)
        }
      },
      viewVenue(id, catagoryId) {
        this.$router.push("/venues/" + id + "/" + catagoryId);
      },
      createAVenue() {
        this.$router.push("/venue/create");
      },
      getCategories() {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.allCategories = response.data;
            this.categoryNames.push("All Categories");
            for (var i = 0; i < this.allCategories.length; i++) {
              this.categoryNames.push(this.allCategories[i].categoryName);
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getCategoryName(categoryId) {
        for (var i = 0; i < this.allCategories.length; i++) {
          if (categoryId === this.allCategories[i].categoryId) {
            return this.allCategories[i].categoryName;
          }
        }
      },
      getCategoryId(categoryName) {
        for (var i = 0; i < this.allCategories.length; i++) {
          if (categoryName === this.allCategories[i].categoryName) {
            return this.allCategories[i].categoryId;
          }
        }
      },
      hasProfilePic(primaryPhotoName) {
        if (primaryPhotoName != null) {
          return true;
        } else {
          return false;
        }
      },
      setStarRatings() {
        for (var i = 0; i < this.venues.length; i++) {
          if (!(this.venues[i].meanStarRating)) {
            this.venues[i].meanStarRating = 3;
          }
        }
      },
      getLocation() {
        if (navigator.geolocation) {
          this.navSupported = true;
          navigator.geolocation.getCurrentPosition(this.setPosition);
        }
      },
      setPosition(position) {
        this.browserLatitude = position.coords.latitude;
        this.browserLongitude = position.coords.longitude;
        this.getSelectedVenues();
      },


    },
    computed: {
      categoryId() {
        if (this.currentCategoryName != 'All Categories') {
          return this.getCategoryId(this.currentCategoryName);
        }
      },
      maxCost(){
        if (this.maxCostRating === "Free") {
          return 0;
        } else if (this.maxCostRating === '$'){
          return 1
        } else if (this.maxCostRating === '$$'){
          return 2
        } else if (this.maxCostRating === '$$$'){
          return 3
        } else if (this.maxCostRating === '$$$$'){
          return 4
        }
      },

    }
  }
</script>
