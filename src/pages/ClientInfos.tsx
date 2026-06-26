import SEO from '../components/SEO';
import ClientInfoForm from '../components/client/ClientInfoForm';

export default function ClientInfos() {
  return (
    <div className="pb-28">
      <SEO title="Informations | Client MIDEESSI" description="Gérez les informations de votre marque et vos accès marketing." />
      <ClientInfoForm />
    </div>
  );
}
