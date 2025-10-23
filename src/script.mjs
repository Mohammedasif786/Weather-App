const cityName = document.getElementById('CityName');
const calender = document.getElementById('Calender');

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
    /*{
    //console.log(others);
    /*const parts = others[1].display_name.split(',');
    console.log(others[0])
    console.log(parts[0], parts[2]);*/

    fullCityName(others);
    const data = await Weather_API(lat, lan);
    const data2 = await Weather_API2(lat,lan);
    
    console.log(data2,data)
    //console.log(data.hourly.time[0]);
  });
});

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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lan}&hourly=apparent_temperature&minutely_15=relative_humidity_2m`
  try {
    const response = await fetch(url)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error at ${error}😟`)
  }
}

async function Weather_API2(lat, lan) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lan}&hourly=temperature_2m&daily=temperature_2m_max&timezone=auto&forecast_days=7&daily=apparent_temperature_mean`
  try {
    const response = await fetch(url)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error at ${error}😟`)
  }
}