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

    const amountNumber = +donationAmount;
    if (amountNumber <= 0) {
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
        charityName: charityName,
        donationAmount: +donationAmount,
        donationDate: donationDate,
        donorComment: donorComment,
    };

    donations.push(donation);
    return donation;
}

document.querySelector("#donation-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const charityName = document.querySelector("#charity-name").value.trim();
    const donationAmount = document.querySelector("#donation-amount").value.trim();
    const donationDate = document.querySelector("#donation-date").value;
    const donorComment = document.querySelector("#donor-comment").value.trim();

    const formData = { charityName, donationAmount, donationDate, donorComment };

    const donation = handleFormSubmission(formData);

    if (donation) {
        alert("Donation successfully added!");
        console.log("Donation Added:", donation);
        e.target.reset();
    } else {
        alert("Please fill out all required fields correctly.");
    }
});
