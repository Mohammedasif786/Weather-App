document.addEventListener('DOMContentLoaded', () => {
  const Query = document.getElementById('Query');
  const Query_btn = document.getElementById('City_search');

  if (!Query || !Query_btn) {
    console.error('Required input or button element not found.');
    return;
  }
  Query_btn.addEventListener('click', async () => {
    const cityName = Query.value.trim();
    if (!cityName) {
      console.error('City name is empty.');
      return;
    }
    let [lat, lan, others] = await Automate(cityName);
    const parts = others[0].display_name.split(',');
    console.log(others[0])
    console.log(parts[0], parts[2]);

    //console.log(`Latitude: ${lat}, Longitude: ${lan}`);
    const data = await Weather_API(lat, lan);
    console.log(data);
  });
});

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