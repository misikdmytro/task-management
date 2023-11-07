const Joi = require('joi');
const pick = require('../utils/pick');

function validate(schema) {
  return (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      res.status(400).json({ success: false, message: errorMessage });
      return;
    }

    Object.assign(req, value);
    next();
  };
}

module.exports = validate;
