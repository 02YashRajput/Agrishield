import {z} from "zod"
const addressSchema = z.object({
  name: z.string().min(1, { message: "Address name is required." }),
  district: z.string().min(1, { message: "District is required." }),
  state: z.string().min(1, { message: "State is required." }),
  pincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Pincode must be a valid 6-digit number." }),
});

const bankDetailsSchema = z.object({
  accountNumber: z
    .string({ message: "Account number is required." })
    .min(9, { message: "Account Number is required." })
    .max(18, { message: "Account Number must be less that or equal to 18" }),

  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name is required." }),
  bankName: z.string().min(1, { message: "Bank name is required." }),
  IFSCCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format." }),
});

const upiDetailsSchema = z
  .object({
    upiId: z.string().optional(),
    upiName: z.string().optional(),
  })
  .optional();

const notificationPreferencesSchema = z.object({
  message: z.boolean(),
  email: z.boolean(),
});

export const baseProfileDataSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "phone number mst be 10 integers" })
    .max(10, { message: "phone number must b 10 integers" }),
  address: addressSchema,
  paymentInformation: z.object({
    bankDetails: bankDetailsSchema,
    upiDetails: upiDetailsSchema,
  }),
  notificationPreferences: notificationPreferencesSchema,
  adhaar:z.string().min(12,{ message: "adhaar mst be 12 integers" }).max(12, { message: "adhaar must be 12 integers" }),
});

export const farmerProfileDataSchema = baseProfileDataSchema.extend({
  farmDetails: z.object({
    cropsGrown: z
      .array(z.string()) // Ensure it's an array of strings
      .min(1, { message: "At least one crop must be selected." }),
    farmAddress: z.string().min(1, { message: "Farm address is required." }),
    sizeUnit: z.string().min(1, { message: "Size unit is required." }),
    farmSize: z.string().min(1, { message: "Farm size is required." }),
  }),
});
