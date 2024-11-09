import { checkSchema } from 'express-validator';

export const loginSchemaLocal = checkSchema({
  email: {
    in: ['body'], // Specify that 'email' is expected in the request body
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Please enter a valid email address",
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
