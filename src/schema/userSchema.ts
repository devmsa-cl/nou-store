import z from "zod";
import { US_STATES } from "../config/constant";
export const authSchema = z.object({
  email: z.email({ error: " Invalid email address" }),
  password: z.string({ error: "Password is required" }).min(6).max(100),
});
export const registerUserSchema = authSchema
  .extend({
    name: z.string({ error: "Name is required" }).min(2).max(100),
    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .min(6)
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirm password"],
  });

export const shippingAddressSchema = z
  .object({
    firstName: z
      .string({ message: "First name is required" })
      .min(1, "First name must be at least 1 character")
      .max(50)
      .trim(),
    lastName: z
      .string({ message: "Last name is required" })
      .min(1, "Last name must be at least 1 character")
      .max(50)
      .trim(),
    line1: z
      .string({ message: "Address line 1 (street address) is required" })
      .min(5, "Street address must be at least 5 characters")
      .max(200)
      .regex(/^\d+\s+/, "Street address must start with a house/street number")
      .trim(),
    city: z.string({ message: "City is required" }).min(2).max(50).trim(),
    state: z.enum(US_STATES, {
      message: "Valid 2-letter US state code is required (e.g., CA)",
    }),
    primary: z.boolean().optional().default(false),
    postalCode: z
      .string({ message: "Postal code is required" })
      .regex(
        /^\d{5}(-\d{4})?$/,
        "Postal code must be 5 digits (e.g., 12345) or 5+4 (e.g., 12345-6789)",
      )
      .trim(),
    country: z.string({ message: "Country is required" }).min(2).max(50).trim(),
  })
  .refine((data) => data.line1.length > 0, {
    message: "Full street address is required",
    path: ["address"],
  });
