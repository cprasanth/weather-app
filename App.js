import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { fetchLocationId, fetchWeather } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import SearchInput from './components/SearchInput';

export default App = () => {
  const [location, setLocation] = useState('San Francisco');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleUpdateLocation = async (loc) => {
    setLoading(true);
    try {
      const locationId = await fetchLocationId(loc);
      const { location, weather, temperature } = await fetchWeather(locationId);
      setLocation(location);
      setWeather(weather);
      setTemperature(temperature);
      setError(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };
  useEffect(() => {
    handleUpdateLocation(location);
  }, [location]);

  return (
    <KeyboardAvoidingView style={styles.container} behaviour='height'>
      <StatusBar barStyle='light-content' />
      <ImageBackground
        source={getImageForWeather(weather)}
        style={styles.imageContainer}
        imageStyle={styles.image}
      >
        <View style={styles.detailsContainer}>
          <ActivityIndicator animating={loading} color='white' size='large' />
          {!loading && (
            <View>
              {error ? (
                <Text style={[styles.smallText, styles.textStyle]}>
                  Could not load weather, please try again.
                </Text>
              ) : (
                <View>
                  <Text style={[styles.largeText, styles.textStyle]}>
                    {location}
                  </Text>
                  <Text style={[styles.smallText, styles.textStyle]}>
                    {weather}
                  </Text>
                  <Text
                    style={[styles.largeText, styles.textStyle]}
                  >{`${temperature}°`}</Text>
                </View>
              )}
            </View>
          )}
          <SearchInput placeholder='Search any city' onSubmit={setLocation} />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#666',
    color: 'white',
    height: 40,
    width: 600,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
});
