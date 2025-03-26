import dotenv from "dotenv";
dotenv.config();
import jwt, { Secret } from "jsonwebtoken";
import fs from "fs";
import { IAuthOUser } from "../types/Auth0Token.js";
class TokenManager {
  private secretKey: Secret;
  private publicKeyFilePath: string = "public-key.key";
  private authkeys: string;
  constructor() {
    if (!process.env.SECRET_KEY) {
      throw new Error("Secret key must be defined.");
    }
    this.secretKey = process.env.SECRET_KEY;
    this.authkeys = fs.readFileSync(this.publicKeyFilePath, "utf8");
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

  decodeAuth0Token(token: string): IAuthOUser | any {
    try {
      const decodedData = jwt.verify(token, this.authkeys, {
        algorithms: ["RS256"],
      }) as IAuthOUser;
      return decodedData;
    } catch (error) {
      return;
    }
  }
}

export default TokenManager;
