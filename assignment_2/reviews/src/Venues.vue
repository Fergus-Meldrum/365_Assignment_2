<template>
  <v-container grid-list-md text-xs-center>
    <v-layout>
      <v-flex xs16>
        <v-card>
          <div>
            <div v-if="errorFlag" style="color: red;">
              {{error}}
            </div>

            <div v-if="$route.params.id">
              <div id="venue">
                <router-link :to="{name: 'venues'}">Back to Venues</router-link>

                <br/><br/>

                <table>
                  <tr>
                    <td>Venue ID</td>
                    <td>Venue Name</td>
                  </tr>
                  <tr>
                    <td>{{$route.params.id}}</td>
                    <td>{{ getSingleVenue($route.params.id).venueName}}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div v-else>
              <div id="venues">

                <v-flex xs12 sm6 d-flex>
                  <v-select
                    :items="cities"
                    label="Select a City"
                    :value="currentCity"
                    v-on:change="updateSelectedVenues(currentCity)"
                  ></v-select>
                </v-flex>

                <v-list three-line>
                  <!--<tr v-for="venue in getSearchedVenues()">-->
                  <template v-for = "(venue, index) in venues">

                    <v-divider></v-divider>

                    <v-list-tile
                      :key = venue.venueId
                      >
                      <v-list-tile-content>
                        <v-list-tile-title v-html="venue.venueName"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="'category: ' + venue.categoryName"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                  <v-divider></v-divider>


                  <!--<tr v-for="venue in venues">-->
                  <!--<td>{{venue.venueName}}</td>-->
                  <!--<td>-->
                  <!--<router-link :to="{name:'venue', params: {id: venue.venueId}}"> View</router-link>-->
                  <!--</td>-->
                  <!--</tr>-->
                </v-list>
              </div>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import CityForm from "./CityForm";

  export default {
    components: {CityForm: CityForm},
    data() {
      return {
        error: "",
        errorFlag: false,
        venues: [],
        cities: [],
        currentCity: "",
        searchedVenues: [],

      }
    },

    mounted: function () {
      this.getVenues();
    },

    methods: {
      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            //what does this line do?
            this.venues = response.data;
            this.getCities();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;

          });
      },
      getCities: function () {
        this.cities.push("All Cities")
        for (var i = 0; i < this.venues.length; i++) {
          this.cities.push(this.venues[i].city)
        }
      },
      getSingleVenue: function (id) {
        for (var i = 0; i < this.venues.length; i++) {
          if (this.venues[i].venueId == id) {
            return this.venues[i];
          }
        }
      },
      updateSelectedVenues: function (currentCity) {
        this.searchedVenues = [];
        if (currentCity != "" || currentCity != "All Cities") {
          for (var i = 0; i < this.venues.length; i++) {
            if (this.venues[i].city == currentCity) {
              this.searchedVenues.push(this.venues[i])
            }
          }
        } else {
          this.searchedVenues = this.venues;
        }
      }
    }
  }
</script>
