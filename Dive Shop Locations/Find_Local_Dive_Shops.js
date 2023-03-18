var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 13,
  });
  infoWindow = new google.maps.InfoWindow();

  document.getElementById("find-shops-button").addEventListener("click", function () {
    var zipCode = document.getElementById("zip-code").value;
    findDiveShops(zipCode);
  });

  document.getElementById("use-location-button").addEventListener("click", function () {
    findDiveShopsNearLocation();
  });
}


function findDiveShopsNearLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      searchDiveShops(userLocation);
    }, function () {
      alert("Error: The Geolocation service failed.");
    });
  } else {
    alert("Error: Your browser doesn't support geolocation.");
  }
}

function findDiveShops(zipCode) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: zipCode, componentRestrictions: { postalCode: zipCode } }, function (results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: results[0].geometry.location,
          radius: 15000, // Expand search radius to 15km
          type: ["store"],
          keyword: "scuba shop",
        },
        function (results, status) {
          if (status === "OK") {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }
      );
    } else {
      alert(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}


function searchDiveShops(location) {
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: location,
      radius: 5000,
      type: ["store"],
      keyword: "scuba shop",
    },
    function (results, status) {
      if (status === "OK") {
		  
        map.setCenter(location);
        displayDiveShopsList(results, new google.maps.LatLng(location));

        var highestRatedShop = null;
        var highestRatedMarker = null;

        for (var i = 0; i < results.length; i++) {
          var marker = createMarker(results[i]);

          if (!highestRatedShop || results[i].rating > highestRatedShop.rating) {
            highestRatedShop = results[i];
            highestRatedMarker = marker;
          }
        }

        if (highestRatedShop && highestRatedMarker) {
          var content = '<div><strong>' + highestRatedShop.name + '</strong></div>' +
                        '<div>' + highestRatedShop.vicinity + '</div>' +
                        '<div>Rating: ' + (highestRatedShop.rating || 'N/A') + '</div>';

          if (highestRatedShop.photos) {
            content += '<br><img src="' + highestRatedShop.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '">';
          }

          infoWindow.setContent(content);
          infoWindow.open(map, highestRatedMarker);
        }
      }
    }
  );
}


function displayDiveShopsList(diveShops, userLocation) {
  var listContainer = document.getElementById("dive-shop-list");
  listContainer.innerHTML = ""; // Clear the list container

  var listTitle = document.createElement("h2");
  listTitle.textContent = "Dive Shops Near You:";
  listContainer.appendChild(listTitle);

  var ul = document.createElement("ul");
  listContainer.appendChild(ul);

  for (var i = 0; i < diveShops.length; i++) {
    var li = document.createElement("li");
    li.className = "dive-shop-item";

    // Add information to the left
    var infoDiv = document.createElement("div");
    infoDiv.className = "dive-shop-info";

    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      diveShops[i].geometry.location
    );

    // Convert to miles and round to 2 decimal places
    distance = (distance * 0.000621371).toFixed(2);

    // If the distance is less than 0.5 miles, convert it to feet
    if (distance < 0.5) {
      distance = (distance * 5280).toFixed(0) + " ft";
    } else {
      distance += " mi";
    }

   infoDiv.innerHTML = distance + " - <strong>" + diveShops[i].name + "</strong> - " + (diveShops[i].rating ? diveShops[i].rating.toFixed(1) + " Stars" : 'N/A') + " - " + diveShops[i].vicinity;
    li.appendChild(infoDiv);

    var buttonsDiv = document.createElement("div");
    buttonsDiv.className = "dive-shop-buttons";

    var visitWebsiteBtn = document.createElement("button");
    visitWebsiteBtn.className = "visit-website-btn";
    visitWebsiteBtn.innerHTML = "Visit Website";
    visitWebsiteBtn.setAttribute("data-website", diveShops[i].website);
    visitWebsiteBtn.onclick = function() {
      window.open(this.getAttribute("data-website"), '_blank');
    };
    buttonsDiv.appendChild(visitWebsiteBtn);

    var getDirectionsBtn = document.createElement("button");
    getDirectionsBtn.className = "get-directions-btn";
    getDirectionsBtn.innerHTML = "Get Directions";
    getDirectionsBtn.setAttribute("data-vicinity", diveShops[i].vicinity);
    getDirectionsBtn.onclick = function() {
      window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(this.getAttribute("data-vicinity")), '_blank');
    };
    buttonsDiv.appendChild(getDirectionsBtn);

    li.appendChild(buttonsDiv);
    ul.appendChild(li);
  }
}

function visitWebsite(place) {
  if (place.website) {
    window.open(place.website, '_blank');
  } else {
    alert('Sorry, no website available for this location.');
  }
}


function createShopElement(shop, distance) {
  var div = document.createElement("div");
  div.className = "shop-item";

  var leftDiv = document.createElement("div");
  leftDiv.className = "shop-info";

  var distanceText = document.createElement("span");
  distanceText.className = "shop-distance";
  distanceText.textContent = formatDistance(distance) + " - ";
  leftDiv.appendChild(distanceText);

  var name = document.createElement("strong");
  name.textContent = shop.name;
  leftDiv.appendChild(name);

  var rating = document.createElement("span");
  rating.textContent = " - Rating: " + (shop.rating || "N/A");
  leftDiv.appendChild(rating);

  var address = document.createElement("div");
  address.textContent = shop.vicinity;
  leftDiv.appendChild(address);

  div.appendChild(leftDiv);

  var rightDiv = document.createElement("div");
  rightDiv.className = "shop-buttons";

  if (shop.website) {
    var websiteBtn = document.createElement("button");
    websiteBtn.className = "visit-website-btn";
    websiteBtn.textContent = "Visit Website";
    websiteBtn.onclick = function () {
      window.open(shop.website, "_blank");
    };
    rightDiv.appendChild(websiteBtn);
  } else if (shop.url) {
    var websiteBtn = document.createElement("button");
    websiteBtn.className = "visit-website-btn";
    websiteBtn.textContent = "Visit Website";
    websiteBtn.onclick = function () {
      window.open(shop.url, "_blank");
    };
    rightDiv.appendChild(websiteBtn);
  }

  var directionsBtn = document.createElement("button");
  directionsBtn.className = "get-directions-btn";
  directionsBtn.textContent = "Get Directions";
  directionsBtn.onclick = function () {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(shop.name) +
        "&destination_place_id=" +
        shop.place_id,
      "_blank"
    );
  };
  rightDiv.appendChild(directionsBtn);

  div.appendChild(rightDiv);

  return div;
}



function createMarker(place) {
  var icon = {
    url: 'dive_shop_icon.png', // The URL of your custom icon
    scaledSize: new google.maps.Size(35, 35), // The desired size of the icon
  };

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: icon, // Assign the custom icon object to the marker
  });

  google.maps.event.addListener(marker, "click", function () {
    var content = '<div><strong>' + place.name + '</strong></div>' +
                  '<div>' + place.vicinity + '</div>' +
                  '<div>Rating: ' + (place.rating || 'N/A') + '</div>';

    if (place.photos) {
      content += '<br><img src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '">';
    }

    infoWindow.setContent(content);
    infoWindow.open(map, this);
	 return marker;
  });
}
