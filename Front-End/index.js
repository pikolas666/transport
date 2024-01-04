const couriersURL = "https://transport-calculator-back-end.onrender.com/";
const couriersEndpoint = "couriers";
const usersEndpoint = "users";
const postalServicesEndpoint = "postal-services";
const result = document.getElementById("result");
const resultpost = document.getElementById("resultpost");
const searchCourierBtn = document.getElementById("search-courier");
const searchPostBtn = document.getElementById("search-post");
const loginBtn = document.getElementById("loginBtn");
const logOutBtn = document.getElementById("logOutBtn");
const loginWrapper = document.getElementById("login-wrapper");
const CountryTextbox = document.getElementById("CountryInput");
const WeightTextbox = document.getElementById("WeightInput");
const SizeTextbox = document.getElementById("sizeInput");
const CountryTextboxPost = document.getElementById("CountryInputPost");
const WeightTextboxPost = document.getElementById("WeightInputPost");
const passwordInput = document.getElementById("password-input");
const showModuleBtn = document.getElementById("show-module");
const courierModule = document.getElementById("courier-module");
const postModule = document.getElementById("post-module");
const courier = document.getElementById("courier");
const country = document.getElementById("country");
const weight = document.getElementById("weight");
const price = document.getElementById("price");
const courierPost = document.getElementById("courier-post");
const countryPost = document.getElementById("country-post");
const weightPost = document.getElementById("weight-post");
const pricePost = document.getElementById("price-post");
const packageSize = document.getElementById("package-size");
const addCourierBtn = document.getElementById("show-module");
const addPostalServiceBtn = document.getElementById("show-postal-module");

const showModule = (typeId) => {
	const type = document.getElementById(typeId);
	if (type) {
		type.style.display = "block";
	}
};

const hideModule = (typeId) => {
	const type = document.getElementById(typeId);
	if (type) {
		type.style.display = "none";
	}
};

const addService = async (serviceType) => {
	try {
		const jwtToken = getCookie("jwt");

		let endpoint;
		let courierData;

		if (serviceType === "couriers") {
			endpoint = couriersEndpoint;
			courierData = {
				courier: courier.value,
				country: country.value,
				weight: weight.value,
				price: price.value,
			};
		} else if (serviceType === "postalServices") {
			endpoint = postalServicesEndpoint;
			courierData = {
				courier: courierPost.value,
				country: countryPost.value,
				weight: weightPost.value,
				price: pricePost.value,
				package_size: packageSize.value,
			};
		} else {
			throw new Error("Invalid service type");
		}

		const body = JSON.stringify(courierData);

		const headers = {
			authorization: jwtToken,
			"Content-Type": "application/json",
		};

		const response = await fetch(`${couriersURL}${endpoint}`, {
			method: "POST",
			headers: headers,
			body: body,
		});

		if (!response.ok) {
			// Update the message element based on the service type
			if (serviceType === "couriers") {
				document.getElementById(
					"message-courier"
				).textContent = `Error adding ${serviceType}`;
			} else if (serviceType === "postalServices") {
				document.getElementById(
					"message-postal"
				).textContent = `Error adding ${serviceType}`;
			}

			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();

		// Update the message element based on the service type
		if (serviceType === "couriers") {
			document.getElementById(
				"message-courier"
			).textContent = `${serviceType} added successfully`;
		} else if (serviceType === "postalServices") {
			document.getElementById(
				"message-postal"
			).textContent = `${serviceType} added successfully`;
		}

		return result;
	} catch (error) {
		console.error(`Error adding ${serviceType}:`, error);
		return [];
	}
};

function getCookie(name) {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + "=")) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}

