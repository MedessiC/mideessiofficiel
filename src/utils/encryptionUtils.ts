/**
 * Client-side utilities for password hashing and credentials encryption
 * Password hashing: SHA256 (simple, matches server-side)
 * Credential encryption: XOR + base64 (for social media accounts)
 */

/**
 * Hash password using SHA256
 * This is sent to Supabase to be compared with stored hash
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt credential using XOR + base64
 * For social media credentials before sending to Supabase
 * WARNING: This is for obfuscation only, not secure encryption!
 */
export function encryptCredential(credential: string, salt: string = 'mideessi2026'): string {
  try {
    // Simple XOR encryption with base64 encoding
    let encrypted = '';
    for (let i = 0; i < credential.length; i++) {
      const charCode = credential.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt credential');
  }
}

export function decryptCredential(encrypted: string, salt: string = 'mideessi2026'): string {
  try {
    // Reverse the encryption process
    const encrypted_str = atob(encrypted);
    
    let decrypted = '';
    for (let i = 0; i < encrypted_str.length; i++) {
      const charCode = encrypted_str.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt credential');
  }
}


/**
 * Generate a secure temporary password
 * Used when creating new clients
 */
export function generateTempPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Generate client ID in format JASI-XXX
 */
export function generateClientId(existingIds: string[] = []): string {
  let maxNum = 0;
  
  existingIds.forEach(id => {
    const match = id.match(/JASI-(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });
  
  const newNum = maxNum + 1;
  return `JASI-${String(newNum).padStart(3, '0')}`;
}

/**
 * Generate contract number in format YY-XXX
 * YY = last 2 digits of current year (26 for 2026, 27 for 2027, etc.)
 * XXX = sequential number (001, 002, etc.)
 */
export function generateContractNumber(existingContracts: string[] = []): string {
  const now = new Date();
  const yearSuffix = String(now.getFullYear()).slice(-2);
  
  let maxNum = 0;
  
  existingContracts.forEach(contract => {
    // Match format YY-XXX where YY matches current year
    const regex = new RegExp(`^${yearSuffix}-(\\d+)$`);
    const match = contract.match(regex);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });
  
  const newNum = maxNum + 1;
  return `${yearSuffix}-${String(newNum).padStart(3, '0')}`;
}
