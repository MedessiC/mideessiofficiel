export interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export async function fetchCloudinarySignature(folder = 'mideessi'): Promise<CloudinarySignature> {
  const response = await fetch(`${API_BASE_URL}/api/cloudinary-signature?folder=${encodeURIComponent(folder)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Impossible de générer la signature Cloudinary');
  }

  const data: CloudinarySignature = await response.json();
  return data;
}

export async function uploadFileToCloudinary(file: File, folder = 'mideessi', resourceType: 'auto' | 'raw' = 'auto'): Promise<string> {
  const signatureData = await fetchCloudinarySignature(folder);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);
  formData.append('resource_type', resourceType);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const result = await uploadResponse.json();
  if (!uploadResponse.ok) {
    throw new Error(result.error?.message || 'Erreur Cloudinary lors de l’upload');
  }

  return result.secure_url || result.url;
}
