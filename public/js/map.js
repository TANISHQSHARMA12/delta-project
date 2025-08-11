
	      mapboxgl.accessToken =mapToken;
          const map = new mapboxgl.Map({
          container: 'map', // container ID
          center: ([77.23,28.61]), // starting position [lng, lat]. Note that lat must be set between -90 and 90
          zoom: 9 // starting zoom
    });
    console.log(coordinates)
//     const marker = new mapboxgl.Marker()
//         .setLngLat(coordinates)// listing.geometry.coordinates
//         .addTo(map);