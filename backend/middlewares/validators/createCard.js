const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const createCard = celebrate({
  body: {
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимум 2 символа',
      'string.max': 'Максимум 30 символов',
    }),
    link: Joi.string().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидный URL');
    }),
  },
});

module.exports = createCard;
