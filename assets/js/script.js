// Search input elements
var citySearchHistoryEl = document.getElementById('city-search-history');
var citySearchButtonEl = document.getElementById('city-search-btn');
var citySearchInputEl = document.getElementById('city-search-input');
var stateSelectorEl = document.getElementById('state-selector');

// Current Weather elements
var currentDateEl = document.getElementById('current-date');
var currentCityEl = document.getElementById('city-name');
var currentTempEl = document.getElementById('current-temp');
var currentWindEl = document.getElementById('current-wind');
var currentHumidityEl = document.getElementById('current-humidity');
var currentWeatherIconEl = document.getElementById('current-weather-icon');

// Spinner 
const spinnerEl = document.getElementById('spinner');
function showSpinner() {
  spinnerEl.style.visibility = 'visible';
}

function hideSpinner() {
  spinnerEl.style.visibility = 'hidden';
}

// Open Weather API Call
// API Key, get your key here  https://openweathermap.org/forecast5
var openWeatherMapForecast = function () {
    var apiKey = "7d5b7e2240f4ddcf43e49911d92c7be7";
    var apiLocUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + citySearchString +",us&limit=1&appid=" + apiKey;
    var cityCoordinatesLat;
    var cityCoordinatesLon;
    showSpinner()
    // first API call to retrieve city details including coordinates
    fetch(apiLocUrl)
      .then(function (cityLocationResponse) {
        if (cityLocationResponse.ok) {
          return cityLocationResponse.json();
        } else {
          alert("Error: API couldnt not be reached \nMessage: " + cityLocationResponse.statusText);
        }
        })
        .then(function (cityData) {
        if (cityData.length === 0) {
            alert("City Not found");
            hideSpinner();
            return;
        } else {
            localStorageStringToArray(); 
            cityCoordinatesLat = cityData[0].lat;
            cityCoordinatesLon = cityData[0].lon;
            var cityCordinatesName = cityData[0].name;
            var cityCoordinatesState = cityData[0].state;
            var cityCoordinatesCountry = cityData[0].country;
            currentCityEl.textContent = cityCordinatesName + ", " + cityCoordinatesState + ", " + cityCoordinatesCountry;
            var apiCurrentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+ cityCoordinatesLat + "&lon=" + cityCoordinatesLon +"&units=imperial&lan=en"+"&appid=" + apiKey;
            return  fetch(apiCurrentWeatherUrl); 
        }
        }).then(function (currentWeatherResponse) {
        if (currentWeatherResponse.ok) {
          return currentWeatherResponse.json();
        } else {
          alert("Error: API couldnt not be reached \nMessage: " + currentWeatherResponse.statusText);
        }
        }).then(function (currentWeatherData) {
            console.log("🚀 ~ file: script.js:65 ~ currentWeatherData:", currentWeatherData)
            var currentWeatherTemp = currentWeatherData.main.temp;
            var currentWeatherWind = currentWeatherData.wind.speed;
            var currentWeatherHumidity = currentWeatherData.main.humidity;
            var currentWeatherDate = currentWeatherData.dt;
            currentWeatherDate = (dayjs(currentWeatherDate * 1000).format('MM/DD/YYYY'));
            var currentWeatherIcon = currentWeatherData.weather[0].icon;
            var currentWeatherIconUrl = "https://openweathermap.org/img/w/" + currentWeatherIcon+".png";
        
            //write to page
            currentDateEl.textContent = currentWeatherDate;
            currentTempEl.textContent = Math.round(currentWeatherTemp) + "°";
            currentWindEl.textContent = currentWeatherWind + " MPH";
            currentHumidityEl.textContent = currentWeatherHumidity + "%";
            currentWeatherIconEl.src = currentWeatherIconUrl;
        
            var apiWeatherForecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ cityCoordinatesLat + "&lon=" + cityCoordinatesLon +"&units=imperial&lan=en"+"&appid=" + apiKey;
            return  fetch(apiWeatherForecastURL); 
        }).then(function (futureWeatherResponse) {
            if (futureWeatherResponse.ok) {
              return futureWeatherResponse.json();
            } else {
              alert("Error: API couldnt not be reached \nMessage: " + futureWeatherResponse.statusText);
            }
            }).then(function (futureWeatherData) {
                var futureWeatherDays = futureWeatherData.list.filter(function(data) {
                //Remove HTML from container
                var forecastContainerEl = document.getElementById('forecast-container');
                forecastContainerEl.innerHTML = '';
                return data.dt_txt.endsWith('12:00:00');
            });
            for (var i = 0; i < futureWeatherDays.length; i++) {
                var futureWeatherDate = futureWeatherDays[i].dt;
                var futureWeatherTemp = futureWeatherDays[i].main.temp;
                var futureWeatherWind = Math.round(futureWeatherDays[i].wind.speed);
                var futureWeatherHumidity = futureWeatherDays[i].main.humidity;
                var futureWeatherIcon = futureWeatherDays[i].weather[0].icon; 

                //Forecast Container
                var forecastContainerEl = document.getElementById('forecast-container');
                // 1- create cards
                var forecastCardEl = document.createElement('article');
                forecastCardEl.classList.add('card')
                // 2- Create card body
                var forecastCardBody = document.createElement('div');
                forecastCardBody.classList.add('card-body', 'row','align-items-end')
                // 3- Add Date Header
                var forecastDateEl = document.createElement('h7');
                forecastDateEl.classList.add('col');
                forecastDateEl.textContent = (dayjs(futureWeatherDate * 1000).format('MM/DD'));
                // 4- Create Weather Image
                var forecastIconEl = document.createElement('img');
                forecastIconEl.classList.add('col');
                forecastIconEl.src = "https://openweathermap.org/img/w/" + futureWeatherIcon+".png"
                // 5 - Temp
                var forecastTempEl = document.createElement('h6');
                forecastTempEl.classList.add('col');
                forecastTempEl.textContent = Math.round(futureWeatherTemp) + "°";
                var forecastTempIconEl = document.createElement('i');
                forecastTempIconEl.classList.add('bi','bi-thermometer');
                // 6- Wind
                var forecastWindEl = document.createElement('div');
                forecastWindEl.classList.add('col');
                forecastWindEl = document.createElement('h6');
                forecastWindEl.classList.add('col');
            
                forecastWindEl.textContent = futureWeatherWind + " mph "
                var forecastWindIconEl = document.createElement('i');
                forecastWindIconEl.classList.add('bi','bi-wind');
                
                // 7 Humidity
                var forecastHumidityEl = document.createElement('h6');
                forecastHumidityEl.classList.add('col');
                forecastHumidityEl.textContent = futureWeatherHumidity + "% ";

                var forecastHumidityIconEl = document.createElement('i');
                forecastHumidityIconEl.classList.add('bi','bi-moisture');
                
                // 8- Add Components to HTML
                forecastContainerEl.append( forecastCardEl);
                forecastCardEl.append(forecastDateEl,forecastCardBody);
                
                forecastCardBody.append(forecastIconEl,forecastTempEl,forecastWindEl,forecastHumidityEl);

                forecastTempEl.append(forecastTempIconEl);
                forecastWindEl.append(forecastWindIconEl);
                forecastHumidityEl.append(forecastHumidityIconEl);
                hideSpinner();
            }       
    });
};

