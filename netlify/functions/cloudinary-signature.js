import crypto from 'crypto';

const sanitizeText = (value) => {
  if (typeof value !== 'string') return 'mideessi';
  return value.replace(/[<>]/g, '').trim().slice(0, 100);
};

const FOLDER_PATTERN = /^[a-zA-Z0-9/_-]{1,100}$/;

export const handler = async (event) => {
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Cloudinary non configuré',
        details: 'Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans les variables d\'environnement.',
      }),
    };
  }

  const folderParam = event.queryStringParameters?.folder || 'mideessi';
  const folder = sanitizeText(folderParam);
  if (!FOLDER_PATTERN.test(folder)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Nom de dossier invalide' }),
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    }),
  };
};
