import dotenv from "dotenv";
dotenv.config();
import jwt, { Secret } from "jsonwebtoken";

import { IAuthOUser } from "../types/Auth0Token";
class TokenManager {
  private secretKey: Secret;

  constructor() {
    if (!process.env.SECRET_KEY) {
      throw new Error("Secret key must be defined.");
    }
    this.secretKey = process.env.SECRET_KEY;
  }

  generateToken(payload: Record<string, any>, expiresIn: string): string {
    console.log(payload);
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token: string): Record<string, any> | null {
    try {
      const decodedData = jwt.verify(token, this.secretKey);
      return decodedData as Record<string, any>;
    } catch (error) {
      return null;
    }
  }

  decodeAuth0Token(token: string): IAuthOUser | null {
    const user: IAuthOUser | null = jwt.decode(token) as IAuthOUser;
    return user;
  }
}

export default TokenManager;
