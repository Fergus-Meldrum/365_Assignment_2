<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <div class="field-sections">
      <div class="field-section">
        <p v-bind:style="{color: color}">NAME</p>
        <p v-bind:style="{fontSize: fontSize}">{{name}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">CATEGORY</p>
        <p v-bind:style="{fontSize: fontSize}">{{catagory}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section" v-on:click="viewUserProfile">
        <p v-bind:style="{color: color}">ADMIN</p>
        <p v-bind:style="{fontSize: fontSize}">{{admin}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">CITY</p>
        <p v-bind:style="{fontSize: fontSize}">{{city}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">ADDRESS</p>
        <p v-bind:style="{fontSize: fontSize}">{{address}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">DATE ADDED</p>
        <p v-bind:style="{fontSize: fontSize}">{{date}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">STAR RATING</p>
        <p v-bind:style="{fontSize: fontSize}">{{starRating}}</p>
      </div>
      <v-divider></v-divider>
      <div class="field-section">
        <p v-bind:style="{color: color}">COST RATING</p>
        <p v-bind:style="{fontSize: fontSize}">{{costRating}}</p>
      </div>
    </div>
    <v-divider></v-divider>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            <p v-bind:style="{color: color}">DESCRIPTION</p>
            <p>{{shortDescription}}</p>
          </div>
        </template>
        <v-card>
          <v-card-text>
            <p>Long Description:</p>
            <p><br>{{longDescription}}</p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>


<script>

  export default {

    data() {
      return {
        fontSize: '20px',
        color: 'blue'
      }
    },

    props: [
      "name",
      "catagory",
      "admin",
      "adminId",
      "city",
      "address",
      "date",
      "starRating",
      "costRating",
      "shortDescription",
      "longDescription",
    ],

    methods: {
      viewUserProfile(){
        this.$router.push({ name: 'singleProfile', params: {id: this.adminId} })
      }
    }
  }
</script>
