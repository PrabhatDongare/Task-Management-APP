import { body } from "express-validator";

// Sign Up Validator
export const signupValidator = [
    body("name")
        .isLength({ min: 3, max: 20 })
        .withMessage("Invalid name"),
    body("email")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long"),
];

// Login Validator
export const loginValidator = [
    body("email")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid Credentials"),
    body("password")
        .isLength({ min: 4 })
        .withMessage("Invalid Credentials"),
];

// Task Validator
export const taskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    body("priority")
        .notEmpty()
        .withMessage("Priority is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Priority must be between 1 and 5"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status must be a string")
        .isIn(["Pending", "Finished"])
        .withMessage("Status must be one of 'Pending' or 'Finished'"),
    body("startTime").custom((value) => {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Start Time must be a valid time");
        }
        return true;
    }),
    body("endTime").custom((value) => {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("End Time must be a valid time");
        }
        return true;
    }),
];
