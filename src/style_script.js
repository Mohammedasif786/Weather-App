const menu_unit = document.getElementById('menu-unit');
const unit = document.getElementById('unit');
const City_Search = document.getElementById('City_search');
const search = document.getElementById('Query');
const weatherBody = document.getElementById('weather_body');
const errorCity = document.getElementById('Error_City');
const serverError = document.getElementById('Api-error');
const logoHide = document.getElementById('logoBody');
const Today_bar = document.getElementById('Original_today');
const loading1 = document.getElementById('Loading_today_large');
const Searching_city_reload = document.getElementById('Search_in_prog');

{
    Searching_city_reload.classList.remove('flex');
    Searching_city_reload.classList.add('hidden');
}

//setLoading(false);
function setLoading(isLoading) {
    if (isLoading) {
        Today_bar.classList.remove('max-[1440px]:flex');
        Today_bar.classList.add('hidden');
        loading1.classList.remove('hidden');
        loading1.classList.add('flex');
    } else {
        Today_bar.classList.add('max-[1440px]:flex');
        Today_bar.classList.remove('hidden');
        loading1.classList.add('hidden');
        loading1.classList.remove('flex');
    }
}

function toggleServerError() {
if (serverError.classList.contains('flex')) {
    serverError.classList.remove('flex');
    serverError.classList.add('hidden');
} else {
    serverError.classList.add('flex');
    serverError.classList.remove('hidden');
    logoHide.classList.remove('flex');
    logoHide.classList.add('hidden');
    errorCity.classList.add('hidden');
    errorCity.classList.remove('flex');
    weatherBody.classList.add('hidden');
    weatherBody.classList.remove('flex');
}
}

errorCity.classList.add('hidden')
//const outSide = document.getElementById('body');

const database = 'Gulbarga';
City_Search.addEventListener('click', function(){
    if (search.value === database) {
        if (weatherBody.classList.contains('hidden') || errorCity.classList.contains('hidden')) {
            weatherBody.classList.remove('hidden');
            weatherBody.classList.add('flex');
            errorCity.classList.remove('flex');
            errorCity.classList.add('hidden');
        }
    } else {
        weatherBody.classList.add('hidden');
        weatherBody.classList.remove('flex');
        errorCity.classList.add('flex');
        errorCity.classList.remove('hidden');
    }

})

function closeUnit() {
if (menu_unit.classList.contains('hidden')) {
        menu_unit.classList.remove('hidden');
        menu_unit.classList.add('min-[375px]:flex');
    } else {
        menu_unit.classList.remove('min-[375px]:flex');
        menu_unit.classList.add('hidden');
    }
}

unit.addEventListener('click',closeUnit); 

export { setLoading, toggleServerError };