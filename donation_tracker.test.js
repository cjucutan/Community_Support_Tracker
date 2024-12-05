const { JSDOM } = require("jsdom");
const {
    validateInputs,
    handleFormSubmission,
    saveDonationsToLocalStorage,
    loadDonationsFromLocalStorage,
    renderTable,
    updateTotalDonations,
    deleteDonation,
} = require("./donation_tracker");

describe("Donation Tracker Tests", () => {
    let mockDonations;

    beforeEach(() => {
        mockDonations = [
            { charityName: "Charity A", donationAmount: 50, donationDate: "2024-11-27", donorComment: "Comment A" },
            { charityName: "Charity B", donationAmount: 100, donationDate: "2024-11-28", donorComment: "Comment B" },
        ];

        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };

        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <form id="donation-form">
                <input id="charity-name" type="text">
                <input id="donation-amount" type="number">
                <input id="donation-date" type="date">
                <textarea id="donor-comment"></textarea>
                <button type="submit">Add Donation</button>
            </form>
            <table id="donationTable">
                <tbody id="donationTableBody"></tbody>
            </table>
            <div id="summary">
                <strong>Total Donations:</strong> <span id="totalDonations">$0.00</span>
            </div>
        </body></html>`);
        global.document = dom.window.document;
        global.window = dom.window;
    });

    test("Function is triggered on form submission", () => {
        const form = document.querySelector("#donation-form");
        const mockHandler = jest.fn();
        form.addEventListener("submit", mockHandler);

        form.dispatchEvent(new window.Event("submit"));
        expect(mockHandler).toHaveBeenCalled();
    });

    test("Correctly collects form data", () => {
        document.querySelector("#charity-name").value = "Charity A";
        document.querySelector("#donation-amount").value = "50";
        document.querySelector("#donation-date").value = "2024-11-27";
        document.querySelector("#donor-comment").value = "Great cause!";

        const formData = {
            charityName: document.querySelector("#charity-name").value.trim(),
            donationAmount: document.querySelector("#donation-amount").value.trim(),
            donationDate: document.querySelector("#donation-date").value.trim(),
            donorComment: document.querySelector("#donor-comment").value.trim(),
        };

        expect(formData).toEqual({
            charityName: "Charity A",
            donationAmount: "50",
            donationDate: "2024-11-27",
            donorComment: "Great cause!",
        });
    });

    test("Required fields validation", () => {
        expect(validateInputs("", "50", "2024-11-27")).toBe(false);
        expect(validateInputs("Charity A", "", "2024-11-27")).toBe(false);
        expect(validateInputs("Charity A", "50", "")).toBe(false);
    });

    test("Donation amount validation", () => {
        expect(validateInputs("Charity A", "-10", "2024-11-27")).toBe(false);
        expect(validateInputs("Charity A", "abc", "2024-11-27")).toBe(false);
    });

    test("Temporary data object is correctly populated", () => {
        const formData = {
            charityName: "Charity A",
            donationAmount: "50",
            donationDate: "2024-11-27",
            donorComment: "Great cause!",
        };

        global.donations = [];
        const donation = handleFormSubmission(formData);
        expect(global.donations).toEqual([donation]);
    });

    test("Data is correctly stored in localStorage", () => {
        global.donations = mockDonations;
        saveDonationsToLocalStorage();
        expect(global.localStorage.setItem).toHaveBeenCalledWith("donations", JSON.stringify(mockDonations));
    });    

    test("Data is correctly stored in localStorage", () => {
        global.donations = mockDonations;
        saveDonationsToLocalStorage();
        expect(global.localStorage.setItem).toHaveBeenCalledWith("donations", JSON.stringify(mockDonations));
    });

    test("Summary section correctly calculates total donations", () => {
        global.donations = mockDonations;
        updateTotalDonations();
        const total = document.querySelector("#totalDonations").textContent;
        expect(total).toBe("$150.00");
    });

    test("Delete button removes a record from the table and localStorage", () => {
        global.donations = [...mockDonations];
        deleteDonation(0);
        expect(global.donations.length).toBe(1);
        expect(global.donations[0].charityName).toBe("Charity B");
    });

    test("Summary section updates after a donation is deleted", () => {
        global.donations = [...mockDonations];
        deleteDonation(0);
        updateTotalDonations();
        const total = document.querySelector("#totalDonations").textContent;
        expect(total).toBe("$100.00");
    });
});
