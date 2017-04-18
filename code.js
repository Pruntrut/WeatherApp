"use strict"

var geo = false;
var celsius = true;
var position = {
    city: "Unknown",
    kelvinTemp: 0,
    temp: "- °C",
    weatherType: "",
    rainfall: "-",
    wind: "- - km/h",
    degrees: 0,
    speed: ""
};

$(document).ready(function() {
    $("#celsiusBtn").on("click", function() {
        celsius = !celsius;

        var tempStr = ""
        if (celsius) {
            tempStr = "°C"
        } else {
            tempStr = "°F"
        }

        $("#celsiusBtn").html(tempStr)
        update();
    });

    getLocation();
});

function update() {
    format();
    getNewBackground();

    $("#city").html(position.city);
    $("#temperature").html(position.temp);
    $("#rainfall").html(position.rainfall);
    $("#wind").html(position.wind);
}

function format() {
    var temp = position.kelvinTemp;
    var degrees = position.degrees;
    var speed = position.speed;
    var headings = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]

    if (celsius) {
        temp = (temp - 273.15).toFixed(1) + " °C";
        speed = (speed * 3.6).toFixed(1) + " km/h"
    } else {
        temp = (temp * (9/5) - 459.67).toFixed(1) + " °F";
        speed = (speed * 1.944).toFixed(1) + " knots"
    }
    position.temp = temp;

    var val = Math.floor((degrees / 22.5) + 0.5);
    position.wind = headings[(val % 16)] + " " + speed;
}

function getNewBackground(i) {
    var weather = position.weatherType
    var imgIndex = 0;
    var urls = [
        "http://www.history.com/s3static/video-thumbnails/AETN-History_VMS/21/201/tdih-feb26-HD.jpg",
        "https://captainkimo.com/wp-content/uploads/2012/10/Clouds-Over-Grand-Teton-Mountains-in-Wyoming.jpg",
        "https://cdn.aarp.net/content/dam/travel/destination-images/wyoming/grand-teton-national-park/1400-grand-teton-national-park-mist.imgcache.rev2e2fece529cac8b42ada0288f1fe8497.web.jpg",
        "https://tau0.files.wordpress.com/2012/07/tetons_stormy_sky.jpg",
        "http://images.nationalgeographic.com/wpf/media-live/photos/000/605/cache/grand-teton-national-park-storm-clouds_60590_990x742.jpg",
        "http://www.jacksonhole.net/blog/wp-content/uploads/2014/09/Grand_Teton_in_Winter-NPS.jpg",
        "http://media.gettyimages.com/videos/storm-clouds-and-rain-over-snowy-grand-teton-and-jackson-lake-wyoming-video-id648018585?s=640x640",
        "https://i.ytimg.com/vi/6h8043y-PwI/maxresdefault.jpg",
        "http://cdn.travelwyoming.com/sites/default/site-files/files/styles/7_4_large/public/1.4-Grand-Teton-1_forweb.jpg?itok=jBPyfymU"
    ]

    switch (weather) {
        case "Clear":
            imgIndex = 0;
            break;
        case "Clouds":
            imgIndex = 1;
            break;
        case "Atmosphere":
            imgIndex = 2;
            break;
        case "Drizzle":
            imgIndex = 3;
            break;
        case "Rain":
            imgIndex = 4;
            break;
        case "Snow":
            imgIndex = 5;
            break;
        case "Thunderstorm":
            imgIndex = 6;
            break;
        case "Extreme":
            imgIndex = 7;
            break;
        default:
            imgIndex = 8;
            break;
    }

    var img;

    if (i) {
        img = urls[i];
    } else {
        img = urls[imgIndex];
    }

    $("html").css("background", "url("+img+") no-repeat center center fixed");
    $("html").css("background-size", "cover");
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getAddress);
    } else {
        alert("Could not retrieve geolocation.");
    }
}

function getAddress(pos) {
    geo = true;

    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDvzIJVHPqj5UiuyeymeRlmrXmH7WjPmAk&language=fr&";
    url = url + "latlng=" + latitude + "," + longitude;

    $.getJSON(url, function(result) {
        if (result.status === "OK") {
            var address = result.results[3].formatted_address;

            position.city = address;
            getWeather(address);
        } else {
            alert("There was an error processing your location, please refresh the page.");
        }
    })
}

function getWeather(address) {
    var url = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?appid=1700acda974679c9da06120d02d863ae&q="
    url = url + address;

    $.getJSON(url, function(result) {
        position.weatherType = result.weather[0].main;
        position.rainfall = capitalise(result.weather[0].description);
        position.kelvinTemp = result.main.temp;
        position.degrees = result.wind.deg;
        position.speed = result.wind.speed;
        update();
    })
}

function capitalise(str) {
    return str[0].toUpperCase() + str.split("").splice(1).join("");
}
