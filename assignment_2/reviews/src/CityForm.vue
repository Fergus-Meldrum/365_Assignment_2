<template>
  <v-container grid-list-md fluid ma-0>
    <v-flex sm6 xs12>
      <v-select
        :items=cityList
        label="Select"
      ></v-select>
    </v-flex>
  </v-container>
</template>

<script>
  export default {
    name: "CityForm",
    props: ["venues"],

    data() {
      return {
        venues: [],
        cityList: []
      };
    },
    mounted() {
      this.populateCityList();
    },

    methods: {
      // populateCityList: function() {
      //   this.$http.get('http://localhost:4941/api/v1/venues')
      //     .then(function (response) {
      //       this.venues = response.data;
      //       for (var i = 0; i < this.venues.length; i++){
      //         console.log("this is :" + venues[i].city)
      //         this.cityList.push(venues[i].city)
      //       }
      //     })
      // },
      populateCityList: function() {
        for(var i = 0; i < "venues".length; i++){
          // this.cityList.push(this.venues[i].city);
          console.log("this is : " + "venues"[i])
        }
      },
    }
  };
</script>
