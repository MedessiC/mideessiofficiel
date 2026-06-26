import SEO from '../components/SEO';
import ClientKPIs from '../components/client/ClientKPIs';

export default function ClientKpis() {
  return (
    <div className="pb-28">
      <SEO title="KPIs | Client MIDEESSI" description="Consultez vos indicateurs clés de performance MIDEESSI." />
      <ClientKPIs />
    </div>
  );
}
