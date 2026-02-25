import { customAlphabet } from "nanoid";
export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const extractImageType = (mimeType: string): string => {
  const parts = mimeType.split("/");
  return parts[1] as string;
};
export const genOrderNumber = (): string => {
  return customAlphabet("0123456789", 7)();
};
