document.getElementById('searchBtn').addEventListener('click', function () {
    const location = document.getElementById('locationInput').value;
    if (location) {
        getWeatherData(location);
        suggestionsList.innerHTML = ''; // Clear suggestions when button is clicked
    } else {
        alert('Please enter a city name!');
    }
});

async function getWeatherData(location) {
    const apiKey = 'bdc9b8f2361046cfb89170511241210'; // Your WeatherAPI key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeatherData(data) {
    const cityName = data.location.name;
    const temperature = `${data.current.temp_c}°C`;
    const conditions = data.current.condition.text;
    const humidity = `Humidity: ${data.current.humidity}%`;
    const windSpeed = `Wind Speed: ${data.current.wind_kph} kph`;

    document.getElementById('cityName').textContent = cityName;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('conditions').textContent = `Conditions: ${conditions}`;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('windSpeed').textContent = windSpeed;

    suggestionsList.innerHTML = ''; // Clear suggestions after displaying weather data
}

const locationInput = document.getElementById('locationInput');
const suggestionsList = document.getElementById('suggestions');

locationInput.addEventListener('input', function () {
    const query = locationInput.value;
    if (query.length >= 2) { // Fetch suggestions only for at least 2 characters
        fetchSuggestions(query);
    } else {
        suggestionsList.innerHTML = ''; // Clear suggestions if query is too short
    }
});

async function fetchSuggestions(query) {
    const apiKey = 'bdc9b8f2361046cfb89170511241210'; // Your WeatherAPI key
    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function displaySuggestions(data) {
    suggestionsList.innerHTML = ''; // Clear previous suggestions
    data.forEach(location => {
        const li = document.createElement('li');
        li.textContent = `${location.name}, ${location.region}, ${location.country}`;
        li.classList.add('suggestion-item');
        li.addEventListener('click', function () {
            locationInput.value = location.name; // Set the input to the selected suggestion
            suggestionsList.innerHTML = ''; // Clear suggestions after selection
            displayWeatherData(location); // Fetch weather data for the selected location
        });
        suggestionsList.appendChild(li);
    });
}
