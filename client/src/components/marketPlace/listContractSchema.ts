import {z} from "zod"

export const listContractSchema = z.object({
  productName: z.string().min(1, { message: "Crops must be selected" }),
  initialPaymentAmount : z.string().min(1, { message: "Initial payment amount is required" }),
  finalPaymentAmount : z.string().min(1, { message: "Final payment amount is required" }),
  deadline:z.date({ message: "Please provide a valid date for the deadline" }),
  additionalInstructions:z.string().optional(),
  productQuantity:z.string().min(1, { message: "Product Quantity is required" }),
  

})