export const decryptData = (localData) => {
  if (!localData) return null;
  try {
    const decodedData = atob(localData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};
