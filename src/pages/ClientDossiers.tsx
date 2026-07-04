import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const ClientDossiers: React.FC = () => {
  const { user } = useClientAuth();
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('client_id', user.client_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Fetch dossiers error', error);
          setDossiers([]);
        } else {
          setDossiers(data || []);
        }
      } catch (err) {
        console.error(err);
        setDossiers([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO title="Mes dossiers | MIDEESSI" description="Suivez vos dossiers et brouillons soumis à MIDEESSI." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mes dossiers</h1>
          <Link to="/clients/submit-dossier" className="rounded-xl bg-gold px-4 py-2 text-midnight font-semibold">Soumettre un nouveau dossier</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          {loading ? (
            <p>Chargement...</p>
          ) : dossiers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun dossier pour le moment.</p>
              <Link to="/clients/submit-dossier" className="mt-4 inline-block rounded-xl bg-gold px-4 py-2 text-midnight font-semibold">Soumettre un dossier</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dossiers.map((d) => (
                <div key={d.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{d.offre_nom || 'Dossier'}</p>
                    <p className="text-xs text-gray-500">{new Date(d.created_at).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-2">Statut: {d.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {d.attachment_url && (
                      <a href={d.attachment_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Voir pièce jointe</a>
                    )}
                    <Link to={`/clients/submit-dossier?draftId=${d.id}`} className="rounded-xl border px-3 py-2 text-sm">Reprendre</Link>
                    <Link to={`/clients/quotes`} className="rounded-xl bg-midnight px-3 py-2 text-sm text-white">Détails</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDossiers;
