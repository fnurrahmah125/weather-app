const form = document.querySelector("form");
const input = document.querySelector("form input");
const message = document.querySelector(".message");
const cards = document.querySelector(".cards");
let cities = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect all the information
  let value = input.value;
  const apiKey = "9970fd97858b5141cd2dd5357a426c43";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data["name"] == undefined) {
        message.textContent = "You entered wrong city name";
      }

      if (data["name"] != undefined) {
        // Check if there's already a city
        if (!cities.includes(data["name"])) {
          cities.push(data["name"]);
          message.textContent = "";

          // Timezone
          const timezone = data["timezone"];
          const timezoneInMinutes = timezone / 60;
          const currentDay = moment().utcOffset(timezoneInMinutes).format("dddd");
          const currentTime = moment().utcOffset(timezoneInMinutes).format("h:mm a");

          // Add new card
          const li = document.createElement("li");
          li.classList.add("card");
          li.classList.add(data["name"]);
          li.innerHTML = addCard(data, currentDay, currentTime);
          cards.appendChild(li);
        } else {
          message.textContent = "You already entered the city name";
        }
      }
      form.reset();
    });
});

// Kelvin to Celsius convertion
function convertion(temp) {
  return Math.round(temp - 273);
}

// Card content
function addCard(data, currentDay, currentTime) {
  return `
  <ion-icon name="close-outline" class="closeBtn" id="closeBtn"></ion-icon>

  <div class="cityInfo">
    ${data["name"]}, ${data["sys"]["country"]}
  </div>

  <div class="tempInfo">
    <img src="http://openweathermap.org/img/wn/${data["weather"]["0"]["icon"]}@2x.png" />
    <p class="temp">
    ${convertion(data["main"]["temp"])}<sup>&deg;</sup>
    </p>
    <p class="desc">${data["weather"][0]["description"]}</p>
  </div>

  <div class="weatherInfo">
    <p>
      <span>${currentDay}</span>
      <span>${currentTime}</span>
    </p>

    <p>
      <span>Wind</span>
      <span>${data["wind"]["speed"]} km/h</span>
    </p>

    <p>
      <span>Humidity</span>
      <span>${data["main"]["humidity"]}%</span>
    </p>
  </div>`;
}

// Remove selected card
cards.addEventListener("click", function (e) {
  if (e.target.id == "closeBtn") {
    e.preventDefault();
    e.target.parentElement.style.display = "none";

    let classNames = e.target.parentElement.className.split(" ");
    let newArray = cities.filter(function (city) {
      return city != classNames[1];
    });
    cities = newArray;
  }
});
