const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
// const mongoose = require('mongoose');

const register = celebrate({
  body: {
    // _id: Joi.string().required().custom((value, helper) => {
    //   if (mongoose.Types.ObjectId.toString(value)) {
    //     return value;
    //   }
    //   return helper.message('Невалидный ID');
    // }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимум 2 символа',
      'string.max': 'Максимум 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимум 2 символа',
      'string.max': 'Максимум 30 символов',
    }),
    avatar: Joi.string().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидный URL');
    }),
    email: Joi.string().required().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    }).messages({ 'any.required': 'Обязательное поле' }),
    password: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
        'any.required': 'Обязательное поле',
      }),
  },
});

module.exports = register;
