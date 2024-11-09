 import { checkSchema } from 'express-validator';

// Validation schema for local sign-up
export const signUpLocalSchema = checkSchema({
    userName: {
        in: ['body'], // Specify that 'name' is expected in the request body
        notEmpty: {
          errorMessage: "Name cannot be empty",
        },
        isString: {
          errorMessage: "Name must be a string!",
        },
      },
    email: {
        in: ['body'], // Specify that 'email' is expected in the request body
        notEmpty: {
          errorMessage: "Email cannot be empty",
        },
        isString: {
          errorMessage: "Email must be a string!",
        },
        isEmail: {
          errorMessage: "Please enter a valid email address",
        },
      },
      phone:{
        in: ['body'], // Specify that 'phone' is expected in the request body
        notEmpty: {
          errorMessage: "Phone number cannot be empty",
        },
        isNumeric: {
          errorMessage: "Phone number must be a number!",
        },
        isLength: {
          options: { min: 10, max: 10 },
          errorMessage: "Phone number must be 10 digits long",
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
      userType: {
        in: ['body'],
        notEmpty: {
          errorMessage: "User type cannot be empty",
        },
        isIn: {
          options: [['Farmer', 'Buyer']],
          errorMessage: "User type must be either 'Farmer' or 'Buyer'",
        },
      }
});
