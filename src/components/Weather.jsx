import React, { useEffect, useRef, useState } from 'react';

// Import all necessary image assets
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {

  // useRef hook to create a reference to the input element
  // This allows direct access to the input's DOM node (e.g., its value)
  const inputRef = useRef();

  // useState hook to manage the weather data
  // weatherData will hold the fetched information (humidity, windSpeed, temperature, location, icon)
  // It's initialized to 'null' (or 'false' in your original code) to indicate no data is loaded yet.
  const [weatherData, setWeatherData] = useState(null);

  // useState hook to manage the loading state
  // true when data is being fetched, false otherwise.
  const [isLoading, setIsLoading] = useState(false);

  // useState hook to manage any error messages
  // Will store a string message if an error occurs during fetching.
  const [error, setError] = useState(null);

  // An object mapping OpenWeatherMap API icon codes to local image assets
  // This allows displaying the correct visual based on the weather condition.
  const allIcons = {
    "01d": clear_icon, // Clear sky (day)
    "01n": clear_icon, // Clear sky (night)
    "02d": cloud_icon, // Few clouds (day)
    "02n": cloud_icon, // Few clouds (night)
    "03d": cloud_icon, // Scattered clouds
    "03n": cloud_icon, // Scattered clouds
    "04d": drizzle_icon, // Broken clouds / Overcast clouds
    "04n": drizzle_icon, // Broken clouds / Overcast clouds
    "09d": rain_icon,    // Shower rain
    "09n": rain_icon,    // Shower rain
    "10d": rain_icon,    // Rain (day)
    "10n": rain_icon,    // Rain (night)
    "13d": snow_icon,    // Snow
    "13n": snow_icon,    // Snow
    // You might consider adding a default fallback icon for any unmapped codes
  };

  /**
   * Asynchronous function to fetch weather data for a given city.
   * @param {string} city - The name of the city to search for.
   */
  const search = async (city) => {
    // Input validation: If the city name is empty, show an error and stop.
    if (city === "") {
      setError('Please enter a city name.');
      setWeatherData(null); // Clear any previously displayed weather data
      return;
    }

    // Set loading state to true and clear any previous errors before starting the fetch.
    setIsLoading(true);
    setError(null);

    try {
      // Construct the API URL using the city name, metric units, and the API key.
      // VITE_APP_ID is an environment variable for security (not exposed directly in source code).
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      // Fetch data from the OpenWeatherMap API.
      const response = await fetch(url);
      // Parse the JSON response body.
      const data = await response.json();

      // Check if the HTTP response was NOT okay (e.g., 404 Not Found, 401 Unauthorized).
      if (!response.ok) {
        // Display the error message from the API, or a generic one if not provided.
        setError(data.message || 'Could not fetch weather data. Please check the city name.');
        setWeatherData(null); // Clear weather data on error
        return;
      }

      // Determine the correct weather icon based on the API's icon code.
      // Uses `allIcons` map, with `clear_icon` as a fallback.
      const icon = allIcons[data.weather[0].icon] || clear_icon;

      // Update the weatherData state with the fetched and processed information.
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp), // Round temperature to nearest integer
        location: data.name,
        icon: icon,
      });

    } catch (error) {
      // Catch any network errors or issues during the fetch operation.
      console.error('Error in fetching weather data:', error);
      setError('Failed to connect to the weather service. Please check your internet connection.');
      setWeatherData(null); // Clear weather data on fetch error
    } finally {
      // This block always executes, regardless of try or catch.
      // Set loading state back to false once the operation is complete (success or failure).
      setIsLoading(false);
    }
  };

  // useEffect hook to perform side effects (like data fetching)
  // The empty dependency array `[]` means this effect runs only once after the initial render.
  useEffect(() => {
    // Call search for a default city (e.g., 'New Delhi') when the component mounts.
    // This provides initial weather information to the user.
    search('New Delhi');
  }, []); // Empty dependency array ensures it runs only once on mount.

  // The component's JSX (UI) structure
  return (
    // Main container div for the weather app, styled with Tailwind CSS for layout and appearance.
    // place-self-center: Centers the item within its grid/flex parent.
    // p-8 sm:p-20: Padding, responsive for small screens (sm:).
    // rounded-xl: Rounded corners.
    // bg-gradient-to-r from-purple-700 to-purple-900: Purple gradient background.
    // flex flex-col items-center: Flex container, column direction, items centered horizontally.
    // shadow-lg: Large box shadow for depth.
    <div className="place-self-center p-8 sm:p-20 rounded-xl bg-gradient-to-r from-purple-700 to-purple-900 flex flex-col items-center shadow-lg">

      {/* Search Input and Icon Section */}
      <div className="flex items-center gap-4 sm:gap-12 mb-8">
        {/* Input field for city name */}
        <input
          ref={inputRef} // Connects this input element to the inputRef
          className="h-12 sm:h-18 border-none outline-none rounded-lg pl-4 sm:pl-6 bg-white text-base sm:text-lg text-gray-800 focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="Search city"
          // Event handler for key presses: if 'Enter' is pressed, call the search function.
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              search(inputRef.current.value);
            }
          }}
        />
        {/* Search icon, clickable to trigger search */}
        <img
          className="w-10 sm:w-12 p-2 sm:p-4 rounded-xl bg-white cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => search(inputRef.current.value)} // Call search function on click
          src={search_icon}
          alt="Search" // Alt text for accessibility
        />
      </div>

      {/* Conditional Rendering for Loading and Error Messages */}
      {isLoading && <p className="text-white text-lg mb-4">Loading weather data...</p>}
      {error && <p className="text-red-300 text-lg mb-4">{error}</p>}

      {/* Conditional Rendering for Weather Data Display */}
      {/* This block only renders if weatherData is not null (i.e., data has been successfully fetched) */}
      {weatherData && (
        <> {/* React Fragment to group multiple elements without adding an extra DOM node */}
          {/* Weather Icon */}
          <img
            className="w-32 sm:w-48 mb-6 animate-fade-in" // Styling and animation
            src={weatherData.icon}
            alt="Weather Icon"
          />
          {/* Temperature Display */}
          <p className="text-purple-300 text-6xl sm:text-7xl leading-none font-bold mb-2">
            {weatherData.temperature}°C
          </p>
          {/* Location Display */}
          <p className="text-yellow-200 text-3xl sm:text-4xl font-medium mb-8">
            {weatherData.location}
          </p>

          {/* Humidity and Wind Speed Information Section */}
          <div className="w-full flex justify-around sm:justify-between items-center px-4 sm:px-0">
            {/* Humidity Display */}
            <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <img className="w-8 sm:w-10" src={humidity_icon} alt="Humidity" />
              <div>
                <p className="text-white text-lg sm:text-xl font-semibold">{weatherData.humidity}%</p>
                <span className="block text-white text-xs sm:text-sm">Humidity</span>
              </div>
            </div>
            {/* Wind Speed Display */}
            <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <img className="w-8 sm:w-10" src={wind_icon} alt="Wind Speed" />
              <div>
                <p className="text-white text-lg sm:text-xl font-semibold">{weatherData.windSpeed} km/h</p>
                <span className="block text-white text-xs sm:text-sm">Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;











