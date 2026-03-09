const { check } = require("express-validator");

const registerValidation = [
  check("name")
    .notEmpty()
    .withMessage("Name is required"),

  check("email")
    .isEmail()
    .withMessage("Valid email required")
    .custom((value) => {
      if (!value.endsWith("@my.sliit.lk")) {
        throw new Error("Email must be a SLIIT university email");
      }
      return true;
    }),

  check("studentId")
    .matches(/^IT\d{8}$/)
    .withMessage("Student ID must be like IT12345678"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
];

const loginValidation = [
  check("email")
    .isEmail()
    .withMessage("Valid email required"),

  check("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};