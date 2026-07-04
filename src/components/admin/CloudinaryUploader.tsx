import { useState, type ChangeEvent } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { uploadFileToCloudinary } from '../../lib/cloudinary';

interface CloudinaryUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  placeholder?: string;
  accept?: string;
  showUrlInput?: boolean;
}

const CloudinaryUploader = ({
  label,
  value,
  onChange,
  folder = 'mideessi',
  placeholder = 'https://...',
  accept = 'image/*,video/*,application/pdf,application/*',
  showUrlInput = true,
}: CloudinaryUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const fileUrl = await uploadFileToCloudinary(file, folder);
      onChange(fileUrl);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      setError((uploadError as Error).message || 'Erreur lors de l’upload du fichier');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 md:mb-2">
        {label}
      </label>

      <div className="flex flex-col gap-3">
        <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto">
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Téléversement...' : 'Téléverser un fichier'}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {showUrlInput && (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          />
        )}
      </div>

      {uploading && (
        <div className="inline-flex items-center gap-2 text-sm text-blue-600 mt-1">
          <Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-800">
          {value.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i) ? (
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-28 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '';
              }}
            />
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-200 break-all">
              <div className="font-semibold mb-1">Fichier téléversé :</div>
              <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">
                {value}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;
