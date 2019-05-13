Vue.http.options.emulateJSON = true;
new  Vue ({
    el :  '#app',

    data : {
        venues : []
    },

    mounted :  function () {
    },

    methods : {
        getVenues :  function () {
            this.$http.get('http://url‑to‑your‑api.com/api/v1/venues')
                . then ( function ( response ){
                    this . users  = response . data;
                },  function ( error ){
                    console . log ( error );
                });
        }
    }
});