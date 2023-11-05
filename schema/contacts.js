const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
    phone: Joi.string().min(6).required(),
});

module.exports = { schema };
