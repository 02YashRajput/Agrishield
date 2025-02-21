import { checkSchema } from 'express-validator';

export const validateNegotiationDetails = checkSchema({
  initialPaymentAmount: {
    in: ['body'],
    isString: {
      errorMessage: 'Initial Payment Amount must be a string',
    },
    notEmpty: {
      errorMessage: 'Initial Payment Amount is required',
    },
  },
  finalPaymentAmount: {
    in: ['body'],
    isString: {
      errorMessage: 'Final Payment Amount must be a string',
    },
    notEmpty: {
      errorMessage: 'Final Payment Amount is required',
    },
  },
  deliveryPreference:{
    in: ['body'],
    isString: {
      errorMessage: 'Delivery Preference must be a string',
    },
    notEmpty: {
      errorMessage: 'Delivery Preference is required',
    },
    isIn: {
      options: [['Farmer', 'Buyer']],
      errorMessage: 'Delivery Preference must be either "Farmer" or "Buyer"',
    },
  },
  
  productQuantity: {
    in: ['body'],
    isString: {
      errorMessage: 'Product Quantity must be a string',
    },
    notEmpty: {
      errorMessage: 'Product Quantity is required',
    },
  },
  deadline: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'Deadline must be a valid ISO 8601 date',
    },
    notEmpty: {
      errorMessage: 'Deadline is required',
    },
  },
});


