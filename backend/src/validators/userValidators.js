const { body } = require("express-validator");

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),

    body("skillsToTeach")
        .optional()
        .isArray()
        .withMessage("skillsToTeach must be an array"),

    body("skillsToTeach.*")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Each skillToTeach must be a non-empty string"),

    body("skillsToLearn")
        .optional()
        .isArray()
        .withMessage("skillsToLearn must be an array"),

    body("skillsToLearn.*")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Each skillToLearn must be a non-empty string"),

    body("bio")
        .optional()
        .isString()
        .isLength({ max: 240 })
        .withMessage("Bio must be 240 characters or fewer"),

    body()
        .custom((value) => {
            if (
                !value.name &&
                value.skillsToTeach === undefined &&
                value.skillsToLearn === undefined &&
                value.bio === undefined
            ) {
                throw new Error("At least one field must be provided");
            }
            return true;
        })
];

module.exports = {
    updateProfileValidation
};