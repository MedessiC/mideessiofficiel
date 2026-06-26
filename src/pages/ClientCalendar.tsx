import SEO from '../components/SEO';
import ClientEditorialCalendar from '../components/client/ClientEditorialCalendar';

export default function ClientCalendar() {
  return (
    <div className="pb-28">
      <SEO title="Calendrier | Client MIDEESSI" description="Suivez votre calendrier éditorial et vos publications planifiées." />
      <ClientEditorialCalendar />
    </div>
  );
}
