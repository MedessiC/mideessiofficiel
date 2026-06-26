import SEO from '../components/SEO';
import { useClientAuth } from '../contexts/ClientContext';
import ClientWeeklyObjectives from '../components/client/ClientWeeklyObjectives';

export default function ClientObjectives() {
  const { user } = useClientAuth();

  return (
    <div className="pb-28">
      <SEO title="Objectifs | Client MIDEESSI" description="Suivez vos objectifs hebdomadaires et le plan d'action de votre équipe." />
      {user?.client_id ? (
        <ClientWeeklyObjectives clientId={user.client_id} />
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-slate-700">
          <p className="text-sm font-medium">Chargement des objectifs...</p>
        </div>
      )}
    </div>
  );
}