// Search Input and History
var searchHistoryEl = document.getElementById('city-search-history');
var stateSelected;
var citySearchString = 'New York,NY';
var citySearchHistoryString;
var citySearchHistoryArray = [];

function localStorageStringToArray() {
  citySearchHistoryString = localStorage.getItem('citysearch');
  if (citySearchHistoryString === null) {
      citySearchHistoryArray.push(citySearchString);
      localStorage.setItem("citysearch", JSON.stringify(citySearchHistoryArray));
      searchHistoryRender();
  } else {
      citySearchHistoryArray = JSON.parse(citySearchHistoryString);
      if (!citySearchHistoryArray.includes(citySearchString)) {
          if (citySearchHistoryArray.length >= 8) {
              citySearchHistoryArray.pop();
          }
          citySearchHistoryArray.unshift(citySearchString);
          localStorage.setItem("citysearch", JSON.stringify(citySearchHistoryArray));
          searchHistoryRender();
      }
  }  
}

   
function citySearch() {
    stateSelected = stateSelectorEl.value.trim();
    citySearchString = citySearchInputEl.value.trim();
    if (citySearchString == 0) {
        alert("Enter a search value");
        return;
    } else {
        citySearchString = citySearchInputEl.value.trim() + ',' + stateSelected;
        openWeatherMapForecast(citySearchString);
        citySearchInputEl.value = "";
    }  
};

function searchHistoryRender() {
  citySearchHistoryString = localStorage.getItem('citysearch');
  if (citySearchHistoryString == null) {
    return
  } else {
    citySearchHistoryString = localStorage.getItem('citysearch');
    citySearchHistoryArray = JSON.parse(citySearchHistoryString);
    searchHistoryEl.innerHTML = '';
   for (let i = 0; i < citySearchHistoryArray.length; i++) {
    let searchHistory = document.createElement('li');
    searchHistory.classList.add('btn', 'list-group-item','btn-outline-light');
    searchHistory.textContent = citySearchHistoryArray[i];
    searchHistoryEl.append(searchHistory);
   }
  }
}

citySearchButtonEl.addEventListener('click', citySearch);
// Click event to search from city history
const searchHistoryClickEl = document.getElementById('list-group-item');
searchHistoryEl.addEventListener('click',(event) => {
  if (event.target.tagName === 'LI') {
    const selectedText = event.target.textContent;
    citySearchString = selectedText;    
    openWeatherMapForecast()
  }
});

function init() {
  openWeatherMapForecast();
  searchHistoryRender();
  showSpinner();
}
init();
