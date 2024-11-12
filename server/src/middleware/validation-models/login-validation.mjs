import { checkSchema } from 'express-validator';

export const loginSchemaLocal = checkSchema({
  identifier: {
    in: ['body'], // Specify that 'email' is expected in the request body
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    
  },
  password: {
    in: ['body'], 
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isString: {
      errorMessage: "Password must be a string!",
    },
  },
});
