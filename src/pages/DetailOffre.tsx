import { ArrowLeft, Check, X, MessageCircle, FileText, Sparkles, Target, Zap, ChevronRight, ShieldCheck } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getOffreBySlug, offres } from '../data/offres';

const DetailOffre = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const offre = getOffreBySlug(slug || '');

  if (!offre) {
    return (
      <div className="min-h-screen pt-24 bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand-midnight)] mb-4">Offre introuvable</h1>
          <p className="text-[var(--text-secondary)] mb-8">Le pack que vous recherchez n'existe pas ou a été retiré.</p>
          <button
            onClick={() => navigate('/offres')}
            className="inline-flex items-center gap-2 bg-[var(--brand-midnight)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  // Primary action: navigate to dedicated dossier submission page
  const handleOpenSubmitPage = () => {
    const url = `/clients/submit-dossier?offerSlug=${offre.slug}&offerName=${encodeURIComponent(offre.nom)}&offerType=presence`;
    navigate(url);
  };

  const handleWhatsApp = () => {
    const message = `Bonjour MIDEESSI ! Je suis intéressé(e) par le pack ${offre.nom}. Pouvons-nous en discuter ?`;
    window.open(`https://wa.me/2290164409691?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-20 pb-16 font-poppins selection:bg-[var(--brand-gold)] selection:text-midnight">
      <SEO
        title={`${offre.nom} - ${offre.description} | MIDEESSI`}
        description={`Découvrez le pack ${offre.nom} : ${offre.description}. ${offre.prix.toLocaleString('fr-FR')} FCFA/mois.`}
        keywords={[`pack ${offre.nom}`, 'offre', 'agence digitale', 'MIDEESSI']}
      />

      {/* ── Top Navigation ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <button
          onClick={() => navigate('/offres')}
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--brand-gold)] font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </button>
      </div>

      {/* ── Hero Section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[var(--brand-midnight)] to-blue-900 shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--brand-gold)]/20 to-transparent rounded-full blur-[80px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[60px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[var(--brand-gold)] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Pack Présence Digitale
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                {offre.nom}
              </h1>
              <p className="text-xl text-blue-200 font-medium italic mb-6">
                "{offre.signification}"
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                {offre.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleOpenSubmitPage}
                  className="bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 text-midnight font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Démarrer ce pack
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> Poser une question
                </button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                <div className="absolute inset-0 bg-[var(--brand-midnight)]/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={offre.image}
                  alt={offre.nom}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Price Tag */}
              {offre.id !== 'livnon' && (
                <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:-left-8 bg-white text-[var(--brand-midnight)] p-5 rounded-2xl shadow-xl border border-[var(--border)] z-20 animate-fade-in-up">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Investissement</p>
                  <p className="text-3xl font-black text-[var(--brand-gold)] leading-none mb-1">
                    {offre.prix.toLocaleString('fr-FR')} <span className="text-lg font-bold text-[var(--brand-midnight)]">FCFA</span>
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold">Par mois • 3 mois min.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* ── Left Content (Details) ── */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Ce que vous obtenez */}
            <section className="bg-white rounded-[28px] p-8 border border-[var(--border)] shadow-soft">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-gold)] to-yellow-400 flex items-center justify-center shadow-md">
                  <Target className="w-6 h-6 text-midnight" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--brand-midnight)]">Ce que vous obtenez</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {offre.whaYouGet.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border)]">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pour qui */}
            <section className="bg-gradient-to-r from-[var(--brand-midnight)] to-blue-900 rounded-[28px] p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-[var(--brand-gold)]">🎯</span> Pour qui est ce pack ?
                </h2>
                <p className="text-lg leading-relaxed text-blue-100 font-medium">
                  {offre.forWho}
                </p>
              </div>
            </section>

            {/* Liste complète des fonctionnalités */}
            <section className="bg-white rounded-[28px] p-8 border border-[var(--border)] shadow-soft">
              <h2 className="text-2xl font-bold text-[var(--brand-midnight)] mb-6">Détails des prestations</h2>
              <div className="divide-y divide-[var(--border)]">
                {offre.features.map((feature, idx) => (
                  <div key={idx} className="py-4 flex items-center gap-4 hover:bg-[var(--bg-surface)] -mx-4 px-4 rounded-xl transition-colors">
                    {feature.included ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className={`text-base font-medium ${feature.included ? 'text-[var(--text-primary)]' : 'text-gray-400 line-through'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Note Importante */}
            <section className="bg-blue-50 border border-blue-100 rounded-[24px] p-6 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Transparence garantie</h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  {offre.note}
                </p>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>Important :</strong> Le budget publicitaire reste à vos frais. Nous ne prenons aucune commission sur ce budget et optimisons chaque FCFA dépensé.
                </p>
              </div>
            </section>

          </div>

          {/* ── Right Column (Sticky Sidebar) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Sticky Summary Card */}
              <div className="bg-white rounded-[28px] border border-[var(--brand-gold)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-gradient-to-b from-[var(--brand-gold)]/10 to-transparent p-6 text-center border-b border-[var(--border)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-midnight)] mb-2">Mensualité</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-4xl font-black text-[var(--brand-midnight)]">
                      {offre.prix.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-sm font-bold text-[var(--text-secondary)] mt-2">FCFA</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Contrat minimum de 3 mois</p>
                </div>

                <div className="p-6 bg-white">
                  <button
                    onClick={handleOpenSubmitPage}
                    className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 text-[var(--brand-midnight)] font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-3"
                  >
                    <FileText className="w-5 h-5" /> Choisir ce pack
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" /> Échanger sur WhatsApp
                  </button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-emerald-500" /> Réponse sous 24h
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-emerald-500" /> Audit initial offert
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-emerald-500" /> Accompagnement dédié
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Link */}
              <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5 text-center">
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Besoin d'autres fonctionnalités ?</p>
                <Link to="/offres" className="inline-flex items-center justify-center gap-1 text-sm font-bold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)] transition-colors">
                  Comparer les offres <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Other Offers Cross-sell ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-[var(--border)]">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brand-midnight)] mb-4">Ces offres pourraient aussi vous intéresser</h2>
          <p className="text-[var(--text-secondary)]">Découvrez nos autres packs de présence digitale adaptés à d'autres stades de développement.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offres.filter(o => o.id !== offre.id).slice(0, 3).map((other) => (
            <Link
              key={other.id}
              to={`/offres/${other.slug}`}
              className="group bg-white rounded-2xl border border-[var(--border)] p-6 hover:border-[var(--brand-gold)] hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-[var(--brand-midnight)] group-hover:text-[var(--brand-gold)] transition-colors mb-1">{other.nom}</h3>
              <p className="text-xs text-[var(--text-secondary)] italic mb-4">"{other.signification}"</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black text-[var(--brand-midnight)]">{other.prix.toLocaleString('fr-FR')}</span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">FCFA/mois</span>
              </div>
              <p className="text-sm text-[var(--text-primary)] line-clamp-2">{other.description}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DetailOffre;
