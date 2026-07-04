export interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export async function fetchCloudinarySignature(folder = 'mideessi'): Promise<CloudinarySignature> {
  console.debug('[Cloudinary] fetchCloudinarySignature', { API_BASE_URL, folder });
  const response = await fetch(`${API_BASE_URL}/api/cloudinary-signature?folder=${encodeURIComponent(folder)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    console.error('[Cloudinary] Signature fetch failed', { status: response.status, statusText: response.statusText, body });
    throw new Error(body.error || 'Impossible de générer la signature Cloudinary');
  }

  const data: CloudinarySignature = await response.json();
  console.debug('[Cloudinary] Signature fetched', data);
  return data;
}

export async function uploadFileToCloudinary(file: File, folder = 'mideessi', resourceType: 'auto' | 'raw' = 'auto'): Promise<string> {
  const signatureData = await fetchCloudinarySignature(folder);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

  console.debug('[Cloudinary] uploadFileToCloudinary', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folder,
    resourceType,
    uploadUrl,
  });

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

  let result: any;
  try {
    result = await uploadResponse.json();
  } catch (err) {
    const bodyText = await uploadResponse.text();
    console.error('[Cloudinary] Upload response not JSON', { status: uploadResponse.status, statusText: uploadResponse.statusText, bodyText, err });
    throw new Error(
      `Erreur Cloudinary lors de l’upload : réponse invalide (${uploadResponse.status} ${uploadResponse.statusText}) ${bodyText}`
    );
  }

  if (!uploadResponse.ok) {
    console.error('[Cloudinary] Upload failed', { status: uploadResponse.status, statusText: uploadResponse.statusText, result });
    throw new Error(result?.error?.message || `Erreur Cloudinary lors de l’upload (${uploadResponse.status} ${uploadResponse.statusText})`);
  }

  console.debug('[Cloudinary] Upload succeeded', { secure_url: result?.secure_url || result?.url });
  return result.secure_url || result.url;
}
