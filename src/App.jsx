import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherByCoords } from "./store/appSlice";
import { useEffect, useState } from "react";
import Forecast from "./components/Forecast";
import SelectCity from "./components/SelectCity";
// import weather icons
import sunny from "./assets/img/icon-sunny.svg"
import partlyCloudy from "./assets/img/icon-partly-cloudy.svg"
import cloudy from "./assets/img/icon-cloudy.svg"
import foggy from "./assets/img/icon-foggy.svg"
import lightRain from "./assets/img/icon-light-rain.svg"
import heavyRain from "./assets/img/icon-heavy-rain.svg"
import lightSnow from "./assets/img/icon-light-snow.svg"
import heavySnow from "./assets/img/icon-heavy-snow.svg"
import rainShower from "./assets/img/icon-rain-shower.svg"
import lightThunderstorm from "./assets/img/icon-light-thunderstorm.svg"
import heavyThunderstorm from "./assets/img/icon-heavy-thunderstorm.svg"

function App() {
  const dispatch = useDispatch();
  const { data, status, error, city } = useSelector((state) => state.appSlice || {});
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const [currentTemp, setCurrentTemp] = useState(null);
  const [weatherLabel, setWeatherLabel] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherBg, setWeatherBg] = useState(null);
  const [feelsLike, setFeelsLike] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: "6.1944",
    longitude: "106.8229",
  })
  const [cityName, setCityName] = useState("Jakarta");
  const [scale, setScale] = useState("celsius");

  let weatherCode = {
    0: {label: "Clear sky", icon: sunny, bg: "https://images.unsplash.com/photo-1665310840171-27b1c8eb8797?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1076"},
    1: {label: "Mainly clear", icon: sunny, bg: "https://images.unsplash.com/photo-1665310840171-27b1c8eb8797?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1076"},
    2: {label: "Partly cloudy", icon: partlyCloudy, bg: "https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    3: {label: "Cloudy", icon: cloudy, bg: "https://images.unsplash.com/photo-1469365556835-3da3db4c253b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    45: {label: "Foggy", icon: foggy, bg: "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1094"},
    48: {label: "Foggy", icon: foggy, bg: "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1094"},
    51: {label: "Light drizzle", icon: lightRain, bg: "https://images.unsplash.com/photo-1625573651510-c0c6b6d4d294?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    61: {label: "Slight rain", icon: lightRain, bg: "https://images.unsplash.com/photo-1625573651510-c0c6b6d4d294?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    65: {label: "Heavy rain", icon: heavyRain, bg: "https://images.unsplash.com/photo-1634750016464-46f186b23443?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    71: {label: "Light snowfall", icon: lightSnow, bg: "https://images.unsplash.com/photo-1615200121762-df2ac420835d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"},
    75: {label: "Heavy snowfall", icon: heavySnow, bg: "https://images.unsplash.com/photo-1610396932025-9e42807266a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    80: {label: "Rain showers", icon: rainShower, bg: "https://images.unsplash.com/photo-1641309664410-b6466c07c935?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    82: {label: "Rain showers", icon: rainShower, bg: "https://images.unsplash.com/photo-1641309664410-b6466c07c935?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    95: {label: "Light Thunderstorm", icon: lightThunderstorm, bg: "https://images.unsplash.com/photo-1629800537338-6a082a7aac0b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"},
    96: {label: "Thunderstorm", icon: heavyThunderstorm, bg: "https://images.unsplash.com/photo-1590942759420-8bcb32579cf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"},
    99: {label: "Thunderstorm", icon: heavyThunderstorm, bg: "https://images.unsplash.com/photo-1590942759420-8bcb32579cf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"},
  }

  function getCurrentDateFix() {
    const dateNow = new Date();
    const yyyy = dateNow.getFullYear();
    const mm = String(dateNow.getMonth() + 1).padStart(2, "0");
    const dd = String(dateNow.getDate()).padStart(2, "0");
    const hh = String(dateNow.getHours()).padStart(2, "0");
    const displayDate = dateNow.toLocaleDateString("en-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFormattedDate(displayDate);
    return `${yyyy}-${mm}-${dd}T${hh}:00`;
  }

  function findBestIndex(timesArray, targetIso) {
    if (!Array.isArray(timesArray) || timesArray.length === 0) return -1;
    const exact = timesArray.findIndex((t) => t === targetIso);
    if (exact >= 0) return exact;

    // fallback: find same day and nearest hour
    const dayPrefix = targetIso.substring(0, 10); // YYYY-MM-DD
    const sameDay = timesArray
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.startsWith(dayPrefix + "T"));

    if (sameDay.length === 0) return 0; // nothing same day, choose first available

    const targetHour = parseInt(targetIso.substring(11, 13), 10);
    let closest = sameDay[0];
    let closestDiff = Math.abs(
      parseInt(closest.t.substring(11, 13), 10) - targetHour
    );

    sameDay.forEach((item) => {
      const hour = parseInt(item.t.substring(11, 13), 10);
      const diff = Math.abs(hour - targetHour);
      if (diff < closestDiff) {
        closest = item;
        closestDiff = diff;
      }
    });

    return closest.i;
  }

  function updateFromData() {
    if (!data) return;

    const dateFix = getCurrentDateFix();
    // console.log(dateFix);

    const times = data.hourly?.time || [];
    const idx = findBestIndex(times, dateFix);
    // console.log(idx);

    const t = Math.round(data.hourly?.temperature_2m?.[idx]);
    setCurrentTemp(typeof t !== "undefined" ? t : null);

    const weatherIndex = data.hourly?.weather_code?.[idx];
    setWeatherLabel(typeof weatherIndex !== "undefined" ? weatherCode[weatherIndex]?.label : "");
    setWeatherIcon(typeof weatherIndex !== "undefined" ? weatherCode[weatherIndex]?.icon : null);
    setWeatherBg(typeof weatherIndex !== "undefined" ? weatherCode[weatherIndex]?.bg : null);

    const feels = Math.round(data.hourly?.apparent_temperature?.[idx]);
    setFeelsLike(typeof feels !== "undefined" ? feels : null);

    const hum = data.hourly?.relative_humidity_2m?.[idx];
    setHumidity(typeof hum !== "undefined" ? hum : null);

    const wind = data.hourly?.wind_speed_10m?.[idx];
    setWindSpeed(typeof wind !== "undefined" ? wind : null);

    const pres = data.hourly?.surface_pressure?.[idx];
    setPressure(typeof pres !== "undefined" ? pres : null);

    const min = Math.round(data.daily?.temperature_2m_min?.[0]);
    const max = Math.round(data.daily?.temperature_2m_max?.[0]);
    setMinTemp(typeof min !== "undefined" ? min : null);
    setMaxTemp(typeof max !== "undefined" ? max : null);
  }

  function handleChangeScale(){
    if(scale === "celsius"){
      setCurrentTemp(Math.round((currentTemp * 9/5) + 32));
      setMinTemp(Math.round((minTemp * 9/5) + 32));
      setMaxTemp(Math.round((maxTemp * 9/5) + 32));
      document.querySelectorAll('.forecastTemp').forEach((elem) => {
        const celsiusValue = parseInt(elem.textContent);
        const fahrenheitValue = Math.round((celsiusValue * 9/5) + 32);
        elem.textContent = `${fahrenheitValue} °F`;
      });
      setFeelsLike(Math.round((feelsLike * 9/5) + 32));
      setScale("fahrenheit");
    } else {
      setCurrentTemp(Math.round((currentTemp - 32) * 5/9));
      setMinTemp(Math.round((minTemp - 32) * 5/9));
      setMaxTemp(Math.round((maxTemp - 32) * 5/9));
      document.querySelectorAll('.forecastTemp').forEach((elem) => {
        const fahrenheitValue = parseInt(elem.textContent);
        const celsiusValue = Math.round((fahrenheitValue - 32) * 5/9);
        elem.textContent = `${celsiusValue} °C`;
      });
      setFeelsLike(Math.round((feelsLike - 32) * 5/9));
      setScale("celsius");
    }
  }

  useEffect(() => {
    dispatch(
      fetchWeatherByCoords({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timezone: "Asia/Jakarta",
      })
    );
  }, [dispatch, coordinates.latitude, coordinates.longitude]);

  useEffect(() => {
    if (!data) return;
    updateFromData(); 
    const id = setInterval(updateFromData, 60 * 1000); 
    return () => clearInterval(id);
  }, [data]);

  return (
    <>
      {/* <div id="loader" className="min-h-screen w-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-[#25b09b] animate-spin" />
      </div> */}
      <main id="main" className="flex items-center justify-center bg-no-repeat bg-cover h-full min-h-screen p-[25px]" style={{ backgroundImage: `url(${weatherBg})` }}>
        <div className="w-full max-w-[600px] rounded-lg bg-[#171717] p-4 text-center text-[#f5f5f5]">
          <div className="flex items-center justify-between mb-10 gap-4">

            <SelectCity setCoordinates={setCoordinates} setCityName={setCityName}/>

            <div className="flex justify-end items-center gap-2">
              <div className="text-sm text-white">
                Convert to
              </div>
              <button
                onClick={handleChangeScale}
                className="relative z-10 px-3 py-2 rounded-lg text-xl font-bold uppercase border border-white overflow-hidden text-[#171717] bg-white cursor-pointer"
              >
                {scale === "celsius" ? "°F" : "°C"}
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold uppercase mb-1">{cityName}, Indonesia</h1>
          <p className="mb-4 text-sm" id="date">{formattedDate}</p>
          <div className="inline-block px-4 py-2 rounded-full bg-[#1e1e1e] text-sm mb-4 capitalize" id="weatherLabel">
            {weatherLabel}
          </div>
          <img src={weatherIcon} alt="weather image" className="mx-auto w-[100px] h-[100px] mb-4" />
          <h2 className="text-[22px] font-semibold" id="temp">{currentTemp !== null ? `${currentTemp} °C` : "— °C"}</h2>

        <div className="flex gap-4 mb-6 justify-center">
          <p id="min" className="m-0 text-sm">Min: {minTemp ?? "--"} °C</p>
          <p id="max" className="m-0 text-sm">Max: {maxTemp ?? "--"} °C</p>
        </div>

        <Forecast data={data} weatherCode={weatherCode}/>

          <div className="flex flex-wrap justify-center gap-5 mt-4">
            <div className="w-5/12 sm:w-1/3">
              <div className="bg-[#1e1e1e] p-4 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.0002 17.3334V6.66675C20.0002 5.60588 19.5787 4.58847 18.8286 3.83832C18.0784 3.08818 17.061 2.66675 16.0002 2.66675C14.9393 2.66675 13.9219 3.08818 13.1717 3.83832C12.4216 4.58847 12.0002 5.60588 12.0002 6.66675V17.3334C10.8808 18.1729 10.0539 19.3434 9.63674 20.679C9.21954 22.0145 9.23314 23.4475 9.67561 24.7749C10.1181 26.1023 10.967 27.2569 12.1021 28.075C13.2372 28.8932 14.6009 29.3334 16.0002 29.3334C17.3994 29.3334 18.7631 28.8932 19.8982 28.075C21.0333 27.2569 21.8822 26.1023 22.3247 24.7749C22.7672 23.4475 22.7808 22.0145 22.3636 20.679C21.9464 19.3434 21.1195 18.1729 20.0002 17.3334ZM16.0002 5.33341C16.3538 5.33341 16.6929 5.47389 16.943 5.72394C17.193 5.97399 17.3335 6.31313 17.3335 6.66675V10.6667H14.6668V6.66675C14.6668 6.31313 14.8073 5.97399 15.0574 5.72394C15.3074 5.47389 15.6465 5.33341 16.0002 5.33341Z" fill="#F5F5F5"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm m-0">Feels Like</p>
                  <p className="font-medium m-0" id="feelsLike">{feelsLike !== null ? `${feelsLike} °C` : "-- °C"}</p>
                </div>
              </div>
            </div>
            <div className="w-5/12 sm:w-1/3">
              <div className="bg-[#1e1e1e] p-4 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.476 13.993L16.847 3.43701C16.7508 3.30202 16.6238 3.19197 16.4764 3.11604C16.3291 3.04011 16.1657 3.00049 16 3.00049C15.8343 3.00049 15.6709 3.04011 15.5236 3.11604C15.3762 3.19197 15.2492 3.30202 15.153 3.43701L8.494 14.044C7.56966 15.5362 7.0544 17.2455 7 19C7 21.387 7.94821 23.6761 9.63604 25.364C11.3239 27.0518 13.6131 28 16 28C18.3869 28 20.6761 27.0518 22.364 25.364C24.0518 23.6761 25 21.387 25 19C24.9427 17.2258 24.4169 15.4983 23.476 13.993ZM16 26C14.1443 25.9974 12.3654 25.259 11.0532 23.9468C9.74099 22.6346 9.00265 20.8557 9 19C9.05418 17.6018 9.47415 16.2422 10.218 15.057L11.153 13.567L21.227 23.641C20.5726 24.3821 19.7682 24.9758 18.8671 25.3826C17.966 25.7895 16.9887 25.9993 16 26Z" fill="#F5F5F5"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm m-0">Humidity</p>
                  <p className="font-medium m-0" id="humidity">{humidity !== null ? `${humidity} %` : "-- %"}</p>
                </div>
              </div>
            </div>
            <div className="w-5/12 sm:w-1/3">
              <div className="bg-[#1e1e1e] p-4 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13C2.60218 13 2.22064 12.842 1.93934 12.5607C1.65804 12.2794 1.5 11.8978 1.5 11.5C1.5 11.1022 1.65804 10.7206 1.93934 10.4393C2.22064 10.158 2.60218 10 3 10H15C15.3978 10 15.7794 9.84196 16.0607 9.56066C16.342 9.27936 16.5 8.89782 16.5 8.5C16.5 8.10218 16.342 7.72064 16.0607 7.43934C15.7794 7.15804 15.3978 7 15 7C14.517 7.01406 14.0578 7.2132 13.7175 7.55625C13.4329 7.81567 13.0595 7.95572 12.6745 7.94739C12.2895 7.93907 11.9225 7.78301 11.6494 7.51153C11.3763 7.24005 11.2181 6.87394 11.2075 6.48902C11.1969 6.1041 11.3348 5.72984 11.5925 5.44375C12.497 4.53716 13.7195 4.01919 15 4C16.1935 4 17.3381 4.47411 18.182 5.31802C19.0259 6.16193 19.5 7.30653 19.5 8.5C19.5 9.69347 19.0259 10.8381 18.182 11.682C17.3381 12.5259 16.1935 13 15 13H3ZM26 8.5C24.7178 8.51789 23.4932 9.03596 22.5875 9.94375C22.3298 10.2298 22.1919 10.6041 22.2025 10.989C22.2131 11.3739 22.3713 11.74 22.6444 12.0115C22.9175 12.283 23.2845 12.4391 23.6695 12.4474C24.0545 12.4557 24.4279 12.3157 24.7125 12.0562C25.0541 11.712 25.5152 11.5128 26 11.5C26.3978 11.5 26.7794 11.658 27.0607 11.9393C27.342 12.2206 27.5 12.6022 27.5 13C27.5 13.3978 27.342 13.7794 27.0607 14.0607C26.7794 14.342 26.3978 14.5 26 14.5H4C3.60218 14.5 3.22064 14.658 2.93934 14.9393C2.65804 15.2206 2.5 15.6022 2.5 16C2.5 16.3978 2.65804 16.7794 2.93934 17.0607C3.22064 17.342 3.60218 17.5 4 17.5H26C27.1935 17.5 28.3381 17.0259 29.182 16.182C30.0259 15.3381 30.5 14.1935 30.5 13C30.5 11.8065 30.0259 10.6619 29.182 9.81802C28.3381 8.97411 27.1935 8.5 26 8.5ZM19 19H5C4.60218 19 4.22064 19.158 3.93934 19.4393C3.65804 19.7206 3.5 20.1022 3.5 20.5C3.5 20.8978 3.65804 21.2794 3.93934 21.5607C4.22064 21.842 4.60218 22 5 22H19C19.3978 22 19.7794 22.158 20.0607 22.4393C20.342 22.7206 20.5 23.1022 20.5 23.5C20.5 23.8978 20.342 24.2794 20.0607 24.5607C19.7794 24.842 19.3978 25 19 25C18.5166 24.9859 18.0571 24.7868 17.7162 24.4438C17.5803 24.2928 17.415 24.171 17.2305 24.0859C17.046 24.0007 16.8462 23.9539 16.6431 23.9483C16.44 23.9427 16.2378 23.9785 16.049 24.0533C15.8601 24.1282 15.6884 24.2407 15.5443 24.384C15.4002 24.5272 15.2867 24.6982 15.2107 24.8867C15.1347 25.0751 15.0978 25.277 15.1021 25.4802C15.1065 25.6833 15.1522 25.8834 15.2362 26.0684C15.3203 26.2534 15.4411 26.4194 15.5913 26.5562C16.4961 27.4631 17.7191 27.9811 19 28C20.1935 28 21.3381 27.5259 22.182 26.682C23.0259 25.8381 23.5 24.6935 23.5 23.5C23.5 22.3065 23.0259 21.1619 22.182 20.318C21.3381 19.4741 20.1935 19 19 19Z" fill="#F5F5F5"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm m-0">Wind Speed</p>
                  <p className="font-medium m-0" id="windSpeed">{windSpeed !== null ? `${windSpeed} m/s` : "-- m/s"}</p>
                </div>
              </div>
            </div>
            <div className="w-5/12 sm:w-1/3">
              <div className="bg-[#1e1e1e] p-4 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.5907 23.1068C28.0674 21.3287 28.1286 19.4649 27.7697 17.6594C27.4107 15.854 26.6413 14.1553 25.5208 12.6948C24.4003 11.2343 22.9588 10.0512 21.3078 9.23698C19.6569 8.42276 17.8408 7.99927 16 7.99927C14.1592 7.99927 12.3431 8.42276 10.6922 9.23698C9.04122 10.0512 7.59974 11.2343 6.47924 12.6948C5.35874 14.1553 4.58925 15.854 4.23033 17.6594C3.8714 19.4649 3.93265 21.3287 4.40933 23.1068"
                      stroke="#F5F5F5"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17.0212 20.776C17.6706 21.7227 17.2132 23.1654 15.9999 23.9987C14.7866 24.8334 13.2759 24.7427 12.6266 23.7974C11.9332 22.7894 9.54123 17.1214 8.08923 13.6147C7.8159 12.9547 8.62256 12.4 9.14256 12.892C11.8946 15.5054 16.3292 19.768 17.0212 20.776Z"
                      stroke="#F5F5F5"
                      strokeWidth="2.66667"
                    />
                    <path
                      d="M15.9998 8V10.6667M7.51451 11.5147L9.39985 13.4M24.4852 11.5147L22.5998 13.4M27.5905 23.1067L25.0158 22.416M4.40918 23.1067L6.98385 22.416"
                      stroke="#F5F5F5"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                    />  
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm m-0">Pressure</p>
                  <p className="font-medium m-0" id="pressure">{pressure !== null ? `${pressure} hPa` : "-- hPa"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
