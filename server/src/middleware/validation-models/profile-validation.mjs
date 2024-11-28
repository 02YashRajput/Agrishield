import { checkSchema } from 'express-validator';
import { cropsArray } from '../../utils/crops.mjs';

export const profileUpdateValidation = checkSchema({
  'address.district': {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'District is required and must be a string.',
  },
  'address.name': {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'Name of City/Village is required and must be a string.',
  },
  'address.pincode': {
    in: ['body'],
    isPostalCode: { options: 'IN' },
    errorMessage: 'Pincode must be a valid Indian postal code.',
  },
  'address.state': {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'State is required and must be a string.',
  },
  'farmDetails.cropsGrown': {
  in: ['body'],
  optional: { checkFalsy: true }, // Makes this field optional
  isArray: true,
  notEmpty: true,
  errorMessage: 'Crops grown must be an array.',
  custom: {
    options: (crops) => crops.every((crop) => cropsArray.includes(crop)),
    errorMessage: 'Crops grown must only include valid crop names.',
  },
},
'farmDetails.farmAddress': {
  in: ['body'],
  optional: { checkFalsy: true }, // Makes this field optional
  isString: true,
  trim: true,
  notEmpty: true,
  errorMessage: 'Farm address must be a string.',
},
'farmDetails.farmSize': {
  in: ['body'],
  optional: { checkFalsy: true }, // Makes this field optional
  isNumeric: true,
  notEmpty: true,
  errorMessage: 'Farm size must be a numeric value.',
},
'farmDetails.sizeUnit': {
  in: ['body'],
  optional: { checkFalsy: true }, // Makes this field optional
  isString: true,
  trim: true,
  notEmpty: true,
  errorMessage: 'Size unit must be a string.',
},

  'notificationPreferences.email': {
    in: ['body'],
    isBoolean: true,
    errorMessage: 'Email notification preference must be a boolean.',
  },
  'notificationPreferences.message': {
    in: ['body'],
    isBoolean: true,
    errorMessage: 'Message notification preference must be a boolean.',
  },
  'paymentInformation.bankDetails.accountNumber': {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Account number is required and must be a string.',
  },
  'paymentInformation.bankDetails.bankName': {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'Bank name is required and must be a string.',
  },
  'paymentInformation.bankDetails.accountHolderName': {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'Account holder name is required and must be a string.',
  },
  'paymentInformation.bankDetails.IFSCCode': {
    in: ['body'],
    isString: true,
    matches: { options: /^[A-Z]{4}0[A-Z0-9]{6}$/ },
    errorMessage: 'IFSC code must be valid.',
  },
'paymentInformation.upiDetails.upiId': {
  in: ['body'],
  optional: {
    options: { nullable: true, checkFalsy: true }, // Skips validation if the value is null, undefined, or an empty string
  },
  isString: true,
  matches: {
    options: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
    errorMessage: 'UPI ID must be valid if provided.',
  },
  errorMessage: 'UPI ID must be valid if provided.',
},
'paymentInformation.upiDetails.upiName': {
  in: ['body'],
  optional: {
    options: { nullable: true, checkFalsy: true }, // Skips validation if the value is null, undefined, or an empty string
  },
  isString: true,
  trim: true,
  errorMessage: 'UPI name must be a string if provided.',
},
  phone: {
    in: ['body'],
    isMobilePhone: { options: 'en-IN' },
    errorMessage: 'Phone number must be a valid Indian mobile number.',
  },
  email:{
    in: ['body'],
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
  adhaar:{
    in: ['body'],
    isString: {
      errorMessage: "Email must be a string!",
    },
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
  }
});
