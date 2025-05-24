Joi = require('joi');

module.exports.todoSchema = Joi.object({
        task: Joi.object({
            title: Joi.string().required(),
            category: Joi.string().required(),
            description: Joi.required(),
            time: Joi.required()
        }).required()
    });