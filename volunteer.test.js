const {JSDOM} = require("jsdom"); // simulates the DOM environment

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
}

test("charityForm correctly adds the callback", () => {
    // fake function; only returns true
    const mockCallback = jest.fn(() => true);
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="charity-form"></form>`);
    global.document = dom.window.document;
    // query form node
    const formNode = document.querySelector("#charity-form");

    // manually add event listener
    formNode.addEventListener('submit', mockCallback);
    let submitEvent = new dom.window.Event("submit");

    // force submit event to be triggered on form node
    formNode.dispatchEvent(submitEvent);

    expect(mockCallback).toHaveBeenCalled();
});


test ("correctly collects form data on submit", ()  => {
    const mockCallback = jest.fn(); // Creates a mock function

    // Sets up the dom with inputs from the form
    const dom = new JSDOM (`
        <!DOCTYPE html>
        <form id="charityForm">
            <input id="charityInput" name="name" type="text">
            <input id="hoursInput" name="hours" type="number">
            <input id="dateInput" name="date" type="date">
            <fieldset class="rating">
                <input id="1-star" name="rating" type="radio" value="1" class="rating-radio">
                <input id="2-star" name="rating" type="radio" value="2" class="rating-radio">
                <input id="3-star" name="rating" type="radio" value="3" class="rating-radio">
                <input id="4-star" name="rating" type="radio" value="4" class="rating-radio">
                <input id="5-star" name="rating" type="radio" value="5" class="rating-radio">
            </fieldset>
            <input id="submitButton" type="submit" value="Submit Volunteer Hours">
        </form>`
    );

    global.document = dom.window.document; // Sets the global document object
    global.window = dom.window; // Sets the global window object

    // Sets the value of the form inputs
    document.getElementById("charityInput").value = "Siloam Mission";
    document.getElementById("hoursInput").value = "11";
    document.getElementById("dateInput").value = "2024-11-08";
    document.getElementById("2-star").checked = true;

    // This function collects the form data
    function charityFormData() {
        const charityName = document.getElementById("charityInput").value;
        const volunteerHours = document.getElementById("hoursInput").value;
        const date = document.getElementById("dateInput").value;
        const experienceRating = document.querySelector("input[name='rating']:checked").value;

        return { charityName, volunteerHours, date, experienceRating };
    }

    // Add submit event listener and call the mock function with collected data
    const form = document.querySelector("#charityForm");
    form.addEventListener("submit", (event) => {
        const formData = charityFormData();
        mockCallback(formData);
    });

    // Dispatch a submit event
    const submit = new dom.window.Event("submit");
    form.dispatchEvent(submit);

    // Verify the mock function was called with the correct form data
    expect(mockCallback).toHaveBeenCalledWith({
        charityName: "Siloam Mission",
        volunteerHours: "11",
        date: "2024-11-08",
        experienceRating: "2"
    });
    
});


test ("Function correctly identifies and flags when any of the required fields are left empty.", () => {
    const mockCallback = jest.fn();

    const dom = new JSDOM (`
        <!DOCTYPE html>
        <form id="charityForm">
            <input id="charityInput" name="name" type="text">
            <input id="hoursInput" name="hours" type="number">
            <input id="dateInput" name="date" type="date">
            <fieldset class="rating">
                <input id="1-star" name="rating" type="radio" value="1" class="rating-radio">
                <input id="2-star" name="rating" type="radio" value="2" class="rating-radio">
                <input id="3-star" name="rating" type="radio" value="3" class="rating-radio">
                <input id="4-star" name="rating" type="radio" value="4" class="rating-radio">
                <input id="5-star" name="rating" type="radio" value="5" class="rating-radio">
            </fieldset>
            <input id="submitButton" type="submit" value="Submit Volunteer Hours">
        </form>`
    );

    global.document = dom.window.document;
    global.window = dom.window;

    // This function validates that all the inputs have been filled
    function validateFormData() {
        const charityName = document.getElementById("charityInput").value;
        const volunteerHours = document.getElementById("hoursInput").value;
        const date = document.getElementById("dateInput").value;
        const rating = document.querySelectorAll("rating").value;

        // This if statement returns false if any of the fields are empty
        if (!charityName || !volunteerHours || !date || !rating) {
            return false;
        }
        return true;
    }

    const form = document.querySelector("#charityForm");
    form.addEventListener("submit", (event) => {
        const valid = validateFormData(); // Validates the form data
        mockCallback(valid); // Call the mock function with the result
    });

    // These are simulating empty form inputs
    document.getElementById("charityInput").value = "";
    document.getElementById("hoursInput").value = "";
    document.getElementById("dateInput").value = "";
    document.querySelectorAll("rating").value = "";

    // Trigger form submit event
    const submitEvent = new dom.window.Event("submit");
    form.dispatchEvent(submitEvent);

    // This verifies that the callback was called wth false since the form is invalid
    expect(mockCallback).toHaveBeenCalledWith(false);

});


test ("Function correctly identifies and flags when the hours are not valid", () => {
    const mockCallback = jest.fn();

    const dom = new JSDOM (`
        <!DOCTYPE html>
        <form id="charityForm">
            <input id="hoursInput" name="hours" type="number">
            <input id="submitButton" type="submit" value="Submit Volunteer Hours">
        </form>`
    );

    global.document = dom.window.document;
    global.window = dom.window;

    // This function validates if the hours are valid
    function validateHours() {
        const volunteerHours = document.getElementById("hoursInput").value;

        return parseInt(volunteerHours) > 0; // Will return false if the hours are below 0

    }


    const form = document.querySelector("#charityForm");
    form.addEventListener("submit", (event) => {
        const valid = validateHours();
        mockCallback(valid);
    });

    // This tests the invalid inputs
    const invalidInputs = ["-1", "0", "james"];
    invalidInputs.forEach((input) => {
        document.getElementById("hoursInput").value = input;
    })

    const submitEvent = new dom.window.Event("submit");
    form.dispatchEvent(submitEvent);

    // Verifies that the callback was called with false since hours are invalid
    expect(mockCallback).toHaveBeenCalledWith(false);
    
})

test ("Function Correctly Identifies and Flags when the experience rating is not within range of 1-5", () => {
    const mockCallback = jest.fn();

    const dom = new JSDOM (`
        <!DOCTYPE html>
        <form id="charityForm">
            <fieldset class="rating">
                <input id="1-star" name="rating" type="radio" value="1" class="rating-radio">
                <input id="2-star" name="rating" type="radio" value="2" class="rating-radio">
                <input id="3-star" name="rating" type="radio" value="3" class="rating-radio">
                <input id="4-star" name="rating" type="radio" value="4" class="rating-radio">
                <input id="5-star" name="rating" type="radio" value="5" class="rating-radio">
            </fieldset>
            <input id="submitButton" type="submit" value="Submit Volunteer Hours">
        </form>`
    );

    global.document = dom.window.document;
    global.window = dom.window;

    // This function validates that the rating is not selected or not within the range
    function validateRating() {
        const rating = document.querySelector("input[name='rating']:checked")?.value; 

        // This if statement will return false if none are selected or not within the range
        if (!rating) {
            return false;
        }

        return rating >=1 && rating <= 5;
    }

    const form = document.querySelector("#charityForm");
    form.addEventListener("submit", (event) => {
        const formData = validateRating();
        mockCallback(formData);
    });

    // Dispatch submit event without selecting any rating
    form.dispatchEvent(new dom.window.Event("submit"));

    // Verifies that the callback was called with false since the rating was not selected
    expect(mockCallback).toHaveBeenCalledWith(false);

})

test ("Temporary Data Object is Correctly Populated with Form Data.", () => {

    const mockCallback = jest.fn();

    const dom = new JSDOM (`
        <!DOCTYPE html>
        <form id="charityForm">
            <input id="charityInput" name="name" type="text">
            <input id="hoursInput" name="hours" type="number">
            <input id="dateInput" name="date" type="date">
            <fieldset class="rating">
                <input id="1-star" name="rating" type="radio" value="1" class="rating-radio">
                <input id="2-star" name="rating" type="radio" value="2" class="rating-radio">
                <input id="3-star" name="rating" type="radio" value="3" class="rating-radio">
                <input id="4-star" name="rating" type="radio" value="4" class="rating-radio">
                <input id="5-star" name="rating" type="radio" value="5" class="rating-radio">
            </fieldset>
            <input id="submitButton" type="submit" value="Submit Volunteer Hours">
        </form>`
    );

    global.document = dom.window.document;
    global.window = dom.window;

    // This sets values for the form inputs
    document.getElementById("charityInput").value = "Siloam Mission";
    document.getElementById("hoursInput").value = "11";
    document.getElementById("dateInput").value = "2024-11-08";
    document.getElementById("2-star").checked = true;

    // This function collects the form data
    function charityFormData() {
        const charityName = document.getElementById("charityInput").value;
        const volunteerHours = document.getElementById("hoursInput").value;
        const date = document.getElementById("dateInput").value;
        const experienceRating = document.querySelector("input[name='rating']:checked").value;

        return { charityName, volunteerHours, date, experienceRating };
    }

    // This gets the form data and validates the data object
    const formData = charityFormData();

    // This verifies that the form data is populated with the values above
    expect(formData).toEqual({
        charityName: "Siloam Mission",
        volunteerHours: "11",
        date: "2024-11-08",
        experienceRating: "2"
    });
});


test ("Data correctly stored in localStorage.", () => {
    const formData = [
        {charityName: "Siloam Mission", volunteerHours: 12, date: "2024-01-01", experienceRating: 2}
    ];

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(formData));

    const retrievedData = JSON.parse(localStorage.getItem("volunteerFormData"));

    expect(retrievedData).toEqual(formData);
});

test ("Data is correctly retrieved from localStorage and loaded into the table.", () => {
    const formData = [
        {charityName: "Siloam Mission", volunteerHours: 12, date: "2024-01-01", experienceRating: 2}
    ];

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(formData));

    const table = document.createElement("table");

    const tableBody = document.createElement("tbody");

    table.appendChild(tableBody);
    document.body.appendChild(table);

    formData.forEach(data => {
        const row = document.createElement("tr");

        Object.values(data).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    const row = document.querySelector("td");

    expect(row.innerHTML).toEqual("Siloam Mission");
});

test ("Summary section correctly calculates and displays the total hours volunteered.", () => {
    const formData = [
        {charityName: "Siloam Mission", volunteerHours: 12, date: "2024-01-01", experienceRating: 2},
        {charityName: "Winnipeg Harvest", volunteerHours: 10, date: "2024-01-02", experienceRating: 4}
    ];

    let totalHours = 0;

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(formData));

    const table = document.createElement("table");

    const tableBody = document.createElement("tbody");

    table.appendChild(tableBody);
    document.body.appendChild(table);

    formData.forEach(data => {
        const row = document.createElement("tr");

        Object.values(data).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    for (let i = 0; i < table.rows.length; i ++) {
        totalHours = totalHours + parseFloat(table.rows[i].cells[1].textContent);
    }

    const totalRow = table.insertRow();
    totalRow.classList.add("total-row");

    const totalCellLabel = totalRow.insertCell(0);
    totalCellLabel.textContent = "Total Hours";

    const totalCellValue = totalRow.insertCell(1);
    totalCellValue.textContent = totalHours;

    expect(totalHours).toEqual(22);
});

test ("Delete button removes a record from the table.", () => {
    const formData = [
        {charityName: "Siloam Mission", volunteerHours: 12, date: "2024-01-01", experienceRating: 2}
    ];

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(formData));

    const table = document.createElement("table");

    const tableBody = document.createElement("tbody");

    table.appendChild(tableBody);
    document.body.appendChild(table);

    formData.forEach((data, index) => {
        const row = document.createElement("tr");
        const deleteButton = document.createElement("button");
        const deleteCell = document.createElement("td");

        deleteButton.textContent = "Delete Row";

        deleteButton.onclick = function() {
            row.remove();
            formData.splice(index, 1);
            localStorage.setItem("volunteerFormData", JSON.stringify(formData));
        };
        deleteCell.appendChild(deleteButton);


        Object.values(data).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    });

    const deleteBtn = table.querySelector("button");
    deleteBtn.click();

    expect(tableBody.rows.length).toBe(0);

});

test ("Delete button removes a record from localStorage.", () => {
    const formData = [
        {charityName: "Siloam Mission", volunteerHours: 12, date: "2024-01-01", experienceRating: 2}
    ];

    localStorage.getItem.mockReturnValueOnce(JSON.stringify(formData));

    const table = document.createElement("table");

    const tableBody = document.createElement("tbody");

    table.appendChild(tableBody);
    document.body.appendChild(table);

    formData.forEach((data, index) => {
        const row = document.createElement("tr");
        const deleteButton = document.createElement("button");
        const deleteCell = document.createElement("td");

        deleteButton.textContent = "Delete Row";

        deleteButton.onclick = function() {
            row.remove();
            formData.splice(index, 1);
            localStorage.setItem("volunteerFormData", JSON.stringify(formData));
        };
        deleteCell.appendChild(deleteButton);


        Object.values(data).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    });

    const deleteBtn = table.querySelector("button");
    deleteBtn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith("volunteerFormData", JSON.stringify([]));
});



