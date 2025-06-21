import React, { useEffect, useRef, useState } from 'react'
import search_icon from "../assets/search.png"
import clear_icon from "../assets/clear.png"
import cloud_icon from "../assets/cloud.png"
import drizzle_icon from "../assets/drizzle.png"
import humidity_icon from "../assets/humidity.png"
import rain_icon from "../assets/rain.png"
import snow_icon from "../assets/snow.png"
import wind_icon from "../assets/wind.png"

const Weather = () => {

  const inputRef = useRef()

  const [weatherData,setWeatherData] = useState(false);

  const allIcons = {
    "01d":clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d":cloud_icon,
    "03n":cloud_icon,
    "04d":drizzle_icon,
    "04n":drizzle_icon,
    "09d":rain_icon,
    "09n":rain_icon,
    "10d":rain_icon,
    "10n":rain_icon,
    "13d":snow_icon,
    "13n":snow_icon,

  }

  const search = async(city)=>{

    if(city === ""){
      alert("Enter the city name:");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if(!response.ok){
        alert(data.message);
        return;
      }
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
     })
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
      
    }

  }

  useEffect(()=>{
    search("NEW YORK")
  },[])



  return (
    <div className="place-self-center p-20 rounded-xl bg-gradient-to-r  bg-[#7e22ce] flex
    flex-col items-center">
        <div className="flex items-center gap-12">
            <input ref={inputRef} className="h-18 border-none outline-none rounded-lg pl-6 bg-[#ebfffc] text-lg" type='text' placeholder='search'/>
            <img className="w-12 p-4 rounded-xl bg-[#ebfffc] cursor-pointer " onClick={()=>search(inputRef.current.value)} src={search_icon} alt=''/>
        </div>
        {weatherData ? <>
        <img className='w-37 m-7 left-0 right-0' src={weatherData.icon} alt=""/>
        <p className="text-purple-400 text-7xl leading-none">{weatherData.temperature}</p>
        <p className="text-yellow-200 text-4xl">{weatherData.location}</p>
        <div className="w-full  mt-4 flex justify-between">
          <div className="flex items-start gap-3 text-sm">
            <img className="w-6 mt-2" src={humidity_icon} alt=''/>
            <div>
              <p className="text-white">{weatherData.humidity}</p>
              <span className="block text-base text-white ">Humidity</span>
            </div>
          </div>
          <div className=''>
            <img src={wind_icon} />
            <div>
              <p>{weatherData.windSpeed}</p>
              <span>Wind speed</span>
            </div>

          </div> 
       </div>


        </>:<></>}
        
        
     
      
    </div>
  )
}

export default Weather
