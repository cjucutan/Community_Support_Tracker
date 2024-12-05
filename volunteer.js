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
            saveFormData(
                document.getElementById("charityInput").value,
                document.getElementById("hoursInput").value,
                document.getElementById("dateInput").value,
                document.querySelector('input[name="rating"]:checked').value
            );
            fillTable();
    
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

       let charityCookie = getCookie("charityName");

       if (!charityCookie) {
        charityCookie = document.getElementById("charityInput").value || "No Charity";
        setcookie("charityCookie", charityCookie, 365);
       }
        
    })
    fillTable();
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

function saveFormData(charityName, volunteerHours, date, experienceRating) {
    let formData = JSON.parse(localStorage.getItem("volunteerFormData")) || [];

    const row = {
        charityName,
        volunteerHours,
        date,
        experienceRating
    };

    formData.push(row);

    localStorage.setItem("volunteerFormData", JSON.stringify(formData));
}

function setcookie(name, value, days) {
    let date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        
    let expires = `; expires = ${date.toUTCString()}`;

    document.cookie = `${name}=${value}${expires}`;
}

function getCookie(name) {

    let cookieString = document.cookie;

    const pairs = cookieString.split("; ");

    for (const pair of pairs) {
        let [key, value] = pair.split("=");

        if(key === name) {
            return value;
        }
    }
}




function fillTable() {
    const formData = JSON.parse(localStorage.getItem("volunteerFormData")) || [];
    const tableBody = document.getElementById('table-body');

    tableBody.innerHTML = "";

    formData.forEach((row, index) => {
        const tr = document.createElement('tr');

        const charityCell = document.createElement('td');
        const volunteerCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const experienceCell = document.createElement('td');
        const deleteCell = document.createElement('td');

        charityCell.innerText = row.charityName;
        volunteerCell.innerText = row.volunteerHours;
        dateCell.innerText = row.date;
        experienceCell.innerText = row.experienceRating;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete Row";
        deleteButton.onclick = function() {
            tr.remove();
            formData.splice(index, 1);
            localStorage.setItem("volunteerFormData", JSON.stringify(formData));
            calculateHours();
        };
        deleteCell.appendChild(deleteButton);

        tr.appendChild(charityCell);
        tr.appendChild(volunteerCell);
        tr.appendChild(dateCell);
        tr.appendChild(experienceCell);
        tr.appendChild(deleteCell);

        tableBody.appendChild(tr);
    });

    calculateHours();
}

function calculateHours() {
    const table = document.getElementById("volunteer-table");

    const subtractDeletedRow = table.querySelector(".total-row");
    if (subtractDeletedRow) {
        subtractDeletedRow.remove();
    }

    let totalHours = 0;

    for (let i = 1; i < table.rows.length; i ++) {
        totalHours = totalHours + parseFloat(table.rows[i].cells[1].textContent);
    }

    const totalRow = table.insertRow();
    totalRow.classList.add("total-row");

    const totalCellLabel = totalRow.insertCell(0);
    totalCellLabel.textContent = "Total Hours";

    const totalCellValue = totalRow.insertCell(1);
    totalCellValue.textContent = totalHours;

    return totalHours;
}