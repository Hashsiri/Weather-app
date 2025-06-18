// Import necessary hooks and assets
import { useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'


function Weather() {

    // useRef to get direct access to the input DOM element
    const inputRef= useRef()

    // State to hold weather data or null (for no result or error)
    const [weatherData, setWeatherData] = useState(null); 

    // Mapping of weather icon codes to local image icons
    const allIcons = {
        '01d': clear_icon,
        '01n': clear_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow_icon,
        '13n': snow_icon,
    }

    // Function to fetch weather data for a given city
    const search = async (city) => {

        // For empty input
        if(city.trim()==='') {
            setWeatherData(false); // clear any previous data
            alert('Enter city name');
            return;
        }

        try {
            // Construct API URL using city name and your API key from .env
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // Get appropriate icon or default to clear
                const icon = allIcons[data.weather[0].icon] || clear_icon;
                // Update weather state with required data
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon
                })
                return;
            }
            throw new Error('Request failed!');

        } catch(error) {
            alert('City not found or network issue. Please try again.');
            setWeatherData(false)
            console.log(error);
        }
    }

    // Handles pressing Enter key in the input field to trigger search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(inputRef.current.value);
        }
    }

  return (
      <div className="weather">
        {/* Search bar with input and search icon */}
        <div className="search-bar">
            <input ref={inputRef} type="text" placeholder='Search...' onKeyDown={handleKeyDown}/>
            <img src={search_icon} alt="search icon" onClick={() => search(inputRef.current.value)} />
        </div>
        {/* Conditional rendering of weather data */}
        {weatherData ? (<>
            <img src={weatherData.icon} alt="" className='weather-icon'/>
            <p className='temperature'>{weatherData.temperature} ⁰C</p>
            <p className='location'>{weatherData.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt="" />
                    <div>
                        <p>{weatherData.humidity} %</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt="" />
                    <div>
                        <p>{weatherData.windSpeed} km/h</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </>) : (
            // Default message when no data is available
            <p className="no-data">Search for a city to view weather info.</p>
        )}
      </div>
  )};

export default Weather;
