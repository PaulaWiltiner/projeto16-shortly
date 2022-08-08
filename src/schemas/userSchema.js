import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  samePassword: Joi.string().valid(Joi.ref("password")).required(),
  email: Joi.string().email().required(),
});

export const signInSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});
