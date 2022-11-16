/* global google */

(function ($) {

    if ($("#f-map").length < 1) { return; }

    // run file googlemap
    $("#google-map").attr("src", $("#google-map").attr("data-src"));
    $("#google-map").on("load", initMap);

    var marker;
    var markers = [];
    var markerlocation, map, dataMarkerAll, dataMarkerPage = 0, dataMarkerHold = false;
    var $mapdiv = $("#f-map");
    var json = $mapdiv.data("json");
    var iconurl = $mapdiv.data("icon");
    var siteurl = $mapdiv.data("url");
    var $input = $("#input-text");
    var $btnclick = $("#btn-stockist-search");
    var infowindow;
    var stylesGoogleMap = [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "-100" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": "50" }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-100" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "all", "stylers": [{ "lightness": "30" }] }, { "featureType": "road.local", "elementType": "all", "stylers": [{ "lightness": "40" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "lightness": -25 }, { "saturation": -100 }] }];

    var catename = {
        caf: "Café",
        gro: "Grocer",
        sup: "Supermarket",
        ind: "Independent Supermarket",
        hea: "Health Food Store"
    };

    function renderMarker(data) {
        $.each(data, function (i, item) {
            marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(item.lat, item.lng),
                icon: {
                    url: iconurl,
                    scaledSize: new google.maps.Size(30, 40)
                }
            });
            markers.push(marker);
            var index = dataMarkerPage * 100 + i;
            google.maps.event.addListener(marker, 'click', (function (marker, index) {
                return function () {
                    map.setCenter(marker.getPosition());
                    infowindow.setContent('<div class="flourish-infomap"><h5>' + item.locname + '</h5>' + '<p>' + item.address + '</p>' + (item.phone ? '<p><b>P. </b>' + item.phone + '</p>' : '') + (item.openhours ? '<p><b>H. </b>' + item.openhours + '</p>' : '') + '</div>');
                    infowindow.open(map, marker);
                    $(".item-add-result.selected").removeClass("selected");
                    $(".item-add-result").eq(index).addClass("selected");
                };
            })(marker, index));
            $("#list-add-result").append("<div class='item-add-result' data-marker='" + (index) + "'><div class='info'><h5>" + item.locname + "</h5><p>" + item.address + "</p><p><b>P.</b> " + item.phone + "</p><span>" + item.distance + "km</span></div></div>");
        });
    }

    function initMap() {
        var latlng = new google.maps.LatLng(json.lat, json.lng);
        var myOptions = {
            zoom: 11,
            center: latlng,
            styles: stylesGoogleMap,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($mapdiv[0], myOptions);
        infowindow = new google.maps.InfoWindow();

        //Location Lookup
        var input = $("#input-text")[0], autocomplete;
        (function pacSelectFirst(input) {
            // store the original event binding function
            var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;
            function addEventListenerWrapper(type, listener) {
                if (type == "keydown") {
                    var orig_listener = listener;
                    listener = function (event) {
                        var suggestion_selected = $(".pac-item-selected").length > 0;
                        if (event.which == 13 && !suggestion_selected) {
                            var simulated_downarrow = $.Event("keydown", {
                                keyCode: 40,
                                which: 40
                            });
                            orig_listener.apply(input, [simulated_downarrow]);
                        }
                        orig_listener.apply(input, [event]);
                    };
                }
                _addEventListener.apply(input, [type, listener]);
            }
            input.addEventListener = addEventListenerWrapper;
            input.attachEvent = addEventListenerWrapper;
            autocomplete = new google.maps.places.Autocomplete(input, {
                types: ['(regions)'],
                componentRestrictions: {
                    country: 'au'
                }
            });
        })(input);

        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            markerlocation = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: {
                    url: iconurl,
                    scaledSize: new google.maps.Size(35, 45)
                }
            });

            $btnclick.text("SEARCHING...");
            $.get(siteurl, function (data) {

                data.forEach(function (loc) {
                    loc.distance = Math.round(distanceCalc([loc.lat, loc.lng], [place.geometry.location.lat(), place.geometry.location.lng()]));
                });
                data.sort(function (a, b) { return a.distance - b.distance; });
                dataMarkerAll = data;
                // Just show 100 skockist nearest
                data = data.slice(0, 100);
                $("#list-add-result").html("");
                renderMarker(data);

                $input.attr("disabled", "");
                $btnclick.text("CHANGE");
                $btnclick.addClass("is-show");
                $("#btn-submit-search").addClass('is-show');
                setTimeout(function () {
                    $("#box-result").animate({
                        height: $("#box-result .wrap-ani").outerHeight(true)
                    }, 500);
                }, 500);


                if (place.geometry.viewport) {
                    var firstItem = data[0];
                    if (!firstItem) { map.setZoom(4); return; }
                    map.setCenter(new google.maps.LatLng(parseFloat(firstItem.lat), parseFloat(firstItem.lng)));
                    google.maps.event.trigger(markers[0], 'click');
                    if (data[1] && data[1].distance < 40) { map.setZoom(12); }
                    else if (data[1] && data[1].distance < 100) { map.setZoom(8); }
                    else { map.setZoom(4); }
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(12);
                }

            }).fail(function () {
                console.log('error');
            });

        });

        $(".form-find-a-stoctlist").on("click", ".item-add-result", function () {
            var markerID = $(this).data().marker;
            google.maps.event.trigger(markers[markerID], 'click');
            map.setZoom(12);
        });
        $(".form-find-a-stoctlist form").on("submit", function (e) {
            e.preventDefault();
        });
        $('.list-add-result').scrollbar({
            "onScroll": function (y, x) {
                if (y.scroll + 1000 > y.maxScroll) {
                    if ($('.list-add-result .item-add-result').length > 4) {
                        if (dataMarkerHold || !dataMarkerAll) { return; }
                        dataMarkerHold = true;
                        setTimeout(function () {
                            dataMarkerHold = false;
                        }, 1200);
                        dataMarkerPage++;
                        var dt = dataMarkerAll.slice(dataMarkerPage * 100, dataMarkerPage * 100 + 100);
                        renderMarker(dt);
                    }
                }
            }
        });
        var exit_view_result = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = new Array();
            if (markerlocation) { markerlocation.setMap(null); }
            $("#list-add-result").html("");
            $(".form-find-a-stoctlist").removeClass("show-result");
            setTimeout(function () {
                $input.focus().select();
            }, 500);
        };
        $btnclick.on('click', function (e) {
            if (!$(this).hasClass("is-show")) {
                $input.focus().simulate('keydown', {
                    keyCode: 40
                }).simulate('keydown', {
                    keyCode: 13
                });

            } else {
                var latlng = new google.maps.LatLng(json.lat, json.lng);
                $input.removeAttr("disabled").val("").focus();
                $btnclick.removeClass('is-show').html("SEARCH");
                $("#box-result").animate({
                    height: 0
                }, 500);
                if (markerlocation) {
                    markerlocation.setMap(null);
                    map.setCenter(latlng);
                    map.setZoom(11);
                    exit_view_result();
                }
            }
        });

        // Function ESC
        $(document).keyup(function (e) {
            if (e.keyCode == 27 && $btnclick.hasClass('is-show')) {
                $btnclick.trigger("click");

            }
        });

        // TOGGLE ONLINE STOCKIST
        $(".search-stockist .toggle-stockist").on("click", function (e) {
            e.preventDefault();
            if ($(".form-online-stoctlist").hasClass("d-none")) {
                $(".form-find-a-stoctlist").addClass("d-none");
                $(".form-online-stoctlist").removeClass("d-none");
                $btnclick.trigger("click");
            }
            else {
                $(".form-find-a-stoctlist").removeClass("d-none");
                $(".form-online-stoctlist").addClass("d-none");
                $input.focus();
            }
        });
    }

    function distanceCalc(coords1, coords2) {
        function toRad(x) {
            return x * Math.PI / 180;
        }

        var lon1 = coords1[0];
        var lat1 = coords1[1];

        var lon2 = coords2[0];
        var lat2 = coords2[1];

        var R = 6371; // km

        var x1 = lat2 - lat1;
        var dLat = toRad(x1);
        var x2 = lon2 - lon1;
        var dLon = toRad(x2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
    }

})(jQuery);