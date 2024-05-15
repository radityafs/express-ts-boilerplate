import Joi from "joi";

export const createArticlesSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(6).required(),
  image: Joi.string().min(6).required(),
});

export const updateArticlesSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(6).required(),
  image: Joi.string().min(6).optional(),
});
