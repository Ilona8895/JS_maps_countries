const map = L.map("map").setView([51.919437, 19.145136], 5);

const marker = L.marker([51.919437, 19.145136]).addTo(map);

//zmiana w pliku

// // // // const marker = [];
// // // // let number = 10;
// // // // let lat = 51.919437;
// // // // let long = 19.145136;
// // // // for (let i = 0; i < number; i += 0.005) {
// // // //   marker.push(L.marker([lat + i, long + i]).addTo(map));
// // // // }

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

googleHybrid.addTo(map);

(async () => {
  const parent = document.querySelector("#countrySelect");

  const res = await fetch("https://restcountries.com/v3.1/all");
  const json = await res.json();
  // console.log(json);
  json.forEach((element) => {
    // console.log(element.name.common)
    const option = document.createElement("option");
    option.value = element.name.common;
    option.innerText = element.name.common;
    if (element.name.common == "Poland") option.setAttribute("selected", "");
    parent.appendChild(option);
  });

  parent.removeAttribute("disabled");
})();

window.addEventListener("load", (e) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200)
      fillCountryData(JSON.parse(xhttp.response));
  };
  xhttp.open("GET", `https://restcountries.com/v3.1/name/Poland`, true);
  xhttp.send();
});

parent.addEventListener("change", (e) => {
  const option = e.target.value;

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200)
      fillCountryData(JSON.parse(xhttp.response));
  };
  xhttp.open("GET", `https://restcountries.com/v3.1/name/${option}`, true);
  xhttp.send();
});

function fillCountryData(text) {
  const textEl = text[0];
  // console.log(textEl)

  const countryData = document.querySelector("#countryData");
  countryData.innerHTML = `
            <h3 class="country-name">
                ${textEl.name.common}
            </h3>
            <div>
               Stolica: <strong>${textEl.capital[0]}</strong>
            </div>
            <div>
                Region: <strong>${textEl.region}</strong>
            </div>
            <div>
                Podregion: <strong>${textEl.subregion}</strong>
            </div>
            <div>
                Liczba ludności: <strong>${textEl.population}</strong>
            </div>
            <div>
                Strefa czasowa: <strong>${textEl.timezones}</strong>
            </div>
    `;

  const countryFlag = document.querySelector("#countryFlag");
  countryFlag.setAttribute("src", textEl.flags.png);
  countryFlag.setAttribute("alt", textEl.flags.alt);

  map.setView([textEl.latlng[0], textEl.latlng[1]], 5);

  marker.setLatLng([textEl.latlng[0], textEl.latlng[1]]);
}
