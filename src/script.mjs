import { setLoading,toggleServerError,closeErrorCity } from './style_script.js';
const cityName = document.getElementById('CityName');
const calender = document.getElementById('Calender');
const nowTemp = document.getElementById('NowTemp');
const feelLikeTemp = document.getElementById('FeelLikeTemp');
const humidity = document.getElementById('Humidity');
const wind = document.getElementById('Wind');
const preciptation = document.getElementById('preciptation');
const dailyWeatherBlock = document.getElementById('DailyWeatherBlock');
const removeLoadingHourly = document.querySelectorAll('.removeLoading');
const DailyWeatherLoading = document.querySelectorAll('.DailyWeatherLoading');
const HourlyForcast = document.getElementById('HourlyForcast');

const d = new Date();
let dateString = d.toString();
setLoading(true);
toggleServerError();

document.addEventListener('DOMContentLoaded', () => {
  const Query = document.getElementById('Query');
  const Query_btn = document.getElementById('City_search');
  const weatherCodeMap = {
    0: "Sunny",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Slight hail thunderstorm",
    99: "Heavy hail thunderstorm",
  };

  //const readable = weatherCodeMap[code] || "Unknown weather"; // Result: "Sunny"

  if (!Query || !Query_btn) {
    console.error('Required input or button element not found.');
    return;
  }
  
  async function HandleQuery() {
    const cityName = Query.value.trim();
    if (!cityName) {
      console.error('City name is empty.');
      return;
    }
    let [lat, lan, others] = await Automate(cityName);
    const data = await Weather_API(lat, lan);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    fullCityName(others);
    fourBlocksData(data);

    DailyWeatherLoading.forEach(element => {
      element.remove();
    });

    removeLoadingHourly.forEach(element => {
      element.remove();
    });

    
    dailyWeatherBlock.innerHTML = '';
    for (let i = 0; i < 6; i++)
      DynamicDailyWeather(data, i);

    HourlyForcast.innerHTML = '';
    for (let j = 0; j < 8; j++)
      DynamicHourlyForcast(data, j,weatherCodeMap); 
  }

  Query_btn.addEventListener('click', HandleQuery);
  Query.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      HandleQuery();
    }
  });
  calender.textContent = dateString.slice(0, 15);
});



function fourBlocksData(data) {
  nowTemp.textContent = `${Math.round(data.hourly.apparent_temperature[0])}°`;
  feelLikeTemp.textContent = `${Math.round(data.hourly.apparent_temperature[0] - 2)}°`;
  humidity.textContent = data.minutely_15.relative_humidity_2m ? `${data.minutely_15.relative_humidity_2m[0]}%` : '--%';
  wind.textContent = data.hourly.wind_speed_10m ? `${Math.round(data.hourly.wind_speed_10m[0] * 3.6)} km/h` : '-- km/h';
  preciptation.textContent = data.minutely_15.precipitation ? `${data.minutely_15.precipitation[0]} mm` : '-- mm';
}

function fullCityName(others) {
  //console.log(others[1].display_name);
  closeErrorCity(others[0].display_name);
  if (others[1]) cityName.textContent = others[1].display_name;
  else cityName.textContent = others[0].display_name;
}

async function Automate(Cityname) {
  const url = `http://localhost:7000/search?q=${encodeURIComponent(Cityname)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "formohammedasif6@gmail.com",
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return [data[0].lat, data[0].lon, data];
  } catch (error) {
    console.error(`Error at: ${error}`);
  }
}

async function Weather_API(lat, lan) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lan}&hourly=apparent_temperature&hourly=wind_speed_10m&wind_speed_unit=ms&forecast_days=16&minutely_15=relative_humidity_2m&minutely_15=precipitation&timezone=auto&forecast_days=7&daily=apparent_temperature_mean&hourly=weather_code`
  try {
    const response = await fetch(url)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error at ${error}😟`)
  }
}

function DynamicDailyWeather(data, loop = 0) {
  const Day = new Date(data.daily.time[loop])
  const OnlyDay = Day.getDay() ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Day.getDay()] : 'Sun';
  const div = document.createElement('div');
  div.className = 'bg-[#2f2f49] rounded-lg p-3 text-center text-white';
  div.innerHTML = `
    <div class="font-bold">${OnlyDay}</div>
    <div class="flex justify-center items-center">
      <img src="assets/images/icon-partly-cloudy.webp" alt="" width="30%">
    </div>
    <div class="font-semibold mt-2">${Math.round(data.hourly.apparent_temperature[loop])}° / ${Math.round(data.hourly.apparent_temperature[loop] - 2)}°</div>
  `;
  dailyWeatherBlock.appendChild(div);

}

function DynamicHourlyForcast(data, loop = 0,WeatherCodes) {
  const div = document.createElement('div');
  div.className = 'bg-[#2f2f49] rounded-lg p-3 flex justify-between items-center text-white min-[375px]:w-[330px]';
  div.innerHTML = `
               <div class="flex items-center grow">
                <img src="assets/images/icon-rain.webp" alt="" width="50px">
                <span>${getWeatherTime(data,loop)}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>${data.hourly.apparent_temperature[loop]}°</span>
              </div>
            </div>
  `
  HourlyForcast.appendChild(div);
}


function getWeatherTime(data,loop) {
  const time = new Date(data.hourly.time[loop]);
  return time.getHours() + ":00 " + formatAMPM(time);
}

function formatAMPM(date) {
  let User = false;
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // If hour is 0, set to 12
  minutes = minutes < 10 ? '0'+minutes : minutes;
  if(User) {
  return hours + ':' + minutes + ' ' + ampm;
  } else return ampm;
}

export { fullCityName };