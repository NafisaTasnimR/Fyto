import Joi from "joi";

// Validate comment creation
const createCommentValidation = (req, res, next) => {
    const schema = Joi.object({
        content: Joi.string().min(1).max(1000).required().messages({
            'string.min': 'Comment content cannot be empty',
            'string.max': 'Comment content must not exceed 1000 characters',
            'any.required': 'Comment content is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

// Validate comment update
const updateCommentValidation = (req, res, next) => {
    const schema = Joi.object({
        content: Joi.string().min(1).max(1000).required().messages({
            'string.min': 'Comment content cannot be empty',
            'string.max': 'Comment content must not exceed 1000 characters',
            'any.required': 'Comment content is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }

    next();
};

export { createCommentValidation, updateCommentValidation };
