import Joi from "joi";

export const urlShortenSchema = Joi.object({
  url: Joi.string().uri({
    scheme: ["https"],
  }),
});
