import { useEffect, useRef, useState } from 'react'
import './App.css'

// ---------- WMO weather code -> label/icon ----------
const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear' },
  1: { label: 'Mainly clear', icon: 'clear' },
  2: { label: 'Partly cloudy', icon: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloudy' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'rain' },
  53: { label: 'Drizzle', icon: 'rain' },
  55: { label: 'Dense drizzle', icon: 'rain' },
  56: { label: 'Freezing drizzle', icon: 'rain' },
  57: { label: 'Dense freezing drizzle', icon: 'rain' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain' },
  71: { label: 'Slight snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain' },
  85: { label: 'Slight snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm with hail', icon: 'storm' },
  99: { label: 'Severe thunderstorm', icon: 'storm' },
}

function weatherInfo(code) {
  return WEATHER_CODES[code] ?? { label: 'Unknown', icon: 'cloudy' }
}

// ---------- Icons ----------
function WeatherIcon({ type, className }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (type) {
    case 'clear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7M18.9 18.9l-1.7-1.7M6.8 6.8L5.1 5.1" />
        </svg>
      )
    case 'fog':
      return (
        <svg {...common}>
          <path d="M6.5 10.5a4 4 0 0 1 7.6-1.8A3.3 3.3 0 0 1 18.5 12" />
          <path d="M3 14h18M3 17.5h18M3 10.5h1.2" />
        </svg>
      )
    case 'rain':
      return (
        <svg {...common}>
          <path d="M6.8 11.2a4.2 4.2 0 0 1 8-1.9A3.6 3.6 0 0 1 18 16.5H6.8a3.3 3.3 0 0 1-.6-6.5Z" />
          <path d="M9 18.5 8 21M13 18.5l-1 2.5M17 18.5l-1 2.5" />
        </svg>
      )
    case 'snow':
      return (
        <svg {...common}>
          <path d="M6.8 11.2a4.2 4.2 0 0 1 8-1.9A3.6 3.6 0 0 1 18 16.5H6.8a3.3 3.3 0 0 1-.6-6.5Z" />
          <path d="M9 18.5v3M9 19.6l1.6.9M9 19.6l-1.6.9M15 18.5v3M15 19.6l1.6.9M15 19.6l-1.6.9" />
        </svg>
      )
    case 'storm':
      return (
        <svg {...common}>
          <path d="M6.8 9.7a4.2 4.2 0 0 1 8-1.9A3.6 3.6 0 0 1 18 14.5H6.8a3.3 3.3 0 0 1-.6-4.8Z" />
          <path d="m13.5 14-2.4 4h2.4l-2 4" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M6.8 11.2a4.2 4.2 0 0 1 8-1.9A3.6 3.6 0 0 1 18 16.5H6.8a3.3 3.3 0 0 1-.6-6.5Z" />
        </svg>
      )
  }
}

// ---------- helpers ----------
function accentForTemp(tempC) {
  if (tempC == null || Number.isNaN(tempC)) return '#6bc9e8'
  const clamped = Math.max(-10, Math.min(40, tempC))
  const t = (clamped + 10) / 50 // 0 (cold) -> 1 (hot)
  const hue = 205 - t * 175 // 205 (blue) -> 30 (amber)
  return `hsl(${hue}, 78%, 62%)`
}

function cToF(c) {
  return (c * 9) / 5 + 32
}

function formatTemp(tempC, unit) {
  if (tempC == null) return '--'
  const v = unit === 'F' ? cToF(tempC) : tempC
  return Math.round(v)
}

function windDirLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 350)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [place, setPlace] = useState({
    name: 'Johannesburg',
    country: 'South Africa',
    latitude: -26.2041,
    longitude: 28.0473,
  })

  const [unit, setUnit] = useState('C')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locating, setLocating] = useState(false)

  const searchWrapRef = useRef(null)

  // close suggestion list on outside click
  useEffect(() => {
    function onClick(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // geocoding search
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) return
    const controller = new AbortController()
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        debouncedQuery
      )}&count=5&language=en&format=json`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => setSuggestions(data.results ?? []))
      .catch((err) => {
        if (err.name !== 'AbortError') setSuggestions([])
      })
    return () => controller.abort()
  }, [debouncedQuery])

  // fetch weather whenever place changes
  useEffect(() => {
    const controller = new AbortController()
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,is_day` +
      `&timezone=auto`

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Weather service unavailable')
        return res.json()
      })
      .then((data) => {
        setWeather(data.current)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError('Could not load weather for this location.')
        setLoading(false)
      })

    return () => controller.abort()
  }, [place])

  function selectPlace(result) {
    setPlace({
      name: result.name,
      country: result.country ?? result.admin1 ?? '',
      latitude: result.latitude,
      longitude: result.longitude,
    })
    setLoading(true)
    setError(null)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        let name = 'Current location'
        let country = ''
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          name = data.city || data.locality || name
          country = data.countryName || ''
        } catch {
          // fall back to generic label silently
        }
        setPlace({ name, country, latitude, longitude })
        setLoading(true)
        setError(null)
        setLocating(false)
      },
      () => {
        setError('Could not access your location.')
        setLocating(false)
      }
    )
  }

  const tempC = weather?.temperature_2m
  const accent = accentForTemp(tempC)
  const info = weather ? weatherInfo(weather.weather_code) : null

  return (
    <div className="app" style={{ '--accent': accent }}>
      <div className="panel">
        <div className="brand-row">
          <div>
            <div className="wordmark">
              Station<span>_weather</span>
            </div>
            <div className="tagline">Live surface conditions</div>
          </div>
        </div>

        <div className="search-row" ref={searchWrapRef}>
          <div className="search-input-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search city…"
              value={query}
              onChange={(e) => {
                const value = e.target.value
                setQuery(value)
                setShowSuggestions(true)
                if (value.trim().length < 2) setSuggestions([])
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((r) => (
                  <button
                    key={r.id}
                    className="suggestion"
                    onClick={() => selectPlace(r)}
                  >
                    {r.name}
                    <small>
                      {[r.admin1, r.country].filter(Boolean).join(', ')}
                    </small>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="icon-btn"
            onClick={useMyLocation}
            disabled={locating}
            title="Use my location"
            aria-label="Use my location"
          >
            {locating ? (
              '…'
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
          </button>
        </div>

        <div className="unit-toggle">
          <button
            className={unit === 'C' ? 'active' : ''}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={unit === 'F' ? 'active' : ''}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>

        {error && <div className="state-message error">{error}</div>}

        {!error && loading && (
          <div className="state-message skeleton">Reading the instruments…</div>
        )}

        {!error && !loading && weather && (
          <>
            <div className="hero">
              <svg className="isobars" viewBox="0 0 420 420" fill="none">
                <circle cx="380" cy="40" r="60" stroke={accent} strokeWidth="1" />
                <circle cx="380" cy="40" r="110" stroke={accent} strokeWidth="1" />
                <circle cx="380" cy="40" r="160" stroke={accent} strokeWidth="1" />
                <circle cx="380" cy="40" r="210" stroke={accent} strokeWidth="1" />
              </svg>

              <div className="hero-content">
                <div className="hero-loc">
                  <span className="condition">{info.label}</span>
                  <span>·</span>
                  <span>
                    {place.name}
                    {place.country ? `, ${place.country}` : ''}
                  </span>
                </div>

                <div className="temp-row">
                  <WeatherIcon type={info.icon} className="weather-icon" />
                  <div>
                    <div className="temp-value">
                      {formatTemp(tempC, unit)}
                      <span className="temp-unit">°{unit}</span>
                    </div>
                    <div className="feels-like">
                      feels like {formatTemp(weather.apparent_temperature, unit)}°{unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="instruments">
              <div className="instrument">
                <div className="instrument-label">
                  Wind
                  <svg
                    className="compass"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transform: `rotate(${weather.wind_direction_10m}deg)` }}
                  >
                    <path d="M12 2 L15 13 L12 10 L9 13 Z" fill="currentColor" stroke="none" />
                    <line x1="12" y1="10" x2="12" y2="20" />
                  </svg>
                </div>
                <div className="instrument-value">
                  {Math.round(weather.wind_speed_10m)}
                  <small>km/h {windDirLabel(weather.wind_direction_10m)}</small>
                </div>
              </div>

              <div className="instrument">
                <div className="instrument-label">Humidity</div>
                <div className="instrument-value">
                  {Math.round(weather.relative_humidity_2m)}
                  <small>%</small>
                </div>
              </div>

              <div className="instrument">
                <div className="instrument-label">Pressure</div>
                <div className="instrument-value">
                  {Math.round(weather.surface_pressure)}
                  <small>hPa</small>
                </div>
              </div>

              <div className="instrument">
                <div className="instrument-label">Precip.</div>
                <div className="instrument-value">
                  {weather.precipitation}
                  <small>mm</small>
                </div>
              </div>
            </div>

            <div className="footer">
              <span>
                Updated{' '}
                {new Date(weather.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
                Data · Open-Meteo
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
