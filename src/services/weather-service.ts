export interface WeatherData {
  cityName: string;
  country: string;
  temperature: number;
  apparentTemperature: number;
  conditionCode: number;
  conditionText: string;
  weatherIcon: string;
  weatherMessage: string;
  humidity: number;
  windSpeed: number;
  dailyForecast: {
    day: string;
    tempMax: number;
    tempMin: number;
    icon: string;
    condition: string;
  }[];
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number; name: string; country: string }> = {
  hanoi: { lat: 21.0285, lon: 105.8542, name: 'Hanoi', country: 'Vietnam' },
  'ho chi minh': { lat: 10.8231, lon: 106.6297, name: 'Ho Chi Minh City', country: 'Vietnam' },
  london: { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
  tokyo: { lat: 35.6762, lon: 139.6503, name: 'Tokyo', country: 'Japan' },
  'new york': { lat: 40.7128, lon: -74.006, name: 'New York', country: 'United States' },
  paris: { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'France' },
  sydney: { lat: -33.8688, lon: 151.2093, name: 'Sydney', country: 'Australia' },
  singapore: { lat: 1.3521, lon: 103.8198, name: 'Singapore', country: 'Singapore' },
};

export class WeatherService {
  public static getWeatherIcon(code: number): { icon: string; text: string } {
    if (code === 0) return { icon: '☀️', text: 'Clear Sky' };
    if (code === 1 || code === 2) return { icon: '🌤️', text: 'Partly Cloudy' };
    if (code === 3) return { icon: '☁️', text: 'Overcast' };
    if (code >= 45 && code <= 48) return { icon: '🌫️', text: 'Foggy' };
    if (code >= 51 && code <= 55) return { icon: '🌦️', text: 'Drizzle' };
    if (code >= 61 && code <= 67) return { icon: '🌧️', text: 'Rain' };
    if (code >= 71 && code <= 77) return { icon: '🌨️', text: 'Snow' };
    if (code >= 80 && code <= 82) return { icon: '🌧️', text: 'Heavy Showers' };
    if (code >= 95 && code <= 99) return { icon: '⛈️', text: 'Thunderstorm' };
    return { icon: '☀️', text: 'Sunny' };
  }

  public static getWeatherMessage(temp: number, cityName: string): string {
    if (temp > 30) {
      return `It's 🍦 time in ${cityName}! Stay cool and hydrated.`;
    } else if (temp > 22) {
      return `Time for 👕 & 🩳 in ${cityName}. Beautiful weather!`;
    } else if (temp > 12) {
      return `You'll need a 🧥 jacket in ${cityName}.`;
    } else {
      return `Bring a 🧣 scarf & 🧤 gloves in ${cityName}. It is chilly!`;
    }
  }

  public static async fetchWeatherByCity(query: string): Promise<WeatherData> {
    const cleanQuery = query.toLowerCase().trim();
    let lat = 21.0285;
    let lon = 105.8542;
    let cityName = 'Hanoi';
    let country = 'Vietnam';

    // 1. Check known coordinates or use Open-Meteo Geocoding API
    if (CITY_COORDINATES[cleanQuery]) {
      lat = CITY_COORDINATES[cleanQuery].lat;
      lon = CITY_COORDINATES[cleanQuery].lon;
      cityName = CITY_COORDINATES[cleanQuery].name;
      country = CITY_COORDINATES[cleanQuery].country;
    } else {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const first = geoData.results[0];
          lat = first.latitude;
          lon = first.longitude;
          cityName = first.name;
          country = first.country || '';
        }
      } catch (err) {
        console.log('Geocoding fallback', err);
      }
    }

    // 2. Fetch live weather data from Open-Meteo API (Open, Free, No API key required)
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(weatherUrl);
      const data = await res.json();

      const current = data.current;
      const weatherInfo = this.getWeatherIcon(current.weather_code);
      const temp = Math.round(current.temperature_2m);
      const feelsLike = Math.round(current.apparent_temperature);
      const message = this.getWeatherMessage(temp, cityName);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyForecast = (data.daily?.time || []).slice(0, 5).map((t: string, idx: number) => {
        const d = new Date(t);
        const code = data.daily.weather_code[idx];
        const iconInfo = this.getWeatherIcon(code);
        return {
          day: idx === 0 ? 'Today' : daysOfWeek[d.getDay()],
          tempMax: Math.round(data.daily.temperature_2m_max[idx]),
          tempMin: Math.round(data.daily.temperature_2m_min[idx]),
          icon: iconInfo.icon,
          condition: iconInfo.text,
        };
      });

      return {
        cityName,
        country,
        temperature: temp,
        apparentTemperature: feelsLike,
        conditionCode: current.weather_code,
        conditionText: weatherInfo.text,
        weatherIcon: weatherInfo.icon,
        weatherMessage: message,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        dailyForecast,
      };
    } catch (err) {
      // Offline fallback mock data
      return {
        cityName,
        country,
        temperature: 28,
        apparentTemperature: 30,
        conditionCode: 1,
        conditionText: 'Partly Cloudy',
        weatherIcon: '🌤️',
        weatherMessage: this.getWeatherMessage(28, cityName),
        humidity: 65,
        windSpeed: 14,
        dailyForecast: [
          { day: 'Today', tempMax: 29, tempMin: 22, icon: '🌤️', condition: 'Partly Cloudy' },
          { day: 'Tomorrow', tempMax: 30, tempMin: 23, icon: '☀️', condition: 'Sunny' },
          { day: 'Wed', tempMax: 27, tempMin: 21, icon: '🌧️', condition: 'Rain' },
          { day: 'Thu', tempMax: 26, tempMin: 20, icon: '🌦️', condition: 'Showers' },
          { day: 'Fri', tempMax: 28, tempMin: 22, icon: '⛅', condition: 'Cloudy' },
        ],
      };
    }
  }
}
