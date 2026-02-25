import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z from "zod";
import { shippingAddressSchema } from "../schema/userSchema";
type shippingAddress = z.infer<typeof shippingAddressSchema>;
interface ShippingInterface extends shippingAddress {
  _id: string;
}
export type IUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  shippingAddress: ShippingInterface[];
  usedSocialLogin?: boolean;
  socialLoginProvider?: "google" | "facebook";
};

const shippingAddressSchemaDB = new Schema<ShippingInterface>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  primary: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usedSocialLogin: { type: Boolean, default: false },
    socialLoginProvider: { type: String, enum: ["google", "facebook"] },
    shippingAddress: {
      select: false, // Do not return shippingAddress by default
      type: [shippingAddressSchemaDB],
      default: [],
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

export default model<IUser>("User", userSchema, "users");

export const hashPassword = async (password: string): Promise<string> => {
  const p = await bcrypt.hash(password, 10);
  return p;
};
export const comparePassword = async (
  candidatePassword: string,
  dbPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, dbPassword);
};
export const createAuthToken = async (
  userId: string,
  role: string,
): Promise<string> => {
  //@ts-ignore // Like at jwt.sign show error
  const token = await jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1D",
  });
  return token;
};
