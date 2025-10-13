// Open-Meteo demo (Berlin coordinates)
// Default location: Kyiv, Ukraine (latitude, longitude)
const OPEN_METEO_CURRENT = 'https://api.open-meteo.com/v1/forecast?latitude=50.4501&longitude=30.5234&current_weather=true';
const OPEN_METEO_HOURLY = 'https://api.open-meteo.com/v1/forecast?latitude=50.4501&longitude=30.5234&hourly=temperature_2m&forecast_days=1&timezone=auto';

// Utility to set the active button state for accessibility
function setActiveButton(id) {
	const btnCurrent = document.getElementById('btn-current');
	const btnHourly = document.getElementById('btn-hourly');
	if (btnCurrent) btnCurrent.setAttribute('aria-pressed', id === 'btn-current');
	if (btnHourly) btnHourly.setAttribute('aria-pressed', id === 'btn-hourly');
}

// Fetch and render current weather
async function fetchCurrentWeather() {
	const output = document.getElementById('weather-output');
	const errorEl = document.getElementById('weather-error');
	output.textContent = 'Loading current weather...';
	errorEl.textContent = '';
	errorEl.setAttribute('aria-live', 'polite');

	try {
		const response = await fetch(OPEN_METEO_CURRENT, { mode: 'cors' });
		console.log('Open-Meteo current response status:', response.status);
		if (!response.ok) throw new Error(`Open Meteo API error: ${response.status} ${response.statusText}`);
		const data = await response.json();
		console.log('Open Meteo current data:', data);
		const cw = data.current_weather;
		if (!cw) {
			output.textContent = 'No current weather data available.';
			return;
		}
		errorEl.setAttribute('aria-live', 'polite');
		output.innerHTML = `
			<strong>Temperature:</strong> ${cw.temperature} °C<br>
			<strong>Wind speed:</strong> ${cw.windspeed} m/s<br>
			<strong>Wind direction:</strong> ${cw.winddirection}°<br>
			<small>Time: ${cw.time}</small>
		`;
	} catch (err) {
		console.error('Error fetching Open-Meteo current:', err);
		output.textContent = '';
		errorEl.setAttribute('aria-live', 'assertive');
		errorEl.textContent = 'Failed to load current weather. See console for details.';
	}
}

// Fetch and render hourly temperature for the next 24 hours
async function fetchHourlyTemp() {
	const output = document.getElementById('weather-output');
	const errorEl = document.getElementById('weather-error');
	output.textContent = 'Loading hourly temperatures...';
	errorEl.textContent = '';
	errorEl.setAttribute('aria-live', 'polite');

	try {
		const response = await fetch(OPEN_METEO_HOURLY, { mode: 'cors' });
		console.log('Open-Meteo hourly response status:', response.status);
		if (!response.ok) throw new Error(`Open Meteo API error: ${response.status} ${response.statusText}`);
		const data = await response.json();
		console.log('Open Meteo hourly data:', data);

		const hourly = data.hourly;
		if (!hourly || !hourly.time || !hourly.temperature_2m) {
			output.textContent = 'No hourly temperature data available.';
			return;
		}

		// Build a small table showing the next 24 hourly values (or available length)
		const times = hourly.time;
		const temps = hourly.temperature_2m;
		const rows = Math.min(times.length, temps.length, 24);
		let table = '<table class="hourly-table"><thead><tr><th>Time</th><th>Temp (°C)</th></tr></thead><tbody>';
		for (let i = 0; i < rows; i++) {
			table += `<tr><td>${times[i]}</td><td>${temps[i]}</td></tr>`;
		}
		table += '</tbody></table>';
		errorEl.setAttribute('aria-live', 'polite');
		output.innerHTML = table;
	} catch (err) {
		console.error('Error fetching Open-Meteo hourly:', err);
		output.textContent = '';
		errorEl.setAttribute('aria-live', 'assertive');
		errorEl.textContent = 'Failed to load hourly data. See console for details.';
	}
}

// Wire up buttons and initial load
window.addEventListener('DOMContentLoaded', function() {
	const btnCurrent = document.getElementById('btn-current');
	const btnHourly = document.getElementById('btn-hourly');
	if (btnCurrent) btnCurrent.addEventListener('click', function() {
		setActiveButton('btn-current');
		fetchCurrentWeather();
	});
	if (btnHourly) btnHourly.addEventListener('click', function() {
		setActiveButton('btn-hourly');
		fetchHourlyTemp();
	});

	// Load current weather by default
	setActiveButton('btn-current');
	fetchCurrentWeather();
});

