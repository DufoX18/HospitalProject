const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Liberia,CR&appid=d6e78e9973c630eabf2059be4696b433&units=metric';


fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const temperature = data.main.temp;
        const location = data.name;
        const climaColumna = document.getElementById('clima-columna');
        climaColumna.innerHTML = `<h5>Temperatura en ${location}: ${temperature}°C</h5>`;
        climaColumna.innerHTML += `<img src="img/PROMED CV19 sello dark.webp" alt="">`;
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });

var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
    interval: 1
});


document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggle-menu');
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }
});







