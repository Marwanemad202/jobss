import CryptoJS from 'crypto-js';

export const encryptMobileNumber = (mobileNumber) => {
    const secretKey = process.env.SECRET_KEY || 'your-default-secret-key'; // Use an environment variable for the secret key
    return CryptoJS.AES.encrypt(mobileNumber, secretKey).toString();
};
