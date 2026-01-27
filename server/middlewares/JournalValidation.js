import { body, param, validationResult } from "express-validator";


export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};


export const validateCreateJournal = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Journal title is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Title must be between 1 and 100 characters"),

    body("coverImage")
        .notEmpty()
        .withMessage("Cover image is required"),

    body("coverImage.url")
        .notEmpty()
        .withMessage("Cover image URL is required")
        .isURL()
        .withMessage("Cover image URL must be valid"),

    body("coverImage.width")
        .optional()
        .isNumeric()
        .withMessage("Width must be a number"),

    body("coverImage.height")
        .optional()
        .isNumeric()
        .withMessage("Height must be a number"),
    handleValidationErrors
];


export const validateUpdateJournal = [
    param("journalId")
        .isMongoId()
        .withMessage("Invalid journal ID"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Title must be between 1 and 100 characters"),

    body("coverImage.url")
        .optional()
        .isURL()
        .withMessage("Cover image URL must be valid"),

    body("isPublic")
        .optional()
        .isBoolean()
        .withMessage("isPublic must be a boolean"),
    handleValidationErrors
];


export const validateJournalId = [
    param("journalId")
        .isMongoId()
        .withMessage("Invalid journal ID"),
    handleValidationErrors
];


export const validateCreatePage = [
    param("journalId")
        .isMongoId()
        .withMessage("Invalid journal ID"),

    body("backgroundColor")
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage("Background color must be a valid hex color"),

    body("pageSize.width")
        .optional()
        .isNumeric()
        .withMessage("Page width must be a number")
        .isInt({ min: 100, max: 2000 })
        .withMessage("Page width must be between 100 and 2000"),

    body("pageSize.height")
        .optional()
        .isNumeric()
        .withMessage("Page height must be a number")
        .isInt({ min: 100, max: 3000 })
        .withMessage("Page height must be between 100 and 3000"),
    handleValidationErrors
];


export const validateUpdatePage = [
    param("pageId")
        .isMongoId()
        .withMessage("Invalid page ID"),

    body("backgroundColor")
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage("Background color must be a valid hex color"),

    body("pageSize.width")
        .optional()
        .isNumeric()
        .withMessage("Page width must be a number"),

    body("pageSize.height")
        .optional()
        .isNumeric()
        .withMessage("Page height must be a number"),
    handleValidationErrors
];


export const validatePageId = [
    param("pageId")
        .isMongoId()
        .withMessage("Invalid page ID"),
    handleValidationErrors
];


export const validateCreateBlock = [
    param("pageId")
        .isMongoId()
        .withMessage("Invalid page ID"),

    body("type")
        .optional()
        .isIn(["text", "image"])
        .withMessage("Type must be either 'text' or 'image'"),

    body("position.x")
        .optional()
        .isNumeric()
        .withMessage("Position X must be a number"),

    body("position.y")
        .optional()
        .isNumeric()
        .withMessage("Position Y must be a number"),

    body("text")
        .optional()
        .isString()
        .withMessage("Text must be a string"),

    body("styles.fontFamily")
        .optional()
        .isString()
        .withMessage("Font family must be a string"),

    body("styles.fontSize")
        .optional()
        .isNumeric()
        .withMessage("Font size must be a number")
        .isInt({ min: 8, max: 72 })
        .withMessage("Font size must be between 8 and 72"),

    body("styles.color")
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage("Color must be a valid hex color"),

    body("styles.bold")
        .optional()
        .isBoolean()
        .withMessage("Bold must be a boolean"),

    body("styles.italic")
        .optional()
        .isBoolean()
        .withMessage("Italic must be a boolean"),

    body("styles.underline")
        .optional()
        .isBoolean()
        .withMessage("Underline must be a boolean"),

    body("styles.strike")
        .optional()
        .isBoolean()
        .withMessage("Strike must be a boolean"),

    body("styles.alignment")
        .optional()
        .isIn(["left", "center", "right", "justify"])
        .withMessage("Alignment must be one of: left, center, right, justify"),

    body("styles.lineHeight")
        .optional()
        .isNumeric()
        .withMessage("Line height must be a number")
        .isFloat({ min: 0.5, max: 3 })
        .withMessage("Line height must be between 0.5 and 3"),

    body("image.url")
        .optional()
        .isURL()
        .withMessage("Image URL must be valid"),

    body("image.width")
        .optional()
        .isNumeric()
        .withMessage("Image width must be a number"),

    body("image.height")
        .optional()
        .isNumeric()
        .withMessage("Image height must be a number"),
    handleValidationErrors
];


export const validateUpdateBlock = [
    param("blockId")
        .isMongoId()
        .withMessage("Invalid block ID"),

    body("position.x")
        .optional()
        .isNumeric()
        .withMessage("Position X must be a number"),

    body("position.y")
        .optional()
        .isNumeric()
        .withMessage("Position Y must be a number"),

    body("text")
        .optional()
        .isString()
        .withMessage("Text must be a string"),

    body("image.url")
        .optional()
        .isURL()
        .withMessage("Image URL must be valid"),
    handleValidationErrors
];


export const validateBlockId = [
    param("blockId")
        .isMongoId()
        .withMessage("Invalid block ID"),
    handleValidationErrors
];


export const validateReorderPages = [
    param("journalId")
        .isMongoId()
        .withMessage("Invalid journal ID"),

    body("pageOrder")
        .isArray()
        .withMessage("pageOrder must be an array")
        .notEmpty()
        .withMessage("pageOrder cannot be empty"),
    handleValidationErrors
];


export const validateReorderBlocks = [
    param("pageId")
        .isMongoId()
        .withMessage("Invalid page ID"),

    body("blockOrder")
        .isArray()
        .withMessage("blockOrder must be an array")
        .notEmpty()
        .withMessage("blockOrder cannot be empty"),
    handleValidationErrors
];


export const validateBulkUpdateBlocks = [
    param("pageId")
        .isMongoId()
        .withMessage("Invalid page ID"),

    body("blocks")
        .isArray()
        .withMessage("blocks must be an array")
        .notEmpty()
        .withMessage("blocks cannot be empty"),
    handleValidationErrors
];
