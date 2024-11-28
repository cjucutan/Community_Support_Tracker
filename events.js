const formNode = document.querySelector("#eventsignup-form");
const nameErrorNode = document.querySelector("#name-error");
const emailErrorNode = document.querySelector("#email-error");
const dropdownErrorNode = document.querySelector("#dropdown-error");
const eventnameErrorNode = document.querySelector("#event-name-error");
formNode.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm();
});

function validateForm() {
    validateName();
    validateEmail();
    validateDropdown();
    validateEventName();


}



function validateName(){
    const nameNode = document.querySelector("#name");
    let isNotEmpty = true;
    let nameInput = nameNode.value;

    if (nameInput === ""){
        isNotEmpty = false;
        showError(nameErrorNode, "Name cannot be blank.");   
    }
    else{
        isNotEmpty = true;
        clearErrors(nameErrorNode);
    }
};
function validateEventName(){
    const eventnameNode = document.querySelector("#eventname");
    let isNotEmpty = true;
    let eventnameInput = eventnameNode.value;

    if (eventnameInput === ""){
        isNotEmpty = false;
        showError(eventnameErrorNode, "Event Name cannot be blank.");   
    }
    else{
        isNotEmpty = true;
        clearErrors(eventnameErrorNode);
    }
};

function validateEmail(){
    const emailNode = document.querySelector("#email");
    let isValidEmail = true;
    let emailInput = emailNode.value;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;

    if (!emailPattern.test(emailInput)){
        isValidEmail = false;
        showError(emailErrorNode, "Email is invalid.");
    }
    else{
        isValidEmail = true;
        clearErrors(emailErrorNode);
    }
};
function validateDropdown(){
    const dropdownNode = document.querySelector("#dropdown-menu")
    let isSelected = true;
    let dropdownOption = dropdownNode.value;

    if (dropdownOption === ""){
        isSelected = false;
        showError(dropdownErrorNode, "Please select your skill level.")
    }
    else{
        isSelected = true;
        clearErrors(dropdownErrorNode);
    }
};


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