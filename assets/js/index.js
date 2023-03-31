$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const btn_search = $(".search");
const input = $(".js__input");
const Img__loader = $(".Img__loader");
const main__wrapper = $(".main__wrapper");
const img__location = $(".img__location");
// Click vào btuong thi focus ra input
img__location.addEventListener("click", () => {
  input.focus();
});
// Định dạng thời gian
function time() {
  // Phần định dạng ngày tháng
  const day = $(".js_day");
  let daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // số liệu ngày tháng
  const datetime = new Date();
  $(
    ".js_DateTime"
  ).innerHTML = `${datetime.getDate()}th${datetime.getMonth()} ${datetime.getFullYear()}`;

  $(".js__day").innerHTML = `${daysOfWeek[datetime.getDay()]} ${datetime
    .getHours()
    .toString()
    .padStart(2, "0")}:${datetime.getMinutes().toString().padStart(2, "0")}`;
}
// Cập nhật thời gian sau mỗi 1s
setInterval(time(), 1000);
function changeWeatherUI(weather, address) {
  // console.log(weather.sys.sunrise);
  const temperature = $(".js__value__temperature");
  const weather__img = $(".weather_img");
  const wind = $$(".wind--speed");
  const hum = $$(".hum--speed");
  const rain = $$(".rain--speed");
  const time__goodsr = $(".time__goodsr");
  const time__goodsn = $(".time__goodsn");
  const sunrise = new Date(weather.sys.sunrise * 1000); // Chuyển đổi epoch time thành đối tượng Date
  const sunset = new Date(weather.sys.sunset * 1000); // Chuyển đổi epoch time thành đối tượng Date
  const sunriseHours = sunrise.getHours().toString().padStart(2, "0");
  const sunriseMinutes = sunrise.getMinutes().toString().padStart(2, "0");
  const sunsetHours = sunset.getHours().toString().padStart(2, "0");
  const sunsetMinutes = sunset.getMinutes().toString().padStart(2, "0");
  if (sunriseHours > 12) {
    time__goodsr.innerHTML = `${sunriseHours}:${sunriseMinutes} Pm`;
  } else {
    time__goodsr.innerHTML = `${sunriseHours}:${sunriseMinutes} Am`;
  }
  if (sunsetHours > 12) {
    time__goodsn.innerHTML = `${sunsetHours}:${sunsetMinutes} Pm`;
  } else {
    time__goodsn.innerHTML = `${sunsetHours}:${sunsetMinutes} Am`;
  }
  input.value = address;
  temperature.innerHTML = `${Math.round(weather.main.temp)}`;
  for (let i = 0; i < hum.length; i++) {
    hum[i].innerHTML = `${weather.main.humidity} %`;
    wind[i].innerHTML = `${weather.wind.speed} m/s`;
    rain[i].innerHTML = `${weather.clouds.all} %`;
  }
  switch (weather.weather[0].main) {
    case "Clouds":
      weather__img.classList.add("Clouds");
      break;
    case "Rain":
      weather__img.classList.add("Rain");
      break;
    case "Sunny":
      weather__img.classList.add("Sunny");
      break;
  }
}
// xử lí vị trí hiện tại của mình
ischeck = true;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      ischeck = true;
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      API__Location = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1eac073ede7042b880834029e3bd0bfe`;
      Location(API__Location);
    },
    function (error) {
      ischeck = false;
      $(".search-bar").classList.remove("hidden");
      Img__loader.style.opacity = "0.4";
      $(".search-btn").addEventListener("click", () => {
        ischeck = true;
        $(".search-bar").classList.add("hidden");
        getWeather($(".input__search").value);
      });
    }
  );
} else {
  console.log("Phần mềm của bạn không được hỗ trợ");
}

async function Location(API_location) {
  const response = await fetch(API_location);
  const data = await response.json();
  const city = data.results[0].components.city;
  getWeather(city);
}
btn_search.addEventListener("click", () => {
  setInterval(() => {
    getWeather(input.value);
  }, 3000);
});
async function getWeather(input) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=266631f1219df91f82507981d2e12005
  `;
  const urlfor4days = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${input}&appid=266631f1219df91f82507981d2e12005`;

  // 5 ngày tiếp theo
  // const res2 = await fetch(urlfor4days);
  // const weatherfor4days = await res2.json();
  // console.log(weatherfor4days);

  // fetch dữ liệu hiện tại

  const res = await fetch(url);
  // trường hợp thành công
  if (res.ok) {
    const weather = await res.json();
    const address = input;
    Img__loader.classList.add("hidden");
    main__wrapper.classList.remove("hidden");
    changeWeatherUI(weather, address);
  } else {
    // hiển thị popup thông báo
  }
}
