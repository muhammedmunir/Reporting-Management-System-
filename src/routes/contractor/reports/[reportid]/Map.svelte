<script lang="ts">
  import { onMount } from 'svelte';
  export let latitude: number;
  export let longitude: number;

  let map;
  let marker;
  let infoWindow;

  const initMap = () => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      zoom: 15,
    });

    marker = new google.maps.Marker({
      position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      map: map,
    });

    map.addListener('click', () => {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
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

  const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
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

<style>
  #map {
    height: 500px;
    width: 100%;
  }
  .custom-map-control-button {
    background-color: #fff;
    border: 0;
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    margin: 10px;
    padding: 0 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }
</style>
