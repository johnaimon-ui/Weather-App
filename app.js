const container = document.querySelector('.container');
const searchForm = document.querySelector('.search');
const cityInput = document.querySelector('#city-input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const notFound = document.querySelector('.not-found');
const weatherImage = document.querySelector('.weather-box img');
const temperature = document.querySelector('.weather-box .temperature');
const description = document.querySelector('.weather-box .description');
const humidityValue = document.querySelector('.humidity .text span');
const windValue = document.querySelector('.windy .text span');
const apiKey = '53462b78c1cdbc763f566ef7b48a784d';

function showError(message) {
    notFound.querySelector('p').textContent = message;
    notFound.style.display = 'block';
    notFound.classList.remove('fade-in');

    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    weatherBox.classList.remove('fade-in');
    weatherDetails.classList.remove('fade-in');

    container.style.height = '180px';
    void notFound.offsetWidth;
    notFound.classList.add('fade-in');
}

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) {
        cityInput.focus();
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 404) {
            showError('Oops! Invalid Location');
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || `Weather request failed (${response.status}).`);
        }

        const currentWeather = data.weather && data.weather[0];
        if (!currentWeather || !currentWeather.icon) {
            throw new Error('The weather response did not include an icon.');
        }

        weatherImage.src = `https://openweathermap.org/img/wn/${encodeURIComponent(currentWeather.icon)}@2x.png`;
        weatherImage.alt = `${currentWeather.description} weather`;

        temperature.replaceChildren(document.createTextNode(String(Math.round(data.main.temp))));
        const unit = document.createElement('span');
        unit.textContent = '°C';
        temperature.append(unit);

        description.textContent = currentWeather.description;
        humidityValue.textContent = `${data.main.humidity}%`;
        windValue.textContent = `${Math.round(data.wind.speed * 3.6)} Km/h`;

        notFound.style.display = 'none';
        notFound.classList.remove('fade-in');
        weatherBox.style.display = 'block';
        weatherDetails.style.display = 'flex';
        weatherBox.classList.remove('fade-in');
        weatherDetails.classList.remove('fade-in');
        container.style.height = '590px';
        void weatherBox.offsetWidth;
        weatherBox.classList.add('fade-in');
        weatherDetails.classList.add('fade-in');
    } catch (error) {
        console.error('Unable to retrieve weather data:', error);
        showError('Unable to load weather. Please try again.');
    }
});