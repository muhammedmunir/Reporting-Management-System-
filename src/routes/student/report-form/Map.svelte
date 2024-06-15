<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    export let latitude = writable(null);
    export let longitude = writable(null);
  
    let map;
    let marker;
    let infoWindow;
  
    const initMap = () => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.5584681034088135, lng: 103.6378173828125 },
        zoom: 15,
      });
  
      google.maps.event.addListener(map, 'click', (event) => {
        placeMarker(event.latLng);
        latitude.set(event.latLng.lat());
        longitude.set(event.latLng.lng());
      });

      infoWindow = new google.maps.InfoWindow();

        const locationButton = document.createElement("button");
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        infoWindow.setPosition(pos);
                        infoWindow.setContent("Location found.");
                        infoWindow.open(map);
                        map.setCenter(pos);
                    },
                    () => {
                        handleLocationError(true, infoWindow, map.getCenter());
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        });
    };
  
    const placeMarker = (location) => {
      if (marker) {
        marker.setPosition(location);
      } else {
        marker = new google.maps.Marker({
          position: location,
          map: map,
        });
      }
    };
  
    onMount(() => {
      if (window.google) {
        initMap();
      } else {
        window.initMap = initMap;
      }
    });
  </script>
  
  <div id="map" style="height: 500px; width: 100%;"></div>
  
  <p>Latitude: {$latitude}</p>
  <p>Longitude: {$longitude}</p>
  
  <style>
    #map {
      height: 150px;
      width: 150px;
    }
  </style>
  