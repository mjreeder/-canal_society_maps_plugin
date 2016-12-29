$ = jQuery;
// list to hold the markers of the map(google api)
var markers = [];
// list to hold the point objects(wordpress)
var points = [];
// google maps api map object
var map;
// object to to hold the user selected map point(from wordpress, images, content, etc)
var currentSelectedMapPoint = {};
// object to hold the info for the jquery slider
var currentSlideInfo = {};
// variable to define the google maps api zoom level
var maxZoomLevel = 6;
// json object that holds all of the important information on each canal point including:
  // name, kml layer, points, markers, and whether it was a completed canal
var canalPointKmlDictionary;
// variable to hold the current jquery slider index
var slideCounter = 0;
//list of objects that holds kml file, points associated with canal


window.onload = function() {
  // the jquery slider object and options
  $('.slider').slick({
    slidesToShow: 1,
    fade: true,
    arrows: true,
    dots: true,
    autoplaySpeed: 2000,
    infinite: true,
    cssEase: 'linear'
  });

  //change the sliders content when there is a change
  $('.slider').on('afterChange', function(event, slick, direction) {
    setInfoContent();
  });

  //change the sliders content when there is a change(touch screens)
  $('.slider').on('swipe', function(event, slick, direction) {
    setInfoContent();
  });

}

//called through the google maps api on the index.php
function initMap() {

  //google maps api with options and snazy maps styling
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: maxZoomLevel,
    navigationControl: false,
    mapTypeControl: false,
    draggable: true,
    zoomControl: true,
    scaleControl: false,
    scrollwheel: false,
    streetViewControl: false,
    disableDoubleClickZoom: true,
    center: new google.maps.LatLng(39.7683333, -86.1580556),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
      "featureType": "administrative",
      "elementType": "labels.text",
      "stylers": [{
        "color": "#ffffff"
      }, {
        "weight": "0.01"
      }]
    }, {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "administrative",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "gamma": "0.00"
      }, {
        "saturation": "-100"
      }, {
        "color": "#ffffff"
      }]
    }, {
      "featureType": "administrative.country",
      "elementType": "labels.icon",
      "stylers": [{
        "color": "#ff9300"
      }]
    }, {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#ff9300"
      }]
    }, {
      "featureType": "administrative.province",
      "elementType": "labels.text",
      "stylers": [{
        "weight": "0.01"
      }]
    }, {
      "featureType": "administrative.locality",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [{
        "weight": "0.01"
      }]
    }, {
      "featureType": "administrative.locality",
      "elementType": "labels.icon",
      "stylers": [{
        "color": "#ff9300"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text",
      "stylers": [{
        "weight": "0.01"
      }]
    }, {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.icon",
      "stylers": [{
        "color": "#ff9300"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{
        "color": "#777777"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "landscape.man_made",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels",
      "stylers": [{
        "color": "#ff9300"
      }]
    }, {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#999999"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }, {
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.highway.controlled_access",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{
        "color": "#a7f5ff"
      }, {
        "visibility": "on"
      }]
    }]
  });

  canalPointKmlDictionary = [{
    'name': 'Central Canal Complete',
    'layer': new google.maps.KmlLayer({
      url: centralCanalCompleteKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true
  }, {
    'name': 'Central Canal Incomplete',
    'layer': new google.maps.KmlLayer({
      url: centralCanalInCompleteKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': false
  }, {
    'name': 'Cross Cut Canal',
    'layer': new google.maps.KmlLayer({
      url: crossCutCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true

  }, {
    'name': 'Erie and Michigan Canal Incomplete',
    'layer': new google.maps.KmlLayer({
      url: erieMichiganCanalInCompleteKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': false

  }, {
    'name': 'Erie and Michigan Canal Complete',
    'layer': new google.maps.KmlLayer({
      url: erieMichiganCanalCompleteKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true

  }, {
    'name': 'Ohio Falls Canal',
    'layer': new google.maps.KmlLayer({
      url: ohioFallsCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': false

  }, {
    'name': 'Whitewater Erie Canal',
    'layer': new google.maps.KmlLayer({
      url: whitewaterErieCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true

  }, {
    'name': 'Wabash and Erie Canal',
    'layer': new google.maps.KmlLayer({
      url: wabashErieCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true
  }, {
    'name': 'Richmond and Brookville Canal',
    'layer': new google.maps.KmlLayer({
      url: richmondBrookvilleCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': false
  }, {
    'name': 'Miami and Erie Canal Complete',
    'layer': new google.maps.KmlLayer({
      url: miamiAndErieCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true
  },
  {
    'name': 'Hagerstown Canal',
    'layer': new google.maps.KmlLayer({
      url: hagerstownCanalKml,
      map: map,
      preserveViewport: true
    }),
    'points': [],
    'markers': [],
    'completed': true
  }];


  // loop over mapdata pulled from the index php file
  // init set all the markers to map
  for (var i = 0; i < mapData.length; i++) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(mapData[i].latitude, mapData[i].longitude),
      map: map,
    });
    markers.push(marker);
    points.push(mapData[i]);
    populateDictionary(mapData[i], marker);

  }
  setMap();
}
function populateDictionary(mapdataPoint, marker){
  //loop over each mapdata object and add appropriate data to the dictionary
  for (key in mapdataPoint.canalPoint) {
    if (mapdataPoint.canalPoint[key].name == 'Central Canal Complete') {
      canalPointKmlDictionary[0].markers.push(marker);
      canalPointKmlDictionary[0].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Central Canal Incomplete') {
      canalPointKmlDictionary[1].markers.push(marker);
      canalPointKmlDictionary[1].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Cross Cut Canal') {
      canalPointKmlDictionary[2].markers.push(marker);
      canalPointKmlDictionary[2].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Erie and Michigan Canal Incomplete') {
      canalPointKmlDictionary[3].points.push(mapdataPoint);
      canalPointKmlDictionary[3].markers.push(marker);
    } else if (mapdataPoint.canalPoint[key].name == 'Erie and Michigan Canal Complete') {
      canalPointKmlDictionary[4].markers.push(marker);
      canalPointKmlDictionary[4].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Ohio Falls Canal') {
      canalPointKmlDictionary[5].markers.push(marker);
      canalPointKmlDictionary[5].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Whitewater Erie Canal') {
      canalPointKmlDictionary[6].markers.push(marker);
      canalPointKmlDictionary[6].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Wabash and Erie Canal') {
      canalPointKmlDictionary[7].markers.push(marker);
      canalPointKmlDictionary[7].points.push(mapdataPoint);
    } else if (mapdataPoint.canalPoint[key].name == 'Richmond and Brookville Canal') {
      canalPointKmlDictionary[8].markers.push(marker);
      canalPointKmlDictionary[8].points.push(mapdataPoint);
    }
    else if (mapdataPoint.canalPoint[key].name == 'Miami and Erie Canal') {
      canalPointKmlDictionary[9].markers.push(marker);
      canalPointKmlDictionary[9].points.push(mapdataPoint);
    }
    else if (mapdataPoint.canalPoint[key].name == 'Hagerstown Canal') {
      canalPointKmlDictionary[10].markers.push(marker);
      canalPointKmlDictionary[11].points.push(mapdataPoint[i]);
    }
  }
}

function setMap() {
  var marker;
  for (var i = 0; i < markers.length; i++) {
    marker = markers[i];
    // when map marker is clicked, set the appropriate information
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        //get point info from the points eg. images captions etc
        currentSelectedMapPoint = points[i];
        // promise that removes slides, called before adding the new informatin
        var removeSlidesPromise = new Promise(function(resolve, reject) {
          // remove slides before adding new ones
          // hacky solution in that slides need to be remove three times? no solution found
          $('#point-info').html(currentSelectedMapPoint.content);
          $('#point-title').text(currentSelectedMapPoint.title);

          if (slideCounter > 0) {
            for (var j = 0; j < 3; j++) {
              for (var i = 0; i < slideCounter; i++) {
                $('.slider').slick('slickRemove', i);
              }
            }
            $('#info').text('');
            resolve('removed')
          } else {
            resolve("slides are empty");
          }
        });

        // remove slides and add new information
        removeSlidesPromise.then(function(val) {
          $("html, body").animate({ scrollTop: $(document).height() }, "slow");
          for (var i = 0; i < currentSelectedMapPoint.images.length; i++) {
            $('.slider').slick('slickAdd', '<div><img id="slide_image" src="' + currentSelectedMapPoint.images[i].url + '"></div>');
            currentSlideInfo[i] = currentSelectedMapPoint.images[i].caption;
            //force first info text, setInfoContent waits on slide change
            if ($('.slider').slick('slickCurrentSlide') == 0) {
              $('#info').html(currentSlideInfo[0].replace(/(?:\r\n|\r|\n)/g, '<br />'));
            }
          }
        });
        //reset slide counter for next point
        slideCounter = currentSelectedMapPoint.images.length;
      }
    })(marker, i));
  }
}

function setInfoContent() {
  //get the current slick slide, and replace
  var currentSlide = $('.slider').slick('slickCurrentSlide');
  $('#info').html(currentSlideInfo[currentSlide].replace(/(?:\r\n|\r|\n)/g, '<br />'));
}

//function to remove all markers
function clearMarkers() {
  setMapOnAll(null);
}

function showMarkers() {
  setMapOnAll(map);
}

//function to get all markers back onto the map
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//function that will display only the map points and kmls that are associated with
// canals that are determined to be completed from the canalPointKmlDictionary
function viewComplete() {
  removeAllKmlLayers();
  var markersList = [];
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    if (canalPointKmlDictionary[i].completed == true) {
      canalPointKmlDictionary[i].layer.setMap(map);
      markersList.push(canalPointKmlDictionary[i].name);
    }
  }
  filterMultiCanalPoints(markersList);
}

// function that will display only the map points and kmls that are associated with
// canals that are determined to be not completed from the canalPointKmlDictionary
function viewProposed() {
  removeAllKmlLayers();
  var markersList = [];
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    if (canalPointKmlDictionary[i].completed == false) {
      canalPointKmlDictionary[i].layer.setMap(map);
      markersList.push(canalPointKmlDictionary[i].name);
    }
  }
  filterMultiCanalPoints(markersList);
}

// function to remove every point and layer from the map
function removeAll() {
  removeAllKmlLayers();
  removeSliderImages();
  filterCanalPoints('');
}

//function to get the default view back, all kml layers and all points
function viewAll() {
  removeAllKmlLayers();
  showMarkers();
  canalPointKmlDictionary[0].layer = new google.maps.KmlLayer({
    url: centralCanalCompleteKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[1].layer = new google.maps.KmlLayer({
    url: centralCanalInCompleteKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[2].layer = new google.maps.KmlLayer({
    url: crossCutCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[3].layer = new google.maps.KmlLayer({
    url: erieMichiganCanalInCompleteKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[4].layer = new google.maps.KmlLayer({
    url: erieMichiganCanalCompleteKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[5].layer = new google.maps.KmlLayer({
    url: ohioFallsCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[6].layer = new google.maps.KmlLayer({
    url: whitewaterErieCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[7].layer = new google.maps.KmlLayer({
    url: wabashErieCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[8].layer = new google.maps.KmlLayer({
    url: richmondBrookvilleCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[9].layer = new google.maps.KmlLayer({
    url: miamiAndErieCanalKml,
    map: map,
    preserveViewport: true
  });
  canalPointKmlDictionary[10].layer = new google.maps.KmlLayer({
    url: hagerstownCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to remove all kml layers
function removeAllKmlLayers() {
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    canalPointKmlDictionary[i].layer.setMap(null);
  }
}

//function to display only the central completed canal
function viewCentralCompletedCanal() {
  filterCanalPoints('Central Canal Complete');
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[0].layer = new google.maps.KmlLayer({
    url: centralCanalCompleteKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the central Incomplete canal
function viewCentralInCompleteCanal() {
  filterCanalPoints('Central Canal Incomplete');
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[1].layer = new google.maps.KmlLayer({
    url: centralCanalInCompleteKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the miami and erie canal
function viewMiamiAndErieCanal() {
  filterCanalPoints('Miami and Erie Canal Complete');
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[9].layer = new google.maps.KmlLayer({
    url: miamiAndErieCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the cross cut canal
function viewCrossCutCanal() {
  filterCanalPoints('Cross Cut Canal');
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[2].layer = new google.maps.KmlLayer({
    url: crossCutCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the erie and michigan Complete canal
function viewErieMichiganCompleteCanal() {
  filterCanalPoints('Erie and Michigan Canal Complete');
  removeAllKmlLayers();
  removeSliderImages();
  //add appropriate kml layer
  canalPointKmlDictionary[4].layer = new google.maps.KmlLayer({
    url: erieMichiganCanalCompleteKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the erie and michigan Incomplete canal
function viewErieMichiganIncompleteCanal() {
  filterCanalPoints('Erie and Michigan Canal Incomplete');
  removeAllKmlLayers();
  removeSliderImages();
  //add appropriate kml layer
  canalPointKmlDictionary[3].layer = new google.maps.KmlLayer({
    url: erieMichiganCanalInCompleteKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the ohio falls canal
function viewOhioFallsCanal() {
  filterCanalPoints('Ohio Falls Canal');
  removeAllKmlLayers();
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[5].layer = new google.maps.KmlLayer({
    url: ohioFallsCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the Richmond Brookville canal
function viewRichmondBrookvilleCanal() {
  filterCanalPoints('Richmond and Brookville Canal');
  removeAllKmlLayers();
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[8].layer = new google.maps.KmlLayer({
    url: richmondBrookvilleCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the Hagerstown canal
function viewHagerstownCanal() {
  filterCanalPoints('Hagerstown Canal');
  removeAllKmlLayers();
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[10].layer = new google.maps.KmlLayer({
    url: hagerstownCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the wabash and erie canal
function viewWabashErieCanal() {
  filterMultiCanalPoints(['Wabash and Erie Canal', 'Cross Cut Canal']);
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[7].layer = new google.maps.KmlLayer({
    url: wabashErieCanalKml,
    map: map,
    preserveViewport: true
  });

  //part of wabash/erie
  canalPointKmlDictionary[2].layer = new google.maps.KmlLayer({
    url: crossCutCanalKml,
    map: map,
    preserveViewport: true
  });
}

// function to display only the Whitewater erie canal
function viewWhitewaterErieCanal() {
  filterCanalPoints('Whitewater Erie Canal');
  removeSliderImages();
  removeAllKmlLayers();
  //add appropriate kml layer
  canalPointKmlDictionary[6].layer = new google.maps.KmlLayer({
    url: whitewaterErieCanalKml,
    map: map,
    preserveViewport: true
  });
}

//function to display only the canal points by canal name or a relatedCanal
function filterCanalPoints(canalName) {
  // remove all current markers
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    for (var j = 0; j < canalPointKmlDictionary[i].markers.length; j++) {
      canalPointKmlDictionary[i].markers[j].setMap(null);
    }
  }

  //display appropriate markers
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    if (canalPointKmlDictionary[i].name == canalName) {
      for (var j = 0; j < canalPointKmlDictionary[i].markers.length; j++) {
        canalPointKmlDictionary[i].markers[j].setMap(map);
      }
    }
  }
}


function filterMultiCanalPoints(markersList) {
  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    for (var j = 0; j < canalPointKmlDictionary[i].markers.length; j++) {
      canalPointKmlDictionary[i].markers[j].setMap(null);
    }
  }

  for (var i = 0; i < canalPointKmlDictionary.length; i++) {
    if (markersList.indexOf(canalPointKmlDictionary[i].name) !== -1) {
      for (var j = 0; j < canalPointKmlDictionary[i].markers.length; j++) {
        canalPointKmlDictionary[i].markers[j].setMap(map);
      }
    }
  }

}

//function to remove the slick slider images
function removeSliderImages() {
  if (slideCounter > 0) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < slideCounter; i++) {
        $('.slider').slick('slickRemove', i);
      }
    }
  }
  $('#info').text('');
  slideCounter = 0;
}
