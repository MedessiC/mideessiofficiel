import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Home, ChevronDown, Search } from 'lucide-react';
import SEO from '../components/SEO';
import { normalizeEmail, sanitizeUsername, validatePassword } from '../utils/authProfile';
import { getRedirectTargetFromLocation, persistRedirectTarget } from '../utils/authRedirect';
import { COUNTRY_CODES, FlagIcon } from '../utils/countries';
import { getExampleNumber, AsYouType, type CountryCode } from 'libphonenumber-js';

/* ── Custom NationalityInput Component ──────────────────── */
interface NationalityInputProps {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
}

function NationalityInput({
  value,
  onChange,
  loading
}: NationalityInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_CODES.find(c => c.name === value) || COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.includes(query) ||
    c.abbr.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex items-center gap-3 w-full rounded-lg border px-3 py-2.5 text-sm bg-white cursor-pointer select-none disabled:opacity-50"
        style={{ borderColor: '#D1D5DB' }}
        onClick={() => { if (!loading) setOpen(o => !o); }}
      >
        <FlagIcon abbr={selected.abbr} className="w-5 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
        <span className="flex-1 text-gray-900 font-semibold">{selected.name}</span>
        <ChevronDown size={16} className={`text-[#5E6472] transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div
          className="absolute z-50 top-[calc(100%+6px)] left-0 w-full bg-white border rounded-lg shadow-xl overflow-hidden"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="p-2 border-b" style={{ borderColor: '#F3F4F6' }}>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-md">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un pays..."
                className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c, idx) => (
              <button
                key={`${c.abbr}-${idx}`}
                type="button"
                onClick={() => { onChange(c.name); setOpen(false); setQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left transition-colors ${
                  c.name === value ? 'bg-gray-50' : ''
                }`}
              >
                <FlagIcon abbr={c.abbr} className="w-6 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">Aucun résultat</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Custom PhoneInput Component ────────────────────────── */
interface PhoneInputProps {
  value: string;
  selectedAbbr: string;
  onChange: (v: string) => void;
  onCountrySelect: (code: string, abbr: string) => void;
  loading: boolean;
}

function PhoneInput({
  value,
  selectedAbbr,
  onChange,
  onCountrySelect,
  loading
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_CODES.find(c => c.abbr === selectedAbbr) || COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.includes(query) ||
    c.abbr.toLowerCase().includes(query.toLowerCase())
  );

  const placeholder = useMemo(() => {
    try {
      const example = getExampleNumber(selected.abbr as CountryCode, {});
      return example ? example.formatNational() : '';
    } catch {
      return '';
    }
  }, [selected.abbr]);

  const handleChange = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) { onChange(''); return; }
    try {
      const formatter = new AsYouType(selected.abbr as CountryCode);
      const formatted = formatter.input(raw.replace(/[^\d\s\-().+]/g, ''));
      onChange(formatted);
    } catch {
      onChange(raw.replace(/[^0-9\s\-().+]/g, ''));
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      className="relative flex rounded-lg border bg-white disabled:opacity-50 transition-all duration-200"
      style={{ borderColor: '#D1D5DB' }}
      ref={ref}
    >
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 border-r bg-transparent hover:bg-gray-50 transition-colors rounded-l-lg text-sm font-semibold text-gray-700 disabled:opacity-50 flex-shrink-0"
        style={{ borderColor: '#D1D5DB' }}
      >
        <FlagIcon abbr={selected.abbr} className="w-5 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-800">{selected.code}</span>
        <ChevronDown size={12} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <input
        type="tel"
        value={value}
        disabled={loading}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-r-lg"
      />

      {open && (
        <div
          className="absolute z-50 top-[calc(100%+6px)] left-0 w-80 bg-white border rounded-lg shadow-xl overflow-hidden"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="p-2 border-b" style={{ borderColor: '#F3F4F6' }}>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-md">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un pays ou indicatif..."
                className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c, idx) => (
              <button
                key={`${c.abbr}-${idx}`}
                type="button"
                onClick={() => { onCountrySelect(c.code, c.abbr); setOpen(false); setQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left transition-colors ${
                  c.abbr === selected.abbr ? 'bg-gray-50' : ''
                }`}
              >
                <FlagIcon abbr={c.abbr} className="w-6 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{c.name}</span>
                <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">Aucun résultat</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Signup Component ──────────────────────────────── */
export default function Signup() {
  // Step 1: Personal info
  const [fullName, setFullName] = useState('');
  const [nationality, setNationality] = useState('Bénin');

  // Step 2: Contact info & username
  const [phone, setPhone] = useState('');
  const [phoneCountryAbbr, setPhoneCountryAbbr] = useState('BJ');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+229');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [usernameManualEdited, setUsernameManualEdited] = useState(false);

  // Step 3: Password & security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UX & Flow state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signInWithProvider } = useAuth();

  // Pre-fill username from full name if not manually edited
  useEffect(() => {
    if (fullName && !usernameManualEdited) {
      const generated = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9._-]/g, '_') // replace non-alphanumeric with underscores
        .replace(/_+/g, '_') // deduplicate underscores
        .replace(/(^_|_$)/g, '') // trim leading/trailing underscores
        .slice(0, 20);
      setUsername(generated);
    }
  }, [fullName, usernameManualEdited]);

  const validateStep1 = () => {
    if (!fullName.trim()) {
      setError('Veuillez entrer votre nom complet');
      return false;
    }
    if (fullName.trim().length < 2) {
      setError('Le nom complet doit comporter au moins 2 caractères');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!phone.trim()) {
      setError('Le numéro de téléphone est requis');
      return false;
    }
    if (!email.trim()) {
      setError("L'adresse email est requise");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    if (!username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return false;
    }
    if (username.trim().length < 3) {
      setError("Le nom d'utilisateur doit faire au moins 3 caractères");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = normalizeEmail(email);
    const safeUsername = sanitizeUsername(username);
    const passwordValidation = validatePassword(password);

    if (!fullName || !nationality || !phone || !normalizedEmail || !safeUsername || !password || !confirmPassword) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Mot de passe invalide');
      return;
    }

    if (!termsAccepted) {
      setError("Vous devez accepter les conditions d'utilisation");
      return;
    }

    const fullPhone = `${phoneCountryCode} ${phone.trim()}`;

    setLoading(true);
    try {
      const { error: signupError } = await signUp(
        normalizedEmail,
        password,
        safeUsername,
        fullName.trim(),
        nationality,
        fullPhone
      );

      if (signupError) {
        setError(signupError);
        setLoading(false);
        return;
      }

      const redirectTarget = getRedirectTargetFromLocation(location);
      if (redirectTarget) {
        persistRedirectTarget(redirectTarget);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login?signup=success');
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleProviderSignup = async (provider: 'google') => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion sociale');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <SEO title="Inscription confirmée | MIDEESSI" description="Votre compte a été créé avec succès" keywords={['inscription', 'succès', 'MIDEESSI']} />
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="w-full max-w-md">
            <div className="rounded-2xl p-6 sm:p-8 text-center bg-white border border-[#E5E7EB] shadow-sm">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#111827]">Inscription réussie !</h1>
              <p className="mb-6 text-sm text-[#5E6472] leading-relaxed">
                Vérifiez votre boîte de réception. Un lien de confirmation a été envoyé à l'adresse <strong className="text-gray-900">{email}</strong>.
              </p>
              <p className="text-xs text-[#9CA3AF] animate-pulse">Redirection vers la connexion dans quelques secondes...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Inscription | MIDEESSI" description="Créez votre compte MIDEESSI gratuitement" keywords={['inscription', 'créer compte', 'signup', 'MIDEESSI']} />

      <div
        className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#191970] hover:text-[#FFD700] transition-colors"
              title="Retour à l'accueil"
            >
              <Home size={18} />
              Accueil
            </Link>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-center mb-2"
            style={{
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            Inscription
          </h1>

          <p
            className="text-center text-sm sm:text-base mb-8"
            style={{ color: '#5E6472' }}
          >
            Créez votre compte en quelques étapes.
          </p>

          {/* Card */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Steps indicator */}
            <div className="flex items-center gap-1.5 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: s <= step ? '#191970' : '#E5E7EB',
                  }}
                />
              ))}
              <span className="text-[10px] font-bold uppercase tracking-wider ml-2" style={{ color: '#5E6472' }}>
                Étape {step}/3
              </span>
            </div>

            {/* Error display */}
            {error && (
              <div
                className="mb-5 flex items-start gap-3 rounded-xl p-4 text-sm"
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{error}</span>
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Nom Complet */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Nom Complet
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6472]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={loading}
                        placeholder="Ex: Amoussou Houéfa"
                        className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#191970';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Nationalité */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Nationalité
                    </label>
                    <NationalityInput
                      value={nationality}
                      onChange={setNationality}
                      loading={loading}
                    />
                  </div>

                  {/* Submit / Next Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 shadow-sm hover:shadow flex items-center justify-center gap-2 mt-4"
                    style={{ backgroundColor: '#191970' }}
                  >
                    Continuer <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: Coordinates */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Téléphone international */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Numéro de téléphone
                    </label>
                    <PhoneInput
                      value={phone}
                      selectedAbbr={phoneCountryAbbr}
                      onChange={setPhone}
                      onCountrySelect={(code, abbr) => {
                        setPhoneCountryCode(code);
                        setPhoneCountryAbbr(abbr);
                      }}
                      loading={loading}
                    />
                  </div>

                  {/* Adresse email */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6472]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        placeholder="vous@exemple.com"
                        className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#191970';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Nom d'utilisateur */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6472]" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setUsernameManualEdited(true);
                        }}
                        disabled={loading}
                        placeholder="nom_utilisateur"
                        className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#191970';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        required
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">Sera visible publiquement (ex. commentaires).</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={loading}
                      className="flex-1 rounded-lg border py-2.5 text-sm font-semibold text-gray-700 bg-transparent hover:bg-gray-50 transition-colors disabled:opacity-50"
                      style={{ borderColor: '#D1D5DB' }}
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 shadow-sm hover:shadow flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#191970' }}
                    >
                      Continuer <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Security & Passwords */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Mot de passe */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6472]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        placeholder="••••••••"
                        className="w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#191970';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E6472] hover:text-[#191970] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">Min. 8 caractères (lettre et chiffre requis).</p>
                  </div>

                  {/* Confirmer le mot de passe */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#111827' }}>
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6472]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        placeholder="••••••••"
                        className="w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#191970';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 25, 112, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E6472] hover:text-[#191970] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Accept terms */}
                  <div className="flex items-start gap-2.5 py-1 text-xs text-[#5E6472]">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#191970] focus:ring-[#191970] cursor-pointer"
                    />
                    <label htmlFor="terms" className="cursor-pointer select-none">
                      J'accepte les conditions d'utilisation et la politique de confidentialité.
                    </label>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={loading}
                      className="flex-1 rounded-lg border py-2.5 text-sm font-semibold text-gray-700 bg-transparent hover:bg-gray-50 transition-colors disabled:opacity-50"
                      style={{ borderColor: '#D1D5DB' }}
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 shadow-sm hover:shadow disabled:opacity-75 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#191970' }}
                    >
                      {loading ? 'Création...' : 'S\'inscrire'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Separator & Google OAuth Button */}
            {step === 1 && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1" style={{ height: '1px', backgroundColor: '#E5E7EB' }}></div>
                  <span className="text-xs font-semibold" style={{ color: '#5E6472' }}>
                    ou
                  </span>
                  <div className="flex-1" style={{ height: '1px', backgroundColor: '#E5E7EB' }}></div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProviderSignup('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all disabled:opacity-50 bg-white"
                  style={{
                    borderColor: '#E5E7EB',
                    color: '#111827',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#191970';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 533.5 544.3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="#4285F4" d="M533.5 278.4c0-18.8-1.7-37-5-54.7H272.1v103.5h146.9c-6.3 34.1-25.2 62.5-53.7 81.7v67.8h86.9c50.8-46.8 80.3-115.9 80.3-198.3z" />
                    <path fill="#34A853" d="M272.1 544.3c72.7 0 133.7-24.1 178.2-65.7l-86.9-67.8c-24.2 16.2-55.3 25.8-91.3 25.8-70.1 0-129.4-47.2-150.6-110.4h-89.4v69.4C75.9 474.7 168.5 544.3 272.1 544.3z" />
                    <path fill="#FBBC05" d="M121.5 327.2c-4.9-14.7-7.7-30.4-7.7-46.5s2.8-31.8 7.7-46.5v-69.4H32.1c-19.2 38.4-30.2 81.3-30.2 125.9s11 87.5 30.2 125.9l89.4-69.4z" />
                    <path fill="#EA4335" d="M272.1 107.7c39.6 0 75.1 13.6 103.2 40.3l77.4-77.4C402.2 24.6 339.5 0 272.1 0 168.5 0 75.9 69.6 32.1 178.5l89.4 69.4c21.2-63.2 80.5-110.4 150.6-110.4z" />
                  </svg>
                  Continuer avec Google
                </button>
              </>
            )}

            {/* Back to Login link */}
            <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[#5E6472]">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-bold transition-colors"
                  style={{ color: '#191970' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#191970';
                  }}
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
