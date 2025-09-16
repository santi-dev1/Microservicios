import * as Joi from 'joi';


export const envSchema = Joi.object({
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES: Joi.string().default('24h'),
    MS_USERS_HOST: Joi.string().required(),
    MS_USERS_PORT: Joi.number().required(),
    MS_PRODUCTS_HOST: Joi.string().required(),
    MS_PRODUCTS_PORT: Joi.number().required(),
    MS_INVOICES_HOST: Joi.string().required(),
    MS_INVOICES_PORT: Joi.number().required(),
});     