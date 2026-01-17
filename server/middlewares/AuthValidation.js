import Joi from "joi";

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 50 characters',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        username: Joi.string().alphanum().min(3).max(30).required().messages({
            'string.alphanum': 'Username can only contain letters and numbers',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 30 characters',
            'any.required': 'Username is required'
        }),
        password: Joi.string().min(6).max(100).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password must not exceed 100 characters',
            'any.required': 'Password is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message, success: false });
    }

    next();
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(1).required().messages({
            'string.min': 'Password is required',
            'any.required': 'Password is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message, success: false });
    }

    next();
}

export { signupValidation, loginValidation };