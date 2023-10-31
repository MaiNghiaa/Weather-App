// Chọn các phần tử DOM và gán chúng vào các biến để sử dụng dễ dàng

$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const btn_search = $(".search");
const input = $(".js__input");
const Img__loader = $(".Img__loader");
const main__wrapper = $(".main__wrapper");
const img__location = $(".img__location");
// Khi người dùng click vào hình ảnh địa điểm, trường nhập liệu sẽ được focus
img__location.addEventListener("click", () => {
  input.focus();
});
// Hàm định dạng và hiển thị thời gian và ngày tháng
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
// Cập nhật thời gian sau mỗi 1 giây bằng cách gọi hàm `time()` qua `setInterval`
setInterval(time(), 1000);
// Hàm này cập nhật giao diện dựa trên dữ liệu thời tiết và địa chỉ được truyền vào

function changeWeatherUI(weather, address) {
  console.log(weather, address);
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
// Lấy vị trí hiện tại của người dùng nếu trình duyệt hỗ trợ geolocation

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      console.log(latitude, longitude);
      API__Location = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=266631f1219df91f82507981d2e12005`;
      LocationLocal(API__Location);
    },
    function (error) {
      ischeck = false;
      $(".search-bar").classList.remove("hidden");
      Img__loader.style.opacity = "0.4";
      $(".search-btn").addEventListener("click", () => {
        $(".search-bar").classList.add("hidden");
        getWeather($(".input__search").value);
      });
    }
  );
} else {
  console.log("Phần mềm của bạn không được hỗ trợ");
}

async function LocationLocal(API_location) {
  console.log("check");
  const response = await fetch(API_location);
  const data = await response.json();
  // console.log(data.name);
  const city = data.name;
  // console.log(data);
  getWeather(city);
}
btn_search.addEventListener("click", () => {
  console.log(input.value);
  setInterval(() => {
    getWeather(input.value);
  }, 3000);
});
// Hàm xử lý khi người dùng nhấn nút tìm kiếm
// Hàm lấy dữ liệu thời tiết từ API OpenWeatherMap dựa trên tên thành phố được nhập vào

async function getWeather(input) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=266631f1219df91f82507981d2e12005
  `;
  // const urlfor4days = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${input}&appid=266631f1219df91f82507981d2e12005`;

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
