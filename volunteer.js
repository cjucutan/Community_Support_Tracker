// Init function initialize the form and add a submit event listener
function init() {
    document.getElementById("charityForm").addEventListener("submit", (event) => {
        event.preventDefault(); // Prevents the submission
        clearErrors(); // Clears the error messages
        

        let charityName = charityNameNotEmpty();
        let volunteerHours = volunteerHoursNotEmpty();
        let date = dateNotEmpty();
        let rating = ratingNotEmpty();

        // If statement checks if all inputs are valid
        if (charityName.isValid && volunteerHours.isValid && date.isValid && rating.isValid) {
           alert("Form has been submitted Successfully.");
    
       }else{
           if (!charityName.isValid) {
               showErrorMessage("name", charityName.errorMessage);
           }
           
           if (!volunteerHours.isValid) {
                showErrorMessage("hours", volunteerHours.errorMessage);
           }
    
           if (!date.isValid){
                showErrorMessage("date", date.errorMessage);
           }
    
           if (!rating.isValid) {
                showErrorMessage("rating", rating.errorMessage);
           }
    
       };
        
    })
}

// Checks if its running in a Node.js environment
if (typeof window === "undefined") {
    module.exports = { init, 
        charityNameNotEmpty, 
        volunteerHoursNotEmpty, 
        dateNotEmpty, 
        ratingNotEmpty, 
        showErrorMessage, 
        clearErrors };
} else {
    window.onload = init;
}

// charityFormData object that stores data
const charityFormData = {
    charityName: document.getElementById("charityInput").value,
    volunteerHours: document.getElementById("hoursInput").value,
    date: document.getElementById("dateInput").value,
    experienceRating: document.querySelectorAll("rating-radio").value
};

// This function validates if the charity name is not empty
function charityNameNotEmpty() {
    const charityName = document.getElementById("charityInput");
    let isValid = true;
    let errorMessage = [];
    
    if(charityName.value === "") {
        isValid = false;
        errorMessage.push("Please enter charity name");
    }

    return {
        isValid,
        errorMessage
    };
}

// This functon validates the volunteer hours input
function volunteerHoursNotEmpty() {
    const volunteerHours = document.getElementById("hoursInput");
    let isValid = true;
    let errorMessage = [];

    if (volunteerHours.value === "") {
        isValid = false;
        errorMessage.push("Please enter amount of hours volunteered");
    } else if (volunteerHours.value > 24) {
        isValid = false;
        errorMessage.push("Hours must be below 24");
    } else if (volunteerHours.value < 1) {
        isValid = false;
        errorMessage.push("Number must be positive");
    }

    return {
        isValid,
        errorMessage
    };
}

// This function validates if the date is not empty
function dateNotEmpty() {
    const dateInput = document.getElementById("dateInput").value;
    let isValid = true;
    let errorMessage = [];

    if (dateInput === "") {
        isValid = false;
        errorMessage.push("Please Enter a Date");
    }

    return {
        isValid,
        errorMessage
    };
}

// This function validates if a rating is selected
function ratingNotEmpty() {
    const ratingInput = document.querySelectorAll("[name = 'rating']");
    let isValid = false;
    let errorMessage = [];

    ratingInput.forEach(checkbox => {

        if (checkbox.checked) {
            isValid = true;
        }
    });

    if(!isValid) {
        errorMessage.push("Please rate your volunteering experience.");
    };

    return {
        isValid,
        errorMessage
    };
    
}

// This function shows the error message for said input
function showErrorMessage(name, errorMessage) {
    const errorId = document.getElementById(`${name}Error`);

    if (errorId) {
        errorId.innerText = errorMessage;
    } else {
        console.error(`Error element with Id ${name}Error does not exist.`);
    }
    
};

// This function clears error messages
function clearErrors() {
    const error = document.querySelectorAll(".error");

    error.forEach(error => {
        error.innerText = "";

    });
}


