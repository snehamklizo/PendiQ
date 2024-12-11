const ENCRYPTION_KEY = 'pendiQ_token'; 

export const encryptData = (data) => {
    return btoa(data + '_' + ENCRYPTION_KEY);
};

export const decryptData = (encryptedData) => {
    try {
        const decoded = atob(encryptedData);
        return decoded.split('_')[0];
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};