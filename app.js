// app.js
// Alsahir Ali Alqarni - Assignment 2
// Handles API communication, events, and dynamic DOM updates.

"use strict";

// ==== DOM ELEMENTS ====
const userForm = document.getElementById("userForm");
const countInput = document.getElementById("count");
const genderSelect = document.getElementById("gender");
const usersContainer = document.getElementById("usersContainer");
const apiMessage = document.getElementById("apiMessage");
const clearBtn = document.getElementById("clearBtn");
const countHelp = document.getElementById("countHelp");

// ==== HELPER FUNCTIONS ====

// Show info / error messages
function showMessage(text, type) {
    apiMessage.textContent = text;
    // base class + optional modifier
    apiMessage.className = "api-message" + (type ? " " + type : "");
}

// Remove all user cards from the page (dynamic removal)
function clearUsers() {
    usersContainer.innerHTML = "";
}

// Create and append user cards (dynamic creation)
function renderUsers(users) {
    clearUsers();

    users.forEach(function (user) {
        const card = document.createElement("article");
        card.classList.add("card", "api-card");

        const fullName = user.name.title + " " + user.name.first + " " + user.name.last;
        const email = user.email;
        const country = user.location.country;
        const city = user.location.city;
        const phone = user.phone;
        const username = user.login.username;
        const picture = user.picture.medium;

        card.innerHTML =
            '<div class="api-card-header">' +
            '  <img src="' + picture + '" alt="Profile picture of ' + fullName + '">' +
            '  <div>' +
            "    <h3>" + fullName + "</h3>" +
            '    <p class="api-username">@' + username + "</p>" +
            "  </div>" +
            "</div>" +
            '<ul class="api-card-list">' +
            "  <li><strong>Email:</strong> " + email + "</li>" +
            "  <li><strong>Phone:</strong> " + phone + "</li>" +
            "  <li><strong>Location:</strong> " + city + ", " + country + "</li>" +
            "</ul>";

        usersContainer.appendChild(card);
    });
}

// ==== EVENTS ====

// 1) keyup: update helper text as user types number
countInput.addEventListener("keyup", function () {
    var value = countInput.value;
    countHelp.textContent = value
        ? "Users to fetch: " + value
        : "Users to fetch: ?";
});

// 2) click: clear button removes cards
clearBtn.addEventListener("click", function () {
    clearUsers();
    showMessage("All generated users have been cleared.", "info");
});

// 3) submit: fetch data from external API with AJAX (fetch)
userForm.addEventListener("submit", function (event) {
    event.preventDefault(); // keep page from reloading

    var count = Number(countInput.value);

    // simple validation for count
    if (!count || count < 1 || count > 5) {
        showMessage("Please enter a number between 1 and 5.", "error");
        clearUsers();
        return;
    }

    var gender = genderSelect.value.trim();
    var url = "https://randomuser.me/api/?results=" + count;

    if (gender) {
        url += "&gender=" + gender;
    }

    showMessage("Fetching users from the API...", "info");

    // AJAX request using fetch (async)
    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error("Unexpected data format from API.");
            }

            renderUsers(data.results);
            showMessage("Successfully loaded " + data.results.length + " user(s).", "info");
        })
        .catch(function (error) {
            // network / API error
            clearUsers();
            showMessage(
                "Failed to fetch user data. Please check your internet connection and try again.",
                "error"
            );
            console.error(error);
        });
});
