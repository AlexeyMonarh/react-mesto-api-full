const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const upUsAva = celebrate({
  body: {
    avatar: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидный URL');
    }),
  },
});

module.exports = upUsAva;
