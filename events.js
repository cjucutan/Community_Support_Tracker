const formNode = document.querySelector("#eventsignup-form");
const nameErrorNode = document.querySelector("#name-error");
const emailErrorNode = document.querySelector("#email-error");
const dropdownErrorNode = document.querySelector("#dropdown-error");
const eventnameErrorNode = document.querySelector("#event-name-error");

formNode.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm();
    const eventname = document.querySelector("#eventname").value;
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const role = document.querySelector("#dropdown-menu").value;
    
    saveFormData(eventname, name, email, role);
    fillTable(); 
});

function validateForm() {
    validateName();
    validateEmail();
    validateDropdown();
    validateEventName();
}

function validateName() {
    const nameNode = document.querySelector("#name");
    let isNotEmpty = true;
    let nameInput = nameNode.value;

    if (nameInput === "") {
        isNotEmpty = false;
        showError(nameErrorNode, "Name cannot be blank.");
    } else {
        isNotEmpty = true;
        clearErrors(nameErrorNode);
    }
}

function validateEventName() {
    const eventnameNode = document.querySelector("#eventname");
    let isNotEmpty = true;
    let eventnameInput = eventnameNode.value;

    if (eventnameInput === "") {
        isNotEmpty = false;
        showError(eventnameErrorNode, "Event Name cannot be blank.");
    } else {
        isNotEmpty = true;
        clearErrors(eventnameErrorNode);
    }
}

function validateEmail() {
    const emailNode = document.querySelector("#email");
    let isValidEmail = true;
    let emailInput = emailNode.value;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;

    if (!emailPattern.test(emailInput)) {
        isValidEmail = false;
        showError(emailErrorNode, "Email is invalid.");
    } else {
        isValidEmail = true;
        clearErrors(emailErrorNode);
    }
}

function validateDropdown() {
    const dropdownNode = document.querySelector("#dropdown-menu")
    let isSelected = true;
    let dropdownOption = dropdownNode.value;

    if (dropdownOption === "") {
        isSelected = false;
        showError(dropdownErrorNode, "Please select your event position.")
    } else {
        isSelected = true;
        clearErrors(dropdownErrorNode);
    }
}

function showError(displayNode, errorMessage) {
    displayNode.innerText = errorMessage;
}

function clearErrors(displayNode) {
    displayNode.innerText = "";
}

const createDataObject = {
    emailInput: document.getElementById("email"),
    eventnameInput: document.getElementById("eventname"),
    nameInput: document.getElementById("name"),
    dropdownInput: document.getElementById("dropdown-menu")
}


function saveFormData(eventname, name, email, role) {
    let formData = JSON.parse(localStorage.getItem("eventsFormData")) || [];

    const row = {
        eventname,
        name,
        email,
        role
    };

    formData.push(row);

    localStorage.setItem("eventsFormData", JSON.stringify(formData));
}

function fillTable() {
    const formData = JSON.parse(localStorage.getItem("eventsFormData")) || [];
    const tableBody = document.getElementById('table-body');

    tableBody.innerHTML = ""; 

    formData.forEach((row, index) => {
        const tr = document.createElement('tr');

        const eventNameCell = document.createElement('td');
        const emailCell = document.createElement('td');
        const representativeNameCell = document.createElement('td');
        const positionCell = document.createElement('td');
        const deleteCell = document.createElement('td');

        eventNameCell.innerText = row.eventname;
        emailCell.innerText = row.email;
        representativeNameCell.innerText = row.name;
        positionCell.innerText = row.role;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete Row";
        deleteButton.onclick = function() {
            tr.remove();
            formData.splice(index, 1);
            localStorage.setItem("eventsFormData", JSON.stringify(formData));
        };
        deleteCell.appendChild(deleteButton);

        tr.appendChild(eventNameCell);
        tr.appendChild(emailCell);
        tr.appendChild(representativeNameCell);
        tr.appendChild(positionCell);
        tr.appendChild(deleteCell);

        tableBody.appendChild(tr);
    });
}


window.onload = function() {
    fillTable(); 
};
