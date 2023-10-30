import jwt from 'jsonwebtoken';

class TokenManager {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    generateToken(payload: Record<string, any>, expiresIn: string): string {
        console.log(payload)
        return jwt.sign(payload, this.secretKey, { expiresIn });
    }

    verifyToken(token: string): Record<string, any> | null {
        try {
            const decodedData= jwt.verify(token, this.secretKey);
            return decodedData as Record<string, any>;
        } catch (error) {
            return null;
        }
    }
}

export default TokenManager;
