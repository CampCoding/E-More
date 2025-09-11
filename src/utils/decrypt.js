export const decryptData = (localData) => {
  if (!localData) return null;
  try {
    // Normalize URL-safe Base64 and add missing padding
    const normalized = String(localData).replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    // Decode Base64 to binary string
    const binaryString = atob(padded);

    // Convert binary string to bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode UTF-8 bytes to proper JS string (handles Arabic and other Unicode)
    let jsonString;
    if (typeof TextDecoder !== 'undefined') {
      const decoder = new TextDecoder('utf-8');
      jsonString = decoder.decode(bytes);
    } else {
      // Fallback for very old environments
      // eslint-disable-next-line no-undef
      jsonString = decodeURIComponent(escape(binaryString));
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};
