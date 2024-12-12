import {z} from "zod"

export const listContractSchema = z.object({
  productName: z.string().min(1, { message: "Crops must be selected" }),
  initialPaymentAmount: z
  .string()
  .refine(value => {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue >= 0 && numberValue <= 100;
  }, { message: "Initial payment amount percentage must be between 0 and 100" }),
  finalPaymentAmount: z
  .string()
  .min(1, { message: "Final payment amount is required" })
  .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: "Final payment amount must be a valid positive number",
  }),
  deadline:z.date({ message: "Please provide a valid date for the deadline" }),
  additionalInstructions:z.string().optional(),
  productQuantity:z.string().min(1, { message: "Product Quantity is required" }),
  productVariety:z.string().min(1, { message: "Product Variety is required" }),
  deliveryPreference : z.string().min(1, { message: "Please provide a delivery preference" }),
})