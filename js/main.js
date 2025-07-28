/**
 * Kire's Portfolio JavaScript
 * Clean, accessible theme switching that just works
 */

(function () {
	"use strict";

	// Keep it simple - just what we need
	const CONFIG = {
		STORAGE_KEY: "theme-preference",
		THEMES: {
			LIGHT: "light",
			DARK: "dark",
			AUTO: "auto",
		},
		MEDIA_QUERY: "(prefers-color-scheme: dark)",
	};

	/**
	 * Theme Manager - handles light/dark/auto switching
	 * No fancy stuff, just solid functionality
	 */
	const ThemeManager = {
		/**
		 * Get this party started
		 */
		init() {
			this.setupEventListeners();
			this.loadUserPreference();
			this.watchSystemChanges();
		},

		/**
		 * Wire up the theme radio buttons
		 */
		setupEventListeners() {
			const themeInputs = document.querySelectorAll('input[name="theme"]');

			themeInputs.forEach((input) => {
				input.addEventListener("change", (e) => {
					const theme = e.target.value;
					this.applyTheme(theme);
					this.savePreference(theme);
					this.announceChange(theme);
				});
			});
		},

		/**
		 * Apply the selected theme to the page
		 */
		applyTheme(theme) {
			const body = document.body;

			switch (theme) {
				case CONFIG.THEMES.LIGHT:
					body.setAttribute("data-theme", "light");
					break;
				case CONFIG.THEMES.DARK:
					body.setAttribute("data-theme", "dark");
					break;
				case CONFIG.THEMES.AUTO:
					this.applySystemTheme();
					break;
				default:
					// Fallback to auto if something weird happens
					this.applySystemTheme();
			}
		},

		/**
		 * Use system preference for auto theme
		 */
		applySystemTheme() {
			const prefersDark = window.matchMedia(CONFIG.MEDIA_QUERY).matches;
			document.body.setAttribute("data-theme", prefersDark ? "dark" : "light");
		},

		/**
		 * Save user's choice to localStorage
		 * Gracefully handle when localStorage isn't available
		 */
		savePreference(theme) {
			try {
				localStorage.setItem(CONFIG.STORAGE_KEY, theme);
			} catch (error) {
				// No localStorage? No problem, just keep going
				console.info("Theme preference not saved - localStorage unavailable");
			}
		},

		/**
		 * Load saved preference or default to auto
		 */
		loadUserPreference() {
			let savedTheme = CONFIG.THEMES.AUTO; // Default fallback

			try {
				savedTheme =
					localStorage.getItem(CONFIG.STORAGE_KEY) || CONFIG.THEMES.AUTO;
			} catch (error) {
				// localStorage issues? Just use auto
				console.info("Using auto theme - localStorage unavailable");
			}

			// Set the radio button
			this.selectThemeInput(savedTheme);
			// Apply the theme
			this.applyTheme(savedTheme);
		},

		/**
		 * Check the right radio button
		 */
		selectThemeInput(theme) {
			const input = document.querySelector(`input[value="${theme}"]`);
			if (input) {
				input.checked = true;
			}
		},

		/**
		 * Watch for system theme changes when auto is selected
		 */
		watchSystemChanges() {
			const mediaQuery = window.matchMedia(CONFIG.MEDIA_QUERY);

			const handleSystemChange = () => {
				const currentTheme = this.getCurrentTheme();
				if (currentTheme === CONFIG.THEMES.AUTO) {
					this.applySystemTheme();
				}
			};

			// Use the modern API if available, fallback for older browsers
			if (mediaQuery.addEventListener) {
				mediaQuery.addEventListener("change", handleSystemChange);
			} else if (mediaQuery.addListener) {
				mediaQuery.addListener(handleSystemChange);
			}
		},

		/**
		 * Get the currently selected theme
		 */
		getCurrentTheme() {
			const checkedInput = document.querySelector(
				'input[name="theme"]:checked'
			);
			return checkedInput ? checkedInput.value : CONFIG.THEMES.AUTO;
		},

		/**
		 * Announce theme changes to screen readers
		 * Because accessibility matters
		 */
		announceChange(theme) {
			const message = `Theme switched to ${theme}`;

			// Create a temporary announcement element
			const announcer = document.createElement("div");
			announcer.setAttribute("aria-live", "polite");
			announcer.className = "visually-hidden";
			announcer.textContent = message;

			document.body.appendChild(announcer);

			// Clean up after announcement
			setTimeout(() => {
				if (announcer.parentNode) {
					announcer.parentNode.removeChild(announcer);
				}
			}, 1000);
		},
	};

	/**
	 * Utility functions for debugging and error handling
	 */
	const Utils = {
		/**
		 * Simple logging with timestamps
		 */
		log(message, level = "log") {
			if (console && console[level]) {
				const timestamp = new Date().toLocaleTimeString();
				console[level](`[${timestamp}] Portfolio: ${message}`);
			}
		},

		/**
		 * Check if we have the basics we need
		 */
		browserSupportsBasics() {
			return !!(
				document.querySelector &&
				document.addEventListener &&
				window.matchMedia
			);
		},
	};

	/**
	 * Initialize everything when the DOM is ready
	 */
	function init() {
		// Basic feature detection
		if (!Utils.browserSupportsBasics()) {
			Utils.log("Browser doesn't support required features", "warn");
			return;
		}

		// Start the theme manager
		ThemeManager.init();
		Utils.log("Portfolio initialized successfully");
	}

	/**
	 * Wait for DOM to be ready
	 */
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		// DOM is already ready
		init();
	}

	/**
	 * Global error handling - log errors but don't break the site
	 */
	window.addEventListener("error", function (event) {
		Utils.log(
			`JavaScript error: ${event.error?.message || event.message}`,
			"error"
		);
	});

	/**
	 * Expose for debugging in dev tools if needed
	 * Remove this in production if you want
	 */
	if (typeof window !== "undefined") {
		window.KirePortfolio = {
			ThemeManager,
			Utils,
			version: "1.0.0",
		};
	}
})();
