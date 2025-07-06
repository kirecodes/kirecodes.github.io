const clock = document.getElementById("clock");
clock.textContent = new Date().toLocaleTimeString("en-US", {
	timeZone: "America/Denver",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});
