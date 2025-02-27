import Joi from 'joi'

export const KeycloakAuthCodeQuerySchema = Joi.object({
  iss: Joi.string().required(),
  code: Joi.string().required(),
  state: Joi.string().required(),
  session_state: Joi.string().required(),
}).required()
