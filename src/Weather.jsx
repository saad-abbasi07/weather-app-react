import React, { useState } from 'react'
import './Weather.css';

export default function Weather() {

    const [city , setCity] = useState('');
    const [weather , setWeather] = useState(null);
    const [error , setError] = useState('');

    const handelCheckWeather = async () =>{
        if(!city) return;

        try{
           const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);

           const geoData = await geoRes.json();

           if(!geoData.results || geoData.results.length === 0){
            setError('City Not Found');
            setWeather(null);
            return;
           }

           const {latitude , longitude , name , country} = geoData.results[0];

           const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
           );

           const weatherData = await weatherRes.json();

           setWeather ({
            name : `${name}, ${country}`,
            temperature : weatherData.current_weather.temperature,
            windspeed : weatherData.current_weather.windspeed,
            condition : weatherData.current_weather.weathercode,
           });
           setError('');
        }
           catch (err){
            setError('Something Went Wrong');
            setWeather(null);
           }
        };
  return (
    <div>
      <div className="weather-box">
        <h2>Weather App</h2>
        <input
        type='text'
        placeholder='Enter Your City'
        value={city}
        onChange={(e)=>setCity(e.target.value)}
        />
        <button onClick={handelCheckWeather}>Check Weather</button>
        {
            weather && (
                <div className='weather-info'>
                    <h3>{weather.name}</h3>
                    <p>Temperature : {weather.temperature}</p>
                    <p>Wind Speed : {weather.windspeed} km/h</p>
                    <p>Condition Code : {weather.condition}</p>
                </div>
            )
        }

        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
    </div>
  )
}
