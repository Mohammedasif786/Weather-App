const cityName = document.getElementById('CityName');
const calender = document.getElementById('Calender');
const nowTemp = document.getElementById('NowTemp');
const feelLikeTemp = document.getElementById('FeelLikeTemp');
const humidity = document.getElementById('Humidity');
const wind = document.getElementById('Wind');
const preciptation = document.getElementById('preciptation');
const dailyWeatherBlock = document.getElementById('DailyWeatherBlock');

const d = new Date();
let dateString = d.toString();

document.addEventListener('DOMContentLoaded', () => {
  const Query = document.getElementById('Query');
  const Query_btn = document.getElementById('City_search');

  if (!Query || !Query_btn) {
    console.error('Required input or button element not found.');
    return;
  }
  Query_btn.addEventListener('click', async (event) => {
    const cityName = Query.value.trim();
    if (!cityName) {
      console.error('City name is empty.');
      return;
    }
    let [lat, lan, others] = await Automate(cityName);
    const data = await Weather_API(lat, lan);

    fullCityName(others);
    fourBlocksData(data);

    for(let i=0; i<7; i++)
    DynamicDailyWeather(data,i);

  });
    calender.textContent = dateString.slice(0,15);
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
  
    if(others[1]) cityName.textContent = others[1].display_name;
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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lan}&hourly=apparent_temperature&hourly=wind_speed_10m&wind_speed_unit=ms&forecast_days=16&minutely_15=relative_humidity_2m&minutely_15=precipitation&timezone=auto&forecast_days=7&daily=apparent_temperature_mean`
  try {
    const response = await fetch(url)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error at ${error}😟`)
  }
}

function DynamicDailyWeather(data,loop = 0) {
  // This function can be implemented to dynamically create daily weather blocks
  // based on the data received from the Weather_API function.
  const Day = new Date(data.daily.time[loop])
  const OnlyDay = Day.getDay()?['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][Day.getDay()]: 'Sun';
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