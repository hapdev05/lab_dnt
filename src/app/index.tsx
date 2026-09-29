import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WeatherService, WeatherData } from '../services/weather-service';

const { width } = Dimensions.get('window');

const PRESET_CITIES = ['Hanoi', 'Ho Chi Minh', 'Tokyo', 'London', 'New York', 'Paris'];

export default function ClimaScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [currentCity, setCurrentCity] = useState('Hanoi');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = async (city: string) => {
    try {
      setLoading(true);
      const data = await WeatherService.fetchWeatherByCity(city);
      setWeatherData(data);
      setCurrentCity(data.cityName);
    } catch (e) {
      console.log('Error fetching weather', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather('Hanoi');
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    Keyboard.dismiss();
    loadWeather(searchInput.trim());
    setSearchInput('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWeather(currentCity);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 9 • LIVE WEB DATA & REST API</Text>
        </View>
        <Text style={styles.title}>Clima Weather</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search city (e.g. Tokyo, London)..."
          placeholderTextColor="#94A3B8"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.searchButton}
          onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Quick Cities */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsList}>
        {PRESET_CITIES.map((city, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.presetChip,
              currentCity.toLowerCase() === city.toLowerCase() &&
                styles.presetChipActive,
            ]}
            onPress={() => loadWeather(city)}>
            <Text
              style={[
                styles.presetText,
                currentCity.toLowerCase() === city.toLowerCase() &&
                  styles.presetTextActive,
              ]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Weather Content */}
      <ScrollView
        contentContainerStyle={styles.weatherScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#38BDF8"
          />
        }>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={styles.loadingText}>Fetching live weather data...</Text>
          </View>
        ) : weatherData ? (
          <>
            {/* Hero Main Weather Card */}
            <View style={styles.heroCard}>
              <View style={styles.locationHeader}>
                <Text style={styles.cityText}>{weatherData.cityName}</Text>
                {weatherData.country ? (
                  <Text style={styles.countryText}>{weatherData.country}</Text>
                ) : null}
              </View>

              <View style={styles.tempSection}>
                <Text style={styles.weatherIconLarge}>
                  {weatherData.weatherIcon}
                </Text>
                <View style={styles.tempValueWrap}>
                  <Text style={styles.tempLarge}>
                    {weatherData.temperature}°
                  </Text>
                  <Text style={styles.conditionSub}>
                    {weatherData.conditionText}
                  </Text>
                </View>
              </View>

              {/* Message Box */}
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>
                  {weatherData.weatherMessage}
                </Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>FEELS LIKE</Text>
                <Text style={styles.metricValue}>
                  {weatherData.apparentTemperature}°C
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>HUMIDITY</Text>
                <Text style={styles.metricValue}>{weatherData.humidity}%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>WIND</Text>
                <Text style={styles.metricValue}>
                  {weatherData.windSpeed} km/h
                </Text>
              </View>
            </View>

            {/* 5-Day Forecast */}
            <View style={styles.forecastSection}>
              <Text style={styles.forecastTitle}>5-DAY FORECAST</Text>
              <View style={styles.forecastCard}>
                {weatherData.dailyForecast.map((item, index) => (
                  <View key={index} style={styles.forecastRow}>
                    <Text style={styles.forecastDay}>{item.day}</Text>
                    <View style={styles.forecastIconGroup}>
                      <Text style={styles.forecastIcon}>{item.icon}</Text>
                      <Text style={styles.forecastCondition}>
                        {item.condition}
                      </Text>
                    </View>
                    <View style={styles.forecastTemps}>
                      <Text style={styles.tempMax}>{item.tempMax}°</Text>
                      <Text style={styles.tempMin}>{item.tempMin}°</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38BDF8',
    marginBottom: 6,
  },
  badgeText: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchButton: {
    backgroundColor: '#0284C7',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },
  presetsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  weatherScroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 6,
  },
  locationHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cityText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countryText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
    marginTop: 2,
  },
  tempSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
  },
  weatherIconLarge: {
    fontSize: 68,
  },
  tempValueWrap: {
    alignItems: 'flex-start',
  },
  tempLarge: {
    fontSize: 60,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 68,
  },
  conditionSub: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginTop: 10,
  },
  messageText: {
    color: '#E0F2FE',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  forecastSection: {
    marginTop: 16,
  },
  forecastTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  forecastCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  forecastDay: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    width: 60,
  },
  forecastIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  forecastIcon: {
    fontSize: 18,
  },
  forecastCondition: {
    color: '#94A3B8',
    fontSize: 12,
  },
  forecastTemps: {
    flexDirection: 'row',
    gap: 10,
  },
  tempMax: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tempMin: {
    color: '#64748B',
    fontSize: 13,
  },
});
