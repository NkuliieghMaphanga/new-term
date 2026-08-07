/* Weather Dashboard — Weatherstack API */

const API_KEY = 'YOUR_WEATHERSTACK_ACCESS_KEY';
const DEFAULT_CITY = 'Johannesburg';
const RECENT_KEY = 'weatherRecentSearches';
const MAX_RECENT = 8;

const $ = (id) => document.getElementById(id);

const ui = {
    form: $('search-form'),
    input: $('city-input'),
    cityName: $('city-name'),
    currentDate: $('current-date'),
    weatherIcon: $('weather-icon'),
    temperature: $('temperature'),
    weatherDescription: $('weather-description'),
    feelsLike: $('feels-like'),
    humidity: $('humidity'),
    windSpeed: $('wind-speed'),
    pressure: $('pressure'),
    sunrise: $('sunrise'),
    sunset: $('sunset'),
    forecastContainer: $('forecast-container'),
    recentSearches: $('recent-searches'),
    loading: $('loading'),
    errorMessage: $('error-message'),
};

function debugLog(hypothesisId, location, message, data = {}) {
    // #region agent log
    fetch('http://127.0.0.1:7533/ingest/6bbe81f5-a88a-4dfb-8ba3-a72a6cac7212', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '3a363b',
        },
        body: JSON.stringify({
            sessionId: '3a363b',
            runId: 'initial',
            hypothesisId,
            location,
            message,
            data,
            timestamp: Date.now(),
        }),
    }).catch(() => {});
    // #endregion
}

function showLoading(show) {
    ui.loading.classList.toggle('hidden', !show);
}

function showError(show, message) {
    ui.errorMessage.classList.toggle('hidden', !show);
    if (message) {
        ui.errorMessage.querySelector('p').textContent = message;
    }
}

function formatDate(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRecentSearch(city) {
    const normalized = city.trim();
    if (!normalized) return;

    const recent = getRecentSearches().filter(
        (item) => item.toLowerCase() !== normalized.toLowerCase()
    );
    recent.unshift(normalized);

    localStorage.setItem(
        RECENT_KEY,
        JSON.stringify(recent.slice(0, MAX_RECENT))
    );

    renderRecentSearches();
}

function renderRecentSearches() {
    const recent = getRecentSearches();
    ui.recentSearches.innerHTML = '';

    if (!recent.length) {
        ui.recentSearches.innerHTML =
            '<p class="search-history-empty">No recent searches yet.</p>';
        return;
    }

    recent.forEach((city) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'search-chip';
        chip.textContent = city;
        chip.addEventListener('click', () => fetchWeather(city));
        ui.recentSearches.appendChild(chip);
    });
}

async function fetchFromWeatherstack(endpoint, city) {
    if (!API_KEY || API_KEY === 'YOUR_WEATHERSTACK_ACCESS_KEY') {
        throw new Error(
            'Add your Weatherstack access key at the top of weatherAPI.js.'
        );
    }

    const url =
        `https://api.weatherstack.com/${endpoint}` +
        `?access_key=${encodeURIComponent(API_KEY)}` +
        `&query=${encodeURIComponent(city)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.error?.info || 'Could not fetch weather data.');
    }

    return data;
}

function updateCurrentWeather(data) {
    const { location, current } = data;

    ui.cityName.textContent = `${location.name}, ${location.country}`;
    ui.currentDate.textContent = formatDate(current.observation_time);
    ui.weatherIcon.src = current.weather_icons?.[0] || '';
    ui.weatherIcon.alt = current.weather_descriptions?.[0] || 'Weather icon';
    ui.temperature.textContent = `${Math.round(current.temperature)}°C`;
    ui.weatherDescription.textContent =
        current.weather_descriptions?.[0] || '—';
    ui.feelsLike.textContent = `${Math.round(current.feelslike)}°C`;
    ui.humidity.textContent = `${current.humidity}%`;
    ui.windSpeed.textContent = `${Math.round(current.wind_speed)} km/h`;
    ui.pressure.textContent = `${current.pressure} mb`;
    ui.sunrise.textContent = '--:--';
    ui.sunset.textContent = '--:--';
}

function renderForecast(forecastDays) {
    ui.forecastContainer.innerHTML = '';

    if (!forecastDays?.length) {
        ui.forecastContainer.innerHTML =
            '<p class="search-history-empty">Forecast unavailable on your API plan.</p>';
        return;
    }

    forecastDays.slice(0, 5).forEach((day) => {
        const card = document.createElement('article');
        card.className = 'forecast-card';

        const date = new Date(day.date);
        const label = date.toLocaleDateString('en-ZA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        card.innerHTML = `
            <h4>${label}</h4>
            <img src="${day.day?.condition?.icon || ''}" alt="">
            <p>${day.day?.condition?.text || '—'}</p>
            <p>${Math.round(day.maxtemp)}° / ${Math.round(day.mintemp)}°</p>
        `;

        ui.forecastContainer.appendChild(card);
    });
}

async function fetchWeather(city) {
    const query = city?.trim();
    if (!query) return;

    showError(false);
    showLoading(true);

    debugLog('H1', 'weatherAPI.js:fetchWeather', 'Fetch started', { city: query });
    debugLog('H3', 'weatherAPI.js:fetchWeather', 'DOM ready check', {
        hasForm: Boolean(ui.form),
        hasForecast: Boolean(ui.forecastContainer),
    });

    try {
        const currentData = await fetchFromWeatherstack('current', query);
        debugLog('H2', 'weatherAPI.js:fetchWeather', 'Current weather success', {
            city: currentData.location?.name,
            temp: currentData.current?.temperature,
        });

        updateCurrentWeather(currentData);
        saveRecentSearch(query);

        try {
            const forecastUrl =
                `https://api.weatherstack.com/forecast` +
                `?access_key=${encodeURIComponent(API_KEY)}` +
                `&query=${encodeURIComponent(query)}` +
                `&forecast_days=5`;

            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            debugLog('H4', 'weatherAPI.js:fetchWeather', 'Forecast response', {
                success: forecastData.success !== false,
                days: forecastData.forecast?.forecastday?.length || 0,
            });

            const forecastDays = forecastData.forecast?.forecastday || [];
            const astro = forecastDays[0]?.astro;
            if (astro) {
                ui.sunrise.textContent = formatTime(astro.sunrise);
                ui.sunset.textContent = formatTime(astro.sunset);
            }

            if (forecastData.success === false) {
                renderForecast([]);
            } else {
                renderForecast(forecastDays);
            }
        } catch {
            renderForecast([]);
        }
    } catch (error) {
        debugLog('H2', 'weatherAPI.js:fetchWeather', 'Fetch failed', {
            message: error.message,
        });
        showError(true, error.message || 'City not found. Please try again.');
    } finally {
        showLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    debugLog('H5', 'weatherAPI.js:DOMContentLoaded', 'Page loaded', {
        recentCount: getRecentSearches().length,
        defaultCity: DEFAULT_CITY,
    });

    ui.form.addEventListener('submit', (event) => {
        event.preventDefault();
        fetchWeather(ui.input.value);
        ui.input.value = '';
    });

    renderRecentSearches();
    fetchWeather(DEFAULT_CITY);
});
