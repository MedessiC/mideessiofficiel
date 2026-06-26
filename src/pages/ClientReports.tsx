import SEO from '../components/SEO';
import ClientReports from '../components/client/ClientReports';

export default function ClientReportsPage() {
  return (
    <div className="pb-28">
      <SEO title="Rapports | Client MIDEESSI" description="Consultez et téléchargez vos rapports de performance." />
      <ClientReports />
    </div>
  );
}