const fetchData = async (url, endpoint) => {
	try {
		// Retrieve the JWT token from the client's cookies
		const jwtToken = getCookie("jwt");
		if (!jwtToken) {
			console.log(jwtToken);
			result.textContent = "Please log in";
			resultpost.textContent = "Please log in";
		}
		// Implement the getCookie function as shown in a previous response.

		const headers = {
			authorization: jwtToken,
			"Content-Type": "application/json", // You can include other headers if needed
		};

		const response = await fetch(url + endpoint, {
			headers: headers,
		});

		return await response.json();
	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
};

const calc = () => {
	result.innerHTML = "Calculating...";
};

const processSearch = async () => {
	const couriersArray = await fetchData(couriersURL, couriersEndpoint);

	let countryToSearch = CountryTextbox.value;
	let weightToSearch = WeightTextbox.value;

	const results = couriersArray.filter((courier) => {
		return (
			courier.country === countryToSearch &&
			courier.weight >= weightToSearch &&
			courier.price !== null
		);
	});

	if (results.length > 0) {
		let filtered = results.sort((a, b) => (a.price > b.price ? 1 : -1));
		let bestPrice = filtered[0];
		let secondBest = filtered[1];
		if (secondBest) {
			result.innerHTML =
				"Courier: " +
				bestPrice.courier +
				", " +
				"Country: " +
				bestPrice.country +
				", " +
				"Courier weight: " +
				bestPrice.weight +
				", " +
				"Price: " +
				bestPrice.price.toFixed(2) +
				" / second best price - " +
				secondBest.courier +
				" price " +
				secondBest.price;
		} else {
			result.innerHTML =
				"Courier: " +
				bestPrice.courier +
				", " +
				"Country: " +
				bestPrice.country +
				", " +
				"Courier weight: " +
				bestPrice.weight +
				", " +
				"Price: " +
				bestPrice.price.toFixed(2) +
				" . No other options available";
		}
	} else {
		result.innerHTML = "No results found.";
	}
};
const calcpost = () => {
	resultpost.innerHTML = "Calculating...";
};

const processPost = async () => {
	const couriersArray = await fetchData(couriersURL, postalServicesEndpoint);

	let packageSize = SizeTextbox.value;
	let countryToSearchPost = CountryTextboxPost.value;
	let weightToSearchPost = WeightTextboxPost.value;

	const resultsPost = couriersArray.filter((courier) => {
		return (
			courier.country === countryToSearchPost &&
			courier.weight >= weightToSearchPost &&
			courier.price !== null &&
			packageSize === courier.package_size
		);
	});

	if (resultsPost.length > 0) {
		let filteredPost = resultsPost.sort((a, b) => (a.price > b.price ? 1 : -1));
		let bestPricePost = filteredPost[0];
		let secondBestPost = filteredPost[1];
		if (secondBestPost) {
			resultpost.innerHTML =
				"Courier: " +
				bestPricePost.courier +
				", " +
				"Country: " +
				bestPricePost.country +
				", " +
				"package size: " +
				bestPricePost.package_size +
				", " +
				"Courier weight: " +
				bestPricePost.weight +
				", " +
				"Price: " +
				bestPricePost.price.toFixed(2) +
				" / second best price - " +
				secondBestPost.courier +
				" price " +
				secondBestPost.price;
		} else {
			resultpost.innerHTML =
				"Courier: " +
				bestPricePost.courier +
				", " +
				"Country: " +
				bestPricePost.country +
				", " +
				"package size: " +
				bestPricePost.package_size +
				", " +
				"Courier weight: " +
				bestPricePost.weight +
				", " +
				"Price: " +
				bestPricePost.price.toFixed(2) +
				" . No other options available";
		}
	} else {
		resultpost.innerHTML = "No results found.";
	}
};

searchCourierBtn.addEventListener("click", () => {
	calc();
	processSearch();
	updateDOMForLoggedInUser();
});

searchPostBtn.addEventListener("click", () => {
	calcpost();
	processPost();
	updateDOMForLoggedInUser();
});

const logIn = async () => {
	const name = document.getElementById("name-input").value;
	const password = document.getElementById("password-input").value;
	const login = {
		name: name,
		password: password,
	};

	try {
		const response = await fetch(couriersURL + usersEndpoint + "/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(login),
		});

		if (response.status === 201) {
			console.log("User logged in");
			document.getElementById("name-input").value = "";
			document.getElementById("password-input").value = "";

			// Extract the JWT token from the response
			const responseBody = await response.json();
			const jwtToken = responseBody.jwt;

			// Save the JWT token in a cookie
			document.cookie = `jwt=${jwtToken}; path=/;`;
			updateDOMForLoggedInUser();
		} else if (response.status === 401) {
			console.log("Bad auth");
		} else if (response.status === 404) {
			console.log("User does not exist");
		} else {
			console.log("Error occurred");
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
};

function updateDOMForLoggedInUser() {
	if (isLoggedIn()) {
		// User is logged in
		loginBtn.style.display = "none"; // Hide the login button
		logOutBtn.style.display = "block"; // Show the log out button
		addCourierBtn.style.display = "inline-block";
		addPostalServiceBtn.style.display = "inline-block";
		loginWrapper.style.display = "none";
	} else {
		loginBtn.style.display = "block";
		logOutBtn.style.display = "none";
		loginWrapper.style.display = "flex";
		addCourierBtn.style.display = "none";
		addPostalServiceBtn.style.display = "none";
	}
}
function isLoggedIn() {
	// Get the JWT token from cookies
	const jwtToken = getCookie("jwt");

	// Check if the JWT token exists and is not empty
	if (!jwtToken || jwtToken.trim() === "") {
		return false;
	}

	// Decode the JWT token (You may need a JWT library for this)
	const tokenData = jwtToken.split(".")[1]; // Assuming JWT is base64 encoded
	const tokenDecoded = JSON.parse(atob(tokenData));

	// Check if the token has an "exp" (expiration) claim
	if (tokenDecoded.exp) {
		const expirationTime = tokenDecoded.exp * 1000; // Convert to milliseconds

		// Check if the token has not expired
		return Date.now() < expirationTime;
	}

	// If the token doesn't have an "exp" claim, you may choose to consider it as valid
	return true;
}
function getCookie(name) {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + "=")) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}

loginBtn.addEventListener("click", logIn);

logOutBtn.addEventListener("click", () => {
	document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	console.log("user signed out");
	result.textContent = "User signed out";
	resultpost.textContent = "User signed out";
	CountryTextbox.value = "";
	WeightTextbox.value = "";
	SizeTextbox.value = "";
	CountryTextboxPost.value = "";
	WeightTextboxPost.value = "";

	updateDOMForLoggedInUser();
});

passwordInput.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		logIn();
	}
});
