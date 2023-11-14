const Joi = require('joi');

const validSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
    phone: Joi.string().min(6).required(),

    favorite: Joi.boolean(),
});

const patchSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

module.exports = { validSchema, patchSchema };
