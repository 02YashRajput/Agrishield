import { checkSchema } from 'express-validator';
import { cropsArray } from '../../utils/crops.mjs';
export const listContractValidator = checkSchema({
  productName: {
    in: ['body'],
    isString: {
      errorMessage: 'Crop must be selected' // For single crop name
    },
    custom: {
      options: (value) => {
        // If it's an array of crop names
        if (Array.isArray(value)) {
          return value.every((crop) => cropsArray.includes(crop));
        }
        // If it's a single crop name
        return cropsArray.includes(value);
      },
      errorMessage: 'Crops grown must only include valid crop names.',
    },
  },
  
  productVariety: {
    in: ['body'],
    isString: {
      errorMessage: 'Product Variety is required'
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Product Variety is required'
    }
  },
  deliveryPreference: {
    in: ['body'],
    isString: {
      errorMessage: 'Product Variety is required'
    },
    isIn: {
      options: [['Farmer', 'Buyer']],
      errorMessage: "Delivery Preference must be either 'Farmer' or 'Buyer'",
    },
  },
  initialPaymentAmount: {
    in: ['body'],
    isString: {
      errorMessage: 'Initial payment amount is required'
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Initial payment amount is required'
    }
  },
  finalPaymentAmount: {
    in: ['body'],
    isString: {
      errorMessage: 'Final payment amount is required'
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Final payment amount is required'
    }
  },
  deadline: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'Please provide a valid date for the deadline'
    }
  },
  additionInstructions: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Addition Instructions must be a string'
    }
  },
  productQuantity: {
    in: ['body'],
    isString: {
      errorMessage: 'Product Quantity is required'
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Product Quantity is required'
    }
  }
});
