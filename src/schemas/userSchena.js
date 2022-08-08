import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  samePassword: Joi.string().valid(password).required(),
  email: Joi.string().email().invalid(userEmail).required(),
});

export default userSchema;
