import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET_KEY;

export const encrypt=(financeData)=>{
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv('aes-256-ctr',Buffer.from(secret), iv);
    const encryptedData = Buffer.concat([
        cipher.update(financeData),
        cipher.final(),
    ]);

    return {iv: iv.toString("hex"), financeData: encryptedData.toString("hex") };
};
export const decrypt=(encryptData)=>{
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
        Buffer.from(secret), 
        Buffer.from(encryptData.iv, "hex")
    );
    const decryptedData = Buffer.concat([
        decipher.update(Buffer.from(encryptData.financeData, "hex")),
        decipher.final(),
    ]);

    return decryptedData.toString();
};

