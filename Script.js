alert("Please enter your city name or pincode...");

const apiKey = "cc2cfc3c57000d929f48b8b4b0016ed8";
const geoKey = "cfec4504134640a386ec1f345415c1ff";

const weatherIcon = document.querySelector(".weather-icon");
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

async function getCityFromPincode(pincode) {
    const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${geoKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (geoData.results.length > 0) {
        const loc = geoData.results[0];
        return {
            city: loc.components.city || loc.components.town || loc.components.village || loc.components.state,
            lat: loc.geometry.lat,
            lon: loc.geometry.lng
        };
    } else {
        throw new Error("Invalid pincode");
    }
}

async function checkWeather(input) {
    let weatherUrl;
    let placeName;

    if (/^\d{4,6}$/.test(input)) {
        // If input is a pincode
        try {
            const loc = await getCityFromPincode(input);
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${apiKey}`;
            placeName = loc.town;
        } catch (err) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }
    } else {
        // If input is a city name
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${input}&appid=${apiKey}`;
    }

    const response = await fetch(weatherUrl);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = placeName || data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.src = "Images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "Images/sunny.png";
                break;
            case "Rain":
                weatherIcon.src = "Images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.src = "Images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "Images/mist.png";
                break;
            default:
                weatherIcon.src = "Images/clouds.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchButton.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});
