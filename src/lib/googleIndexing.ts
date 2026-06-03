import { google } from 'googleapis';
import { supabase } from './supabase';

// Charger les credentials (à mettre dans .env)
const GOOGLE_CREDENTIALS = {
  type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
};

export async function submitUrlToGoogle(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CREDENTIALS.client_email,
      undefined,
      GOOGLE_CREDENTIALS.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      undefined
    );

    await jwtClient.authorize();

    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient,
    });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log('✅ URL soumise à Google:', url);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Erreur soumission Google:', error);
    return { success: false, error };
  }
}

export async function checkIndexingStatus(url: string) {
  try {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CREDENTIALS.client_email,
      undefined,
      GOOGLE_CREDENTIALS.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      undefined
    );

    await jwtClient.authorize();

    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient,
    });

    const response = await indexing.urlNotifications.getMetadata({
      url: url,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
}