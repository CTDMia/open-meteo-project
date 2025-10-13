// Open-Meteo demo fetch (Berlin coordinates)
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true';

function fetchOpenMeteo() {
	const output = document.getElementById('weather-output');
	const errorEl = document.getElementById('weather-error');
	output.textContent = 'Loading...';
	errorEl.textContent = '';
	// ensure polite by default
	errorEl.setAttribute('aria-live', 'polite');

	console.log('Fetching Open-Meteo URL:', OPEN_METEO_URL);
	fetch(OPEN_METEO_URL, { mode: 'cors' })
		.then(function(response) {
			console.log('Open-Meteo response status:', response.status);
			if (!response.ok) {
				throw new Error(`Open Meteo API error: ${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.then(function(data) {
			console.log('Open Meteo data:', data);
			// Simple display of the current weather object
			const cw = data.current_weather;
					if (!cw) {
						output.textContent = 'No current weather data available.';
						return;
					}
					// success - set polite
					errorEl.setAttribute('aria-live', 'polite');
			output.innerHTML = `
				<strong>Temperature:</strong> ${cw.temperature} °C<br>
				<strong>Wind speed:</strong> ${cw.windspeed} m/s<br>
				<strong>Wind direction:</strong> ${cw.winddirection}°<br>
				<small>Time: ${cw.time}</small>
			`;
		})
		.catch(function(err) {
			console.error('Error fetching Open-Meteo:', err);
			output.textContent = '';
				// show visible error and announce assertively
				errorEl.setAttribute('aria-live', 'assertive');
				errorEl.textContent = 'Failed to load weather data. See console for details.';
		});
}

window.addEventListener('DOMContentLoaded', fetchOpenMeteo);

