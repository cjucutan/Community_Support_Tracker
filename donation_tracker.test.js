const { validateInputs, handleFormSubmission } = require("./donation_tracker.js");

    test("Valid inputs should pass validation", () => {
        const result = validateInputs("Charity A", "100", "2024-11-27");
        expect(result).toBe(true);
    });

    test("Missing fields should fail validation", () => {
        const result = validateInputs("", "100", "2024-11-27");
        expect(result).toBe(false);
    });

    test("Negative donation amount should fail validation", () => {
        const result = validateInputs("Charity A", "-50", "2024-11-27");
        expect(result).toBe(false);
    });

    test("Handle form submission with valid data", () => {
        const formData = {
            charityName: "Charity A",
            donationAmount: "100",
            donationDate: "2024-11-27",
            donorComment: "Great cause!",
        };

        const result = handleFormSubmission(formData);

        expect(result).toEqual({
            charityName: "Charity A",
            donationAmount: 100,
            donationDate: "2024-11-27",
            donorComment: "Great cause!",
        });
    });

    test("Handle form submission with invalid data", () => {
        const formData = {
            charityName: "",
            donationAmount: "100",
            donationDate: "2024-11-27",
            donorComment: "",
        };

        const result = handleFormSubmission(formData);
        expect(result).toBe(null);
    });
