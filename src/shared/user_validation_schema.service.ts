import { Injectable } from '@nestjs/common';
import Joi = require('@hapi/joi');

@Injectable()
export class UserValidationSchema {
  //create a Joi validation object for user
  public UserValidationSchema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    role: Joi.string().required(),

    mobileNumber: Joi.string()
      .min(10)
      .required(),
  });
}
