const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

type R2SignedUrlResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
};

function normalizeFolder(folder: string) {
  return folder
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
    .slice(0, 120) || 'mideessi';
}

async function requestR2SignedUrl(file: File, folder: string): Promise<R2SignedUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/api/r2-signed-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      folder,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    let body: any = {};
    try {
      body = JSON.parse(text);
    } catch {
      body = { error: text || 'Erreur serveur' };
    }
    throw new Error(body.error || `Erreur de signature R2 (${response.status})`);
  }

  try {
    return JSON.parse(text) as R2SignedUrlResponse;
  } catch (err) {
    throw new Error(`Réponse invalide de l’API R2: ${text}`);
  }
}

function uploadWithProgress(uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        const responseBody = xhr.responseText || `HTTP ${xhr.status}`;
        reject(new Error(`Échec du téléversement R2 : ${responseBody}`));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau pendant le téléversement R2'));
    xhr.onabort = () => reject(new Error('Téléversement R2 annulé'));
    xhr.send(file);
  });
}

export async function uploadFileToR2(file: File, folder = 'mideessi', onProgress?: (progress: number) => void): Promise<string> {
  const sanitizedFolder = normalizeFolder(folder);
  const signedData = await requestR2SignedUrl(file, sanitizedFolder);

  await uploadWithProgress(signedData.uploadUrl, file, onProgress);

  return signedData.publicUrl;
}
