import { useState } from 'react';

type Pole = 'presence_digitale' | 'dev_tech';

export default function CreateClientWizard() {
  const [step, setStep] = useState<number>(1);
  const [pole, setPole] = useState<Pole>('presence_digitale');
  const [previewId, setPreviewId] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [form, setForm] = useState({
    nom_marque: '',
    nom_responsable: '',
    email: '',
    pack: 'kpevi',
    numero_contrat: '',
    date_debut: new Date().toISOString().slice(0, 10),
    duree_mois: 12,
  });

  const [tempPassword, setTempPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');

  async function fetchPreviewId(selectedPole: Pole) {
    setLoadingPreview(true);
    try {
      const res = await fetch('/api/next-client-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pole: selectedPole }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Preview ID error', err);
        setPreviewId('');
      } else {
        const body = await res.json();
        setPreviewId(body.client_id || '');
      }
    } catch (err) {
      console.error('Failed to fetch preview id', err);
      setPreviewId('');
    } finally {
      setLoadingPreview(false);
    }
  }

  function updateForm<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step === 1) {
      // fetch preview then next
      fetchPreviewId(pole as Pole).then(() => setStep(2));
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    setStep(Math.max(1, step - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setMessage('');

    try {
      // request server to create client (server returns temp password)

      // Call server endpoint to create client atomically
      const res = await fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pole,
          nom_marque: form.nom_marque,
          nom_responsable: form.nom_responsable,
          email: form.email,
          pack: form.pack,
          numero_contrat: form.numero_contrat,
          date_debut: form.date_debut,
          duree_mois: form.duree_mois,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Échec création client');
      }

      const body = await res.json();
      const client_id = body.client_id;
      const serverTemp = body.tempPassword;
      setTempPassword(serverTemp || '');
      setMessage(`Client créé: ${client_id}`);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erreur inattendue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Créer un client</h2>

      <div className="mb-4">
        <div className="mb-2">Étape {step} / 3</div>

        {step === 1 && (
          <div>
            <p className="mb-2">Choisir le pôle</p>
            <div className="flex gap-2">
              <button className={`p-3 border rounded w-1/2 ${pole === 'presence_digitale' ? 'border-blue-600 bg-blue-50' : ''}`} onClick={() => setPole('presence_digitale')}>Presence Digitale (PD)</button>
              <button className={`p-3 border rounded w-1/2 ${pole === 'dev_tech' ? 'border-blue-600 bg-blue-50' : ''}`} onClick={() => setPole('dev_tech')}>Dév Tech (DT)</button>
            </div>

            <div className="mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => fetchPreviewId(pole)} disabled={loadingPreview}>{loadingPreview ? 'Génération...' : 'Prévisualiser ID'}</button>
              {previewId && <div className="mt-2 text-sm">Aperçu ID: <strong>{previewId}</strong></div>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-2">Informations client</p>
            <div className="grid gap-2">
              <input className="border p-2 rounded" placeholder="Nom marque" value={form.nom_marque} onChange={e => updateForm('nom_marque', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Nom responsable" value={form.nom_responsable} onChange={e => updateForm('nom_responsable', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e => updateForm('email', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Numéro de contrat" value={form.numero_contrat} onChange={e => updateForm('numero_contrat', e.target.value)} />
              <div className="flex gap-2">
                <input type="date" className="border p-2 rounded" value={form.date_debut} onChange={e => updateForm('date_debut', e.target.value)} />
                <input type="number" className="border p-2 rounded w-32" value={form.duree_mois} onChange={e => updateForm('duree_mois', Number(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-2">Confirmation</p>
            <div className="bg-gray-50 p-3 rounded">
              <div><strong>ID:</strong> {previewId}</div>
              <div><strong>Mot de passe temporaire:</strong> {tempPassword || '—'}</div>
              <div className="mt-2 text-green-600">{message}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button className="px-3 py-2 border rounded" onClick={goBack} disabled={step===1}>Retour</button>
        {step < 3 ? (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={step===2 ? handleSubmit : goNext} disabled={submitting}>{submitting ? 'Traitement...' : (step===2 ? 'Créer' : 'Suivant')}</button>
        ) : (
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setStep(1); setForm({nom_marque:'',nom_responsable:'',email:'',pack:'kpevi',numero_contrat:'',date_debut:new Date().toISOString().slice(0,10),duree_mois:12}); setPreviewId(''); setTempPassword(''); setMessage(''); }}>Créer un autre</button>
        )}
      </div>
    </div>
  );
}
