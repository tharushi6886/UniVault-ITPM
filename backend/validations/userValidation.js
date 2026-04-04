const { check } = require("express-validator");

const registerValidation = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

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
    .optional({ checkFalsy: true })
    .matches(/^(?:\+94|0)?7[0-9]{8}$/)
    .withMessage("Phone number must be valid"),

  check("faculty")
    .optional({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Faculty must be at least 2 characters"),

  check("email").custom((value, { req }) => {
    const emailPrefix = value.split("@")[0].toUpperCase(); // IT12345678
    const studentId = req.body.studentId?.toUpperCase();

    if (emailPrefix !== studentId) {
      throw new Error("Student ID must match university email ID");
    }

    return true;
  }),
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