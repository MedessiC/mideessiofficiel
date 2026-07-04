import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, Award, CheckCircle,
  Mail, MessageCircle, Globe, Sparkles, Share2, Heart, AlertCircle,
  LogIn, UserCheck, X, Loader2, PartyPopper, ChevronRight,
} from 'lucide-react';
import SEO from '../components/SEO';
import { Atelier, supabase } from '../lib/supabase';
import { getDaysRemaining, isAtelierPassed, getCountdownStatus } from '../data/ateliers';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};
const formatPrice = (price: number) => price.toLocaleString('fr-FR');

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="min-h-screen pt-32 flex items-center justify-center bg-white dark:bg-gray-900">
    <LoadingSpinner />
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AtelierDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [atelier, setAtelier] = useState<Atelier | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'program' | 'requirements' | 'instructor'>('program');

  // Registration state
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Share / Save
  const [saved, setSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => { fetchAtelierDetail(); }, [slug]);

  // Check if user already registered
  useEffect(() => {
    if (user && atelier) checkExistingRegistration();
  }, [user, atelier]);

  const fetchAtelierDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ateliers')
        .select('*')
        .eq('slug', slug || '')
        .single();

      if (error) throw error;

      if (data) {
        const transformed: Atelier = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          description: data.description,
          long_description: data.long_description,
          category: data.category,
          image: data.image,
          date: data.date,
          time: data.time,
          duration: data.duration,
          location: data.location,
          capacity: data.capacity,
          registered: data.registered || 0,
          language: data.language,
          level: data.level,
          instructor: {
            name: data.instructor_name || 'Expert MIDEESSI',
            title: data.instructor_title || 'Instructeur',
            image: data.instructor_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            bio: data.instructor_bio || 'Expert passionné dans son domaine',
          },
          objectives: data.objectives || [],
          program: data.program || [],
          prerequisites: data.prerequisites || [],
          materials: data.materials || [],
          price: data.price,
          tags: data.tags || [],
          is_online: data.is_online ?? (data.format !== 'presentiel'),
          meet_link: data.meet_link,
          status: data.status,
        };
        setAtelier(transformed);
      } else {
        navigate('/ateliers');
      }
    } catch (err) {
      console.error('Erreur:', err);
      navigate('/ateliers');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingRegistration = async () => {
    if (!user || !atelier) return;
    try {
      const { data } = await supabase
        .from('atelier_registrations')
        .select('id')
        .eq('atelier_id', atelier.id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setAlreadyRegistered(true);
    } catch (_) {
      // table may not exist yet — silently ignore
    }
  };

  const handleRegister = async () => {
    if (!user || !atelier) return;
    setRegistering(true);
    setRegError(null);
    try {
      // Upsert to avoid duplicate
      const { error } = await supabase
        .from('atelier_registrations')
        .upsert({
          atelier_id: atelier.id,
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Participant',
          registered_at: new Date().toISOString(),
          status: 'confirmed',
        }, { onConflict: 'atelier_id,user_id' });

      if (error) throw error;

      // Increment registered count
      await supabase
        .from('ateliers')
        .update({ registered: atelier.registered + 1 })
        .eq('id', atelier.id);

      setRegistered(true);
      setAlreadyRegistered(true);
    } catch (err: any) {
      console.error(err);
      setRegError(
        err?.code === '42P01'
          ? 'La table des inscriptions n\'existe pas encore en base. Veuillez contacter l\'administrateur.'
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: atelier?.title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  if (loading) return <Skeleton />;
  if (!atelier) return null;

  const availableSpots = atelier.capacity - atelier.registered;
  const isFull = availableSpots <= 0;
  const isAlmostFull = availableSpots <= 5 && availableSpots > 0;
  const daysRemaining = getDaysRemaining(atelier.date);
  const isPassed = isAtelierPassed(atelier.date);
  const countdownStatus = getCountdownStatus(atelier.date);

  const levelColor = {
    Débutant: 'bg-green-500/90',
    Intermédiaire: 'bg-blue-500/90',
    Avancé: 'bg-purple-500/90',
  }[atelier.level] || 'bg-gray-500/90';

  // ─── Booking Panel ─────────────────────────────────────────────────────────
  const BookingPanel = () => {
    // Success
    if (registered || alreadyRegistered) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-2">
              {registered ? 'Inscription confirmée !' : 'Déjà inscrit'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {registered
                ? `Bienvenue ! Un email de confirmation sera envoyé à ${user?.email}.`
                : 'Vous êtes déjà inscrit à cet atelier.'}
            </p>
            {atelier.is_online && atelier.meet_link && (
              <a
                href={atelier.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-midnight px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
              >
                <Globe className="w-4 h-4" /> Rejoindre le lien
              </a>
            )}
            <div className="mt-4 p-3 bg-[var(--bg-surface)] rounded-xl text-left">
              <p className="text-[11px] font-semibold text-[var(--brand-midnight)] dark:text-white mb-1">
                Date : {formatDate(atelier.date)}
              </p>
              <p className="text-[11px] text-gray-500">Heure : {atelier.time} · {atelier.duration} min</p>
              <p className="text-[11px] text-gray-500">Lieu : {atelier.is_online ? 'En ligne' : atelier.location}</p>
            </div>
          </div>
        </div>
      );
    }

    // Not logged in
    if (!user) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[var(--brand-midnight)] px-6 py-4">
            <p className="text-2xl font-black text-gold">{formatPrice(atelier.price)} FCFA</p>
            <p className="text-xs text-gray-300">par personne</p>
          </div>
          <div className="p-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-5 text-center">
              <LogIn className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Connexion requise
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Connectez-vous pour vous inscrire à cet atelier.
              </p>
            </div>
            <Link
              to={`/login?redirect=/ateliers/${atelier.slug}`}
              className="w-full bg-[var(--brand-midnight)] hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <LogIn className="w-4 h-4" /> Se connecter
            </Link>
            <Link
              to={`/signup?redirect=/ateliers/${atelier.slug}`}
              className="w-full bg-gold/10 hover:bg-gold/20 text-[var(--brand-midnight)] dark:text-white border border-gold/30 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Créer un compte gratuit <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      );
    }

    // Logged in — normal booking
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Price Header */}
        <div className="bg-[var(--brand-midnight)] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-gold">{formatPrice(atelier.price)} FCFA</p>
            <p className="text-xs text-gray-300">par personne</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <UserCheck className="w-4 h-4 text-gold" />
              <span className="text-white text-sm font-semibold">
                {availableSpots > 0 ? `${availableSpots} place${availableSpots > 1 ? 's' : ''}` : 'Complet'}
              </span>
            </div>
            <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-400' : 'bg-gold'}`}
                style={{ width: `${Math.min((atelier.registered / atelier.capacity) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{atelier.registered}/{atelier.capacity} inscrits</p>
          </div>
        </div>

        <div className="p-6">
          {/* User info preview */}
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl mb-4 border border-[var(--border)]">
            <div className="w-9 h-9 rounded-full bg-[var(--brand-midnight)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user.email?.[0] || '?').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--brand-midnight)] dark:text-white truncate">
                {user.user_metadata?.username || user.email}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          </div>

          {regError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {regError}
            </div>
          )}

          {isAlmostFull && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl p-3 mb-4 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Plus que {availableSpots} place{availableSpots > 1 ? 's' : ''} disponible !
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={isFull || isPassed || registering}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isPassed
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : isFull
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-gradient-to-r from-gold to-yellow-400 text-midnight shadow-md hover:shadow-lg'
            }`}
          >
            {registering ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Inscription en cours…</>
            ) : isPassed ? (
              'Atelier terminé'
            ) : isFull ? (
              'Complet — Liste d\'attente'
            ) : (
              <>Confirmer mon inscription</>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-500 mt-2">
            Annulation possible jusqu'à 48h avant l'atelier
          </p>

          {/* Share / Save */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" /> Partager
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                saved
                  ? 'border-red-200 bg-red-50 text-red-500 dark:bg-red-900/20 dark:border-red-700'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 font-poppins">
      <SEO
        title={`${atelier.title} | MIDEESSI - Ateliers`}
        description={atelier.description}
        keywords={[atelier.title, 'atelier', 'formation', 'MIDEESSI', ...atelier.tags]}
      />

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--brand-midnight)] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-gold" /> Lien copié !
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative py-14 md:py-24 overflow-hidden bg-[var(--brand-midnight)]">
        <div className="absolute inset-0 z-0">
          <img src={atelier.image} alt={atelier.title} className="w-full h-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-midnight)] via-[var(--brand-midnight)]/70 to-[var(--brand-midnight)]/50" />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-20 right-16 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/ateliers"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-gold transition-colors mb-8 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux ateliers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left — Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${levelColor}`}>
                  {atelier.level}
                </span>
                {isPassed ? (
                  <span className="px-3 py-1 bg-gray-500/90 text-white rounded-full text-xs font-bold">Terminé</span>
                ) : countdownStatus === 'today' ? (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">Aujourd'hui !</span>
                ) : countdownStatus === 'tomorrow' ? (
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">Demain</span>
                ) : countdownStatus === 'soon' ? (
                  <span className="px-3 py-1 bg-gold text-midnight rounded-full text-xs font-bold">Dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}</span>
                ) : null}
                <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full text-xs font-semibold capitalize">
                  {atelier.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                {atelier.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed max-w-2xl">
                {atelier.description}
              </p>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Calendar, label: 'Date', value: new Date(atelier.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) },
                  { icon: Clock, label: 'Durée', value: `${atelier.duration} min` },
                  { icon: Users, label: 'Places', value: isFull ? 'Complet' : `${availableSpots}/${atelier.capacity}` },
                  { icon: atelier.is_online ? Globe : MapPin, label: 'Format', value: atelier.is_online ? 'En ligne' : 'Présentiel' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl p-3 text-center">
                    <Icon className="w-5 h-5 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-300">{label}</p>
                    <p className={`text-sm font-bold text-white mt-0.5 ${isFull && label === 'Places' ? 'text-red-400' : ''}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {atelier.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {atelier.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white/10 border border-white/15 text-gray-300 px-2.5 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Booking card (desktop) */}
            <div className="hidden lg:block">
              <BookingPanel />
            </div>
          </div>
        </div>
      </section>

      {/* ── BOOKING CARD (mobile) ── */}
      <div className="lg:hidden px-4 sm:px-6 -mt-4 mb-8 relative z-20">
        <BookingPanel />
      </div>

      {/* ── TABS CONTENT ── */}
      <section className="py-10 md:py-16 bg-[var(--bg-page)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-[var(--border)] w-fit">
            {(['program', 'requirements', 'instructor'] as const).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tabName
                    ? 'bg-[var(--brand-midnight)] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-[var(--brand-midnight)] dark:hover:text-white'
                }`}
              >
                {tabName === 'program' && 'Programme'}
                {tabName === 'requirements' && 'Prérequis'}
                {tabName === 'instructor' && 'Instructeur'}
              </button>
            ))}
          </div>

          {/* Program Tab */}
          {activeTab === 'program' && (
            <div className="space-y-5">
              {atelier.objectives.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-4">
                    Objectifs de l'atelier
                  </h3>
                  <ul className="space-y-3">
                    {atelier.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {atelier.program.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-4">Programme détaillé</h3>
                  <div className="space-y-3">
                    {atelier.program.map((session, idx) => (
                      <div key={idx} className="border-l-4 border-gold pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gold" />
                          <span className="text-sm font-bold text-[var(--brand-midnight)] dark:text-white">{session.time}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{session.title}</p>
                        {session.description && <p className="text-xs text-gray-500 mt-1">{session.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {atelier.materials.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-4">Matériel fourni</h3>
                  <ul className="space-y-2">
                    {atelier.materials.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-4">Prérequis</h3>
                {atelier.prerequisites.length > 0 ? (
                  <ul className="space-y-3">
                    {atelier.prerequisites.map((pre, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{pre}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Aucun prérequis — ouvert à tous !</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[var(--border)] shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Langue</p>
                  <p className="text-lg font-bold text-gold">{atelier.language}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[var(--border)] shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Format</p>
                  <p className="text-lg font-bold text-gold flex items-center gap-2">
                    {atelier.is_online ? <><Globe className="w-5 h-5" /> En ligne</> : <><MapPin className="w-5 h-5" /> Présentiel</>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm text-center">
                <img
                  src={atelier.instructor.image}
                  alt={atelier.instructor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gold/20"
                  loading="lazy"
                />
                <h3 className="text-xl font-black text-[var(--brand-midnight)] dark:text-white mb-1">{atelier.instructor.name}</h3>
                <p className="text-gold font-semibold text-sm mb-5">{atelier.instructor.title}</p>
                <div className="flex gap-3 justify-center">
                  <a
                    href="mailto:contact@mideessi.com"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-midnight)] text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                  <a
                    href="https://wa.me/2290164409691"
                    className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 text-[var(--brand-midnight)] dark:text-white font-bold rounded-xl text-sm hover:bg-gold/20 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-gold" /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                <h4 className="text-lg font-bold text-[var(--brand-midnight)] dark:text-white mb-3">À propos</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{atelier.instructor.bio}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 bg-[var(--brand-midnight)] text-white mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-black mb-2">Des questions ?</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">
            Notre équipe est là pour vous aider. Contactez-nous avant de vous inscrire.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-gold text-midnight px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors">
              Nous contacter
            </Link>
            <Link to="/ateliers" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
              Voir les autres ateliers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AtelierDetail;
