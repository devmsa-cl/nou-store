import { type Request, type Response } from "express";
import {
  authSchema,
  registerUserSchema,
  shippingAddressSchema,
} from "../schema/userSchema";
import BadRequest from "../errors/badRequest";
import User, {
  comparePassword,
  createAuthToken,
  hashPassword,
} from "../models/User";
import type { AuthRequest } from "../types/AppRequest";

export const registerUser = async (req: Request, res: Response) => {
  if (!req.body) {
    throw new BadRequest("Request body is missing");
  }

  const valid = registerUserSchema.safeParse(req.body);

  if (!valid.success) {
    throw new Error(valid.error.issues[0]?.message || "Invalid input");
  }

  // check if user already exists
  const userExists = await User.countDocuments({ email: valid.data.email });

  if (userExists) {
    throw new BadRequest("User already exists");
  }
  const hashedPassword = await hashPassword(valid.data.password);

  const newUser = await User.insertOne({
    email: valid.data.email,
    name: valid.data.name,
    password: hashedPassword, // In a real application, make sure to hash the password before storing it
  });

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  // remove the password
  newUser.password = undefined as any;

  const token = await createAuthToken(newUser._id.toString(), newUser.role);

  // Registration logic here (e.g., save user to database)

  res.status(201).json({
    user: newUser,
    token,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const valid = authSchema.safeParse(req.body);

  if (!valid.success) {
    throw new BadRequest(valid.error.issues[0]?.message || "Invalid input");
  }

  const user = await User.findOne({ email: valid.data.email });

  if (!user) {
    throw new BadRequest("User not found");
  }

  const isPasswordValid = await comparePassword(
    valid.data.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new BadRequest("Invalid password");
  }

  // remove the password
  user.password = undefined as any;

  const token = await createAuthToken(user.id, user.role);

  // Login logic here
  res.status(200).json({
    user,
    token,
  });
};

/**
 * Adds a new address to the user's profile
 */
export const addNewAddress = async (req: AuthRequest, res: Response) => {
  const data = shippingAddressSchema.safeParse(req.body);

  if (!data.success)
    throw new BadRequest(data.error.issues[0]?.message || "Invalid input");

  const user = await User.findById(req?.user?.userId).select("shippingAddress");

  if (!user) throw new BadRequest("User not found");

  user.shippingAddress.push(data.data);

  const r = await user.save({ validateBeforeSave: true });

  res.status(200).json(r);
};

// Return user adddress
export const userAddresses = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req?.user?.userId).select("shippingAddress");

  if (!user) throw new BadRequest("User not found");

  res.status(200).json(user.shippingAddress);
};
