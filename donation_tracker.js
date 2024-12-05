// Array to temporarily store donation data
let donations = [];

/**
 * Validates the form inputs.
 * @param {string} charityName
 * @param {string} donationAmount
 * @param {string} donationDate
 * @returns {boolean} True if inputs are valid, false otherwise.
 */
function validateInputs(charityName, donationAmount, donationDate) {
    if (charityName === "" || donationAmount === "" || donationDate === "") {
        return false;
    }

    const amountNumber = parseFloat(donationAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
        return false;
    }

    return true;
}

/**
 * Handles form submission.
 * @param {object} formData
 * @returns {object|null} The donation object if valid, null otherwise.
 */
function handleFormSubmission(formData) {
    const { charityName, donationAmount, donationDate, donorComment } = formData;

    if (!validateInputs(charityName, donationAmount, donationDate)) {
        return null;
    }

    const donation = {
        charityName,
        donationAmount: parseFloat(donationAmount),
        donationDate,
        donorComment,
    };

    if (!global.donations) global.donations = []; // Ensure global donations is initialized
    global.donations.push(donation);

    saveDonationsToLocalStorage();
    return donation;
}

/**
 * Saves donations to localStorage.
 */
function saveDonationsToLocalStorage() {
    localStorage.setItem("donations", JSON.stringify(global.donations));
}

/**
 * Loads donations from localStorage.
 */
function loadDonationsFromLocalStorage() {
    const savedDonations = JSON.parse(localStorage.getItem("donations"));
    if (savedDonations) {
        donations = savedDonations;
    }
}

/**
 * Renders the donation table.
 */
function renderTable() {
    const tableBody = document.querySelector("#donationTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    donations.forEach((donation, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${donation.charityName}</td>
            <td>$${donation.donationAmount.toFixed(2)}</td>
            <td>${donation.donationDate}</td>
            <td>${donation.donorComment}</td>
            <td><button class="deleteBtn" data-index="${index}">Delete</button></td>
        `;

        tableBody.appendChild(row);
    });

    updateTotalDonations();
}

/**
 * Updates the total donations summary.
 */
function updateTotalDonations() {
    const total = global.donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
    const totalElement = document.querySelector("#totalDonations");
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Deletes a donation by index.
 * @param {number} index The index of the donation to delete.
 */
function deleteDonation(index) {
    if (!global.donations) return;
    global.donations.splice(index, 1);
    saveDonationsToLocalStorage();
}

/**
 * Sets up event listeners for the form and table.
 */
function setupEventListeners() {
    const form = document.querySelector("#donation-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const charityName = document.querySelector("#charity-name").value.trim();
            const donationAmount = document.querySelector("#donation-amount").value.trim();
            const donationDate = document.querySelector("#donation-date").value;
            const donorComment = document.querySelector("#donor-comment").value.trim();

            const formData = { charityName, donationAmount, donationDate, donorComment };

            const donation = handleFormSubmission(formData);

            if (donation) {
                alert("Donation successfully added!");
                e.target.reset();
            } else {
                alert("Please fill out all required fields correctly.");
            }
        });
    }

    const table = document.querySelector("#donationTable");
    if (table) {
        table.addEventListener("click", function (e) {
            if (e.target.classList.contains("deleteBtn")) {
                const index = e.target.getAttribute("data-index");
                deleteDonation(index);
            }
        });
    }
}

/**
 * Initializes the donation tracker.
 */
function initDonationTracker() {
    loadDonationsFromLocalStorage();
    renderTable();
    setupEventListeners();
}

// Export functions for testing in Jest
if (typeof window === "undefined") {
    module.exports = {
        validateInputs,
        handleFormSubmission,
        saveDonationsToLocalStorage,
        loadDonationsFromLocalStorage,
        renderTable,
        updateTotalDonations,
        deleteDonation,
        setupEventListeners,
    };
} else {
    // Call init only in browser environments
    document.addEventListener("DOMContentLoaded", initDonationTracker);
}
