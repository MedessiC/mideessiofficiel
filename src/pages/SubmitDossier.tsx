import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Send, FileText, Sparkles, ShieldCheck, Clock3,
  ChevronLeft, User, Globe, Upload, CheckCircle2, AlertCircle,
  Target, Layers, ArrowRight, Building2, ChevronDown, Search,
  Lightbulb, Users, TrendingUp, Lock, BadgeCheck,
  Palette, Smartphone, PenLine, BarChart3, ShoppingCart,
  Zap, Calendar, Timer, Laptop2
} from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { getExampleNumber, AsYouType, type CountryCode } from 'libphonenumber-js';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

/* ── Country phone data (tous les pays du monde) ─────────── */
const COUNTRY_CODES = [
  // Afrique de l'Ouest (priorité)
  { code: '+229', name: 'Bénin',              abbr: 'BJ', placeholder: '90 12 34 56' },
  { code: '+228', name: 'Togo',               abbr: 'TG', placeholder: '90 12 34 56' },
  { code: '+225', name: "Côte d'Ivoire",      abbr: 'CI', placeholder: '07 12 34 56 78' },
  { code: '+237', name: 'Cameroun',           abbr: 'CM', placeholder: '6 71 23 45 67' },
  { code: '+221', name: 'Sénégal',            abbr: 'SN', placeholder: '77 123 45 67' },
  { code: '+223', name: 'Mali',               abbr: 'ML', placeholder: '66 12 34 56' },
  { code: '+226', name: 'Burkina Faso',       abbr: 'BF', placeholder: '70 12 34 56' },
  { code: '+224', name: 'Guinée',             abbr: 'GN', placeholder: '621 23 45 67' },
  { code: '+227', name: 'Niger',              abbr: 'NE', placeholder: '96 12 34 56' },
  { code: '+234', name: 'Nigéria',            abbr: 'NG', placeholder: '803 123 4567' },
  { code: '+233', name: 'Ghana',              abbr: 'GH', placeholder: '23 123 4567' },
  { code: '+245', name: 'Guinée-Bissau',      abbr: 'GW', placeholder: '955 123 456' },
  { code: '+232', name: 'Sierra Leone',       abbr: 'SL', placeholder: '76 123 456' },
  { code: '+231', name: 'Libéria',            abbr: 'LR', placeholder: '770 123 456' },
  { code: '+222', name: 'Mauritanie',         abbr: 'MR', placeholder: '22 12 34 56' },
  { code: '+220', name: 'Gambie',             abbr: 'GM', placeholder: '301 2345' },
  { code: '+238', name: 'Cap-Vert',           abbr: 'CV', placeholder: '991 23 45' },
  // Afrique Centrale
  { code: '+241', name: 'Gabon',              abbr: 'GA', placeholder: '06 12 34 56' },
  { code: '+236', name: 'Centrafrique',       abbr: 'CF', placeholder: '70 01 23 45' },
  { code: '+235', name: 'Tchad',              abbr: 'TD', placeholder: '63 01 23 45' },
  { code: '+242', name: 'Congo',              abbr: 'CG', placeholder: '06 123 4567' },
  { code: '+243', name: 'RD Congo',           abbr: 'CD', placeholder: '99 123 4567' },
  { code: '+240', name: 'Guinée Équat.',      abbr: 'GQ', placeholder: '222 123 456' },
  { code: '+239', name: 'São Tomé',           abbr: 'ST', placeholder: '981 2345' },
  // Afrique de l'Est
  { code: '+254', name: 'Kenya',              abbr: 'KE', placeholder: '712 345678' },
  { code: '+255', name: 'Tanzanie',           abbr: 'TZ', placeholder: '612 345 678' },
  { code: '+256', name: 'Ouganda',            abbr: 'UG', placeholder: '712 345678' },
  { code: '+250', name: 'Rwanda',             abbr: 'RW', placeholder: '78 123 4567' },
  { code: '+257', name: 'Burundi',            abbr: 'BI', placeholder: '79 56 12 34' },
  { code: '+251', name: 'Éthiopie',           abbr: 'ET', placeholder: '91 123 4567' },
  { code: '+252', name: 'Somalie',            abbr: 'SO', placeholder: '71 123 456' },
  { code: '+253', name: 'Djibouti',           abbr: 'DJ', placeholder: '77 83 10 01' },
  { code: '+291', name: 'Érythrée',           abbr: 'ER', placeholder: '07 123 456' },
  { code: '+249', name: 'Soudan',             abbr: 'SD', placeholder: '91 123 1234' },
  { code: '+211', name: 'Soudan du Sud',      abbr: 'SS', placeholder: '977 123 456' },
  // Afrique du Nord
  { code: '+212', name: 'Maroc',              abbr: 'MA', placeholder: '06 12 34 56 78' },
  { code: '+216', name: 'Tunisie',            abbr: 'TN', placeholder: '20 123 456' },
  { code: '+213', name: 'Algérie',            abbr: 'DZ', placeholder: '551 234 567' },
  { code: '+218', name: 'Libye',              abbr: 'LY', placeholder: '91 234 5678' },
  { code: '+20',  name: 'Égypte',             abbr: 'EG', placeholder: '10 0123 4567' },
  // Afrique Australe
  { code: '+27',  name: 'Afrique du Sud',     abbr: 'ZA', placeholder: '71 123 4567' },
  { code: '+263', name: 'Zimbabwe',           abbr: 'ZW', placeholder: '71 234 5678' },
  { code: '+260', name: 'Zambie',             abbr: 'ZM', placeholder: '95 5123456' },
  { code: '+265', name: 'Malawi',             abbr: 'MW', placeholder: '991 234 567' },
  { code: '+258', name: 'Mozambique',         abbr: 'MZ', placeholder: '82 123 4567' },
  { code: '+261', name: 'Madagascar',         abbr: 'MG', placeholder: '32 12 345 67' },
  { code: '+230', name: 'Maurice',            abbr: 'MU', placeholder: '5251 2345' },
  { code: '+269', name: 'Comores',            abbr: 'KM', placeholder: '321 23 45' },
  { code: '+266', name: 'Lesotho',            abbr: 'LS', placeholder: '5012 3456' },
  { code: '+268', name: 'Eswatini',           abbr: 'SZ', placeholder: '7612 3456' },
  { code: '+264', name: 'Namibie',            abbr: 'NA', placeholder: '81 123 4567' },
  { code: '+267', name: 'Botswana',           abbr: 'BW', placeholder: '71 123 456' },
  { code: '+244', name: 'Angola',             abbr: 'AO', placeholder: '923 123 456' },
  // Europe de l'Ouest
  { code: '+33',  name: 'France',             abbr: 'FR', placeholder: '06 12 34 56 78' },
  { code: '+32',  name: 'Belgique',           abbr: 'BE', placeholder: '0470 12 34 56' },
  { code: '+41',  name: 'Suisse',             abbr: 'CH', placeholder: '078 123 45 67' },
  { code: '+352', name: 'Luxembourg',         abbr: 'LU', placeholder: '628 123 456' },
  { code: '+31',  name: 'Pays-Bas',           abbr: 'NL', placeholder: '06 12345678' },
  { code: '+49',  name: 'Allemagne',          abbr: 'DE', placeholder: '0151 12345678' },
  { code: '+43',  name: 'Autriche',           abbr: 'AT', placeholder: '0664 123456' },
  { code: '+34',  name: 'Espagne',            abbr: 'ES', placeholder: '612 345 678' },
  { code: '+351', name: 'Portugal',           abbr: 'PT', placeholder: '912 345 678' },
  { code: '+39',  name: 'Italie',             abbr: 'IT', placeholder: '312 345 6789' },
  { code: '+44',  name: 'Royaume-Uni',        abbr: 'GB', placeholder: '07700 123456' },
  { code: '+353', name: 'Irlande',            abbr: 'IE', placeholder: '085 123 4567' },
  { code: '+47',  name: 'Norvège',            abbr: 'NO', placeholder: '406 12 345' },
  { code: '+46',  name: 'Suède',              abbr: 'SE', placeholder: '070 123 45 67' },
  { code: '+45',  name: 'Danemark',           abbr: 'DK', placeholder: '20 12 34 56' },
  { code: '+358', name: 'Finlande',           abbr: 'FI', placeholder: '041 2345678' },
  { code: '+354', name: 'Islande',            abbr: 'IS', placeholder: '611 2345' },
  { code: '+30',  name: 'Grèce',              abbr: 'GR', placeholder: '691 234 5678' },
  { code: '+357', name: 'Chypre',             abbr: 'CY', placeholder: '96 123456' },
  { code: '+356', name: 'Malte',              abbr: 'MT', placeholder: '9961 2345' },
  // Europe de l'Est
  { code: '+7',   name: 'Russie',             abbr: 'RU', placeholder: '912 345 67 89' },
  { code: '+380', name: 'Ukraine',            abbr: 'UA', placeholder: '50 123 4567' },
  { code: '+48',  name: 'Pologne',            abbr: 'PL', placeholder: '512 345 678' },
  { code: '+420', name: 'Tchéquie',           abbr: 'CZ', placeholder: '601 123 456' },
  { code: '+421', name: 'Slovaquie',          abbr: 'SK', placeholder: '0912 123 456' },
  { code: '+36',  name: 'Hongrie',            abbr: 'HU', placeholder: '20 123 4567' },
  { code: '+40',  name: 'Roumanie',           abbr: 'RO', placeholder: '721 234 567' },
  { code: '+359', name: 'Bulgarie',           abbr: 'BG', placeholder: '48 123 456' },
  { code: '+381', name: 'Serbie',             abbr: 'RS', placeholder: '60 1234567' },
  { code: '+385', name: 'Croatie',            abbr: 'HR', placeholder: '91 234 5678' },
  { code: '+386', name: 'Slovénie',           abbr: 'SI', placeholder: '31 234 567' },
  { code: '+387', name: 'Bosnie',             abbr: 'BA', placeholder: '61 123 456' },
  { code: '+382', name: 'Monténégro',         abbr: 'ME', placeholder: '67 622 901' },
  { code: '+383', name: 'Kosovo',             abbr: 'XK', placeholder: '43 201 234' },
  { code: '+355', name: 'Albanie',            abbr: 'AL', placeholder: '066 123 4567' },
  { code: '+389', name: 'Macédoine du Nord',  abbr: 'MK', placeholder: '72 345 678' },
  { code: '+373', name: 'Moldavie',           abbr: 'MD', placeholder: '621 12 345' },
  { code: '+375', name: 'Biélorussie',        abbr: 'BY', placeholder: '29 491 19 11' },
  { code: '+370', name: 'Lituanie',           abbr: 'LT', placeholder: '612 34567' },
  { code: '+371', name: 'Lettonie',           abbr: 'LV', placeholder: '21 234 567' },
  { code: '+372', name: 'Estonie',            abbr: 'EE', placeholder: '5123 4567' },
  { code: '+374', name: 'Arménie',            abbr: 'AM', placeholder: '77 123456' },
  { code: '+995', name: 'Géorgie',            abbr: 'GE', placeholder: '555 12 34 56' },
  { code: '+994', name: 'Azerbaïdjan',        abbr: 'AZ', placeholder: '40 123 45 67' },
  // Amériques
  { code: '+1',   name: 'États-Unis',         abbr: 'US', placeholder: '(201) 555-0123' },
  { code: '+1',   name: 'Canada',             abbr: 'CA', placeholder: '(506) 234-5678' },
  { code: '+52',  name: 'Mexique',            abbr: 'MX', placeholder: '55 1234 5678' },
  { code: '+55',  name: 'Brésil',             abbr: 'BR', placeholder: '11 91234-5678' },
  { code: '+54',  name: 'Argentine',          abbr: 'AR', placeholder: '9 11 2345-6789' },
  { code: '+56',  name: 'Chili',              abbr: 'CL', placeholder: '9 6123 4567' },
  { code: '+57',  name: 'Colombie',           abbr: 'CO', placeholder: '301 234 5678' },
  { code: '+58',  name: 'Venezuela',          abbr: 'VE', placeholder: '0412-123.45.67' },
  { code: '+51',  name: 'Pérou',              abbr: 'PE', placeholder: '912 345 678' },
  { code: '+593', name: 'Équateur',           abbr: 'EC', placeholder: '099 123 4567' },
  { code: '+591', name: 'Bolivie',            abbr: 'BO', placeholder: '71234567' },
  { code: '+595', name: 'Paraguay',           abbr: 'PY', placeholder: '0961 456789' },
  { code: '+598', name: 'Uruguay',            abbr: 'UY', placeholder: '094 231 234' },
  { code: '+53',  name: 'Cuba',               abbr: 'CU', placeholder: '5 1234567' },
  { code: '+509', name: 'Haïti',              abbr: 'HT', placeholder: '34 10 1234' },
  { code: '+1',   name: 'Jamaïque',           abbr: 'JM', placeholder: '(876) 210-1234' },
  { code: '+1',   name: 'Porto Rico',         abbr: 'PR', placeholder: '(787) 234-5678' },
  // Asie
  { code: '+86',  name: 'Chine',              abbr: 'CN', placeholder: '131 2345 6789' },
  { code: '+81',  name: 'Japon',              abbr: 'JP', placeholder: '090-1234-5678' },
  { code: '+82',  name: 'Corée du Sud',       abbr: 'KR', placeholder: '010-2000-0000' },
  { code: '+91',  name: 'Inde',               abbr: 'IN', placeholder: '81234 56789' },
  { code: '+92',  name: 'Pakistan',           abbr: 'PK', placeholder: '301 2345678' },
  { code: '+880', name: 'Bangladesh',         abbr: 'BD', placeholder: '01812-345678' },
  { code: '+94',  name: 'Sri Lanka',          abbr: 'LK', placeholder: '071 234 5678' },
  { code: '+977', name: 'Népal',              abbr: 'NP', placeholder: '984-1234567' },
  { code: '+975', name: 'Bhoutan',            abbr: 'BT', placeholder: '17 12 34 56' },
  { code: '+960', name: 'Maldives',           abbr: 'MV', placeholder: '771 2345' },
  { code: '+62',  name: 'Indonésie',          abbr: 'ID', placeholder: '0812-3456-7890' },
  { code: '+60',  name: 'Malaisie',           abbr: 'MY', placeholder: '012-345 6789' },
  { code: '+65',  name: 'Singapour',          abbr: 'SG', placeholder: '8123 4567' },
  { code: '+66',  name: 'Thaïlande',          abbr: 'TH', placeholder: '081 234 5678' },
  { code: '+63',  name: 'Philippines',        abbr: 'PH', placeholder: '0917 123 4567' },
  { code: '+84',  name: 'Vietnam',            abbr: 'VN', placeholder: '091 234 56 78' },
  { code: '+855', name: 'Cambodge',           abbr: 'KH', placeholder: '091 234 567' },
  { code: '+856', name: 'Laos',               abbr: 'LA', placeholder: '020 23 123 456' },
  { code: '+95',  name: 'Myanmar',            abbr: 'MM', placeholder: '09 212 3456' },
  { code: '+670', name: 'Timor-Leste',        abbr: 'TL', placeholder: '7721 2345' },
  { code: '+673', name: 'Brunéi',             abbr: 'BN', placeholder: '712 3456' },
  // Moyen-Orient
  { code: '+966', name: 'Arabie Saoudite',    abbr: 'SA', placeholder: '051 234 5678' },
  { code: '+971', name: 'Émirats Arabes',     abbr: 'AE', placeholder: '050 123 4567' },
  { code: '+974', name: 'Qatar',              abbr: 'QA', placeholder: '5012 3456' },
  { code: '+965', name: 'Koweït',             abbr: 'KW', placeholder: '500 12345' },
  { code: '+973', name: 'Bahreïn',            abbr: 'BH', placeholder: '3600 1234' },
  { code: '+968', name: 'Oman',               abbr: 'OM', placeholder: '9212 3456' },
  { code: '+967', name: 'Yémen',              abbr: 'YE', placeholder: '712 345 678' },
  { code: '+962', name: 'Jordanie',           abbr: 'JO', placeholder: '07 9012 3456' },
  { code: '+961', name: 'Liban',              abbr: 'LB', placeholder: '71 123 456' },
  { code: '+963', name: 'Syrie',              abbr: 'SY', placeholder: '944 567 890' },
  { code: '+964', name: 'Irak',               abbr: 'IQ', placeholder: '0791 234 5678' },
  { code: '+98',  name: 'Iran',               abbr: 'IR', placeholder: '0912 345 6789' },
  { code: '+972', name: 'Israël',             abbr: 'IL', placeholder: '050-234-5678' },
  { code: '+90',  name: 'Turquie',            abbr: 'TR', placeholder: '0501 234 56 78' },
  // Océanie
  { code: '+61',  name: 'Australie',          abbr: 'AU', placeholder: '0412 345 678' },
  { code: '+64',  name: 'Nouvelle-Zélande',   abbr: 'NZ', placeholder: '021 123 4567' },
  { code: '+679', name: 'Fidji',              abbr: 'FJ', placeholder: '701 2345' },
  { code: '+675', name: 'Papouasie',          abbr: 'PG', placeholder: '7012 3456' },
];

/* ── Flag SVG component helper ──────────────────────────── */
function FlagIcon({ abbr, className }: { abbr: string; className?: string }) {
  const Flag = (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[abbr];
  if (!Flag) return <span className={`inline-block bg-gray-300 dark:bg-gray-600 rounded-sm ${className}`} />;
  return <Flag className={className} title={abbr} />;
}

/* ── Static data ─────────────────────────────────────────── */
const statusSteps = [
  { label: 'Soumis',    value: 'submitted',  desc: 'Nous accusons réception de votre dossier',    icon: Send },
  { label: 'En étude', value: 'in_review',   desc: 'Votre demande est analysée par notre équipe', icon: Sparkles },
  { label: 'Devis',    value: 'quote_ready', desc: 'Un devis personnalisé vous est préparé',      icon: FileText },
  { label: 'Confirmé', value: 'confirmed',   desc: 'Dossier validé, on démarre !',               icon: CheckCircle2 },
];

const focusOptions: { value: string; label: string; icon: React.ElementType }[] = [
  { value: 'branding',   label: 'Identité & branding',       icon: Palette },
  { value: 'presence',   label: 'Présence digitale',          icon: Globe },
  { value: 'product',    label: 'Produit / application',      icon: Smartphone },
  { value: 'content',    label: 'Contenus & communication',   icon: PenLine },
  { value: 'strategy',   label: 'Stratégie & croissance',     icon: BarChart3 },
  { value: 'ecommerce',  label: 'E-commerce / vente en ligne',icon: ShoppingCart },
];

const budgetOptions = [
  { value: '< 500 000 FCFA',            label: 'Moins de 500K FCFA',     sub: 'Projets d\'entrée' },
  { value: '500 000 - 1 000 000 FCFA',  label: '500K – 1M FCFA',         sub: 'Présence solide' },
  { value: '1 000 000 - 3 000 000 FCFA',label: '1M – 3M FCFA',           sub: 'Ambition régionale' },
  { value: '3 000 000 - 7 000 000 FCFA',label: '3M – 7M FCFA',           sub: 'Déploiement avancé' },
  { value: '> 7 000 000 FCFA',          label: 'Plus de 7M FCFA',         sub: 'Projets d\'envergure' },
];

const timelineOptions: { value: string; label: string; icon: React.ElementType; sub: string }[] = [
  { value: 'Cette semaine', label: 'Cette semaine', icon: Zap,      sub: 'Urgence maximale' },
  { value: 'Ce mois-ci',    label: 'Ce mois-ci',    icon: Timer,    sub: 'Dans 30 jours' },
  { value: '2 à 3 mois',    label: '2 à 3 mois',   icon: Calendar, sub: 'Planification sereine' },
  { value: 'À définir',     label: 'Pas encore défini', icon: Clock3, sub: 'On en discutera' },
];
const companySizeOptions: { value: string; label: string; icon: React.ElementType; sub: string }[] = [
  { value: 'solo',    label: 'Indépendant', icon: Laptop2, sub: '1 personne' },
  { value: 'small',   label: 'Petite',      icon: Users,   sub: '2–10 pers.' },
  { value: 'medium',  label: 'Moyenne',     icon: Building2, sub: '11–50 pers.' },
  { value: 'large',   label: 'Grande',      icon: BadgeCheck, sub: '50+ pers.' },
];
const FORM_STEPS = [
  { id: 'identity', label: 'Identité',  icon: User },
  { id: 'project',  label: 'Projet',    icon: Target },
  { id: 'details',  label: 'Détails',   icon: Layers },
  { id: 'send',     label: 'Envoi',     icon: Send },
];


/* ── Phone Selector Component ─────────────────────────── */

/** Get a real example number formatted for a given ISO-2 country code */
function getPhonePlaceholder(abbr: string): string {
  try {
    const example = getExampleNumber(abbr as CountryCode, {});
    return example ? example.formatNational() : '';
  } catch {
    return '';
  }
}

function PhoneInput({
  value, selectedAbbr, onChange, onCountrySelect
}: {
  value: string;
  selectedAbbr: string;
  onChange: (v: string) => void;
  onCountrySelect: (code: string, abbr: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find(c => c.abbr === selectedAbbr) || COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.includes(query) ||
    c.abbr.toLowerCase().includes(query.toLowerCase())
  );

  // Real example placeholder from libphonenumber-js
  const placeholder = useMemo(() => getPhonePlaceholder(selected.abbr), [selected.abbr]);

  // Live formatting as-you-type
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
      className="relative flex rounded-xl overflow-visible border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm focus-within:border-yellow-400/60 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,0.12)] transition-all duration-200"
      ref={ref}
    >
      {/* Country dropdown trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 border-r border-gray-200 dark:border-white/10 bg-transparent hover:bg-yellow-400/5 transition-colors rounded-l-xl text-sm font-bold text-gray-700 dark:text-gray-200 flex-shrink-0 min-w-[96px]"
      >
        <FlagIcon abbr={selected.abbr} className="w-5 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
        <span className="text-xs font-bold">{selected.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Phone number input with real live formatting */}
      <input
        type="tel"
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none rounded-r-xl"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un pays ou indicatif…"
                className="flex-1 bg-transparent text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>
          {/* Country list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map((c, idx) => (
              <button
                key={`${c.abbr}-${idx}`}
                type="button"
                onClick={() => { onCountrySelect(c.code, c.abbr); setOpen(false); setQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-400/10 dark:hover:bg-yellow-400/10 text-left transition-colors ${
                  c.abbr === selected.abbr ? 'bg-yellow-400/10' : ''
                }`}
              >
                <FlagIcon abbr={c.abbr} className="w-6 h-auto rounded-[2px] shadow-sm flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 flex-1 truncate">{c.name}</span>
                <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-gray-400">Aucun résultat pour « {query} »</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
const SubmitDossier: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params      = new URLSearchParams(location.search);
  const initialSlug = params.get('offerSlug') || '';
  const initialName = params.get('offerName') || '';
  const initialType = (params.get('offerType') as 'presence' | 'tech') || 'presence';

  /* ── Form state (localStorage persisted) ── */
  const [currentStep,     setCurrentStep]     = useState(() => Number(localStorage.getItem('mideessi_brief_step') || '0'));
  const [email,           setEmail]           = useState(() => localStorage.getItem('mideessi_brief_email') || '');
  const [nom,             setNom]             = useState(() => localStorage.getItem('mideessi_brief_nom') || '');
  const [entreprise,      setEntreprise]      = useState(() => localStorage.getItem('mideessi_brief_entreprise') || '');
  const [telephone,       setTelephone]       = useState(() => localStorage.getItem('mideessi_brief_telephone') || '');
  const [countryCode,     setCountryCode]     = useState(() => localStorage.getItem('mideessi_brief_countryCode') || '+229');
  const [countryAbbr,     setCountryAbbr]     = useState(() => localStorage.getItem('mideessi_brief_countryAbbr') || 'BJ');
  const [companySize,     setCompanySize]     = useState(() => localStorage.getItem('mideessi_brief_companySize') || '');
  const [competitors,     setCompetitors]     = useState(() => localStorage.getItem('mideessi_brief_competitors') || '');
  const [inspirationUrls, setInspirationUrls] = useState(() => localStorage.getItem('mideessi_brief_inspirationUrls') || '');
  const [message,         setMessage]         = useState(() => localStorage.getItem('mideessi_brief_message') || '');
  const [projectGoal,     setProjectGoal]     = useState(() => localStorage.getItem('mideessi_brief_projectGoal') || '');
  const [budget,          setBudget]          = useState(() => localStorage.getItem('mideessi_brief_budget') || '');
  const [timeline,        setTimeline]        = useState(() => localStorage.getItem('mideessi_brief_timeline') || '');
  const [focusAreas,      setFocusAreas]      = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('mideessi_brief_focusAreas') || '[]'); }
    catch { return []; }
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [dragOver,   setDragOver]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);

  /* ── Persist to localStorage ── */
  useEffect(() => {
    localStorage.setItem('mideessi_brief_step', String(currentStep));
    localStorage.setItem('mideessi_brief_email', email);
    localStorage.setItem('mideessi_brief_nom', nom);
    localStorage.setItem('mideessi_brief_entreprise', entreprise);
    localStorage.setItem('mideessi_brief_telephone', telephone);
    localStorage.setItem('mideessi_brief_countryCode', countryCode);
    localStorage.setItem('mideessi_brief_countryAbbr', countryAbbr);
    localStorage.setItem('mideessi_brief_companySize', companySize);
    localStorage.setItem('mideessi_brief_competitors', competitors);
    localStorage.setItem('mideessi_brief_inspirationUrls', inspirationUrls);
    localStorage.setItem('mideessi_brief_message', message);
    localStorage.setItem('mideessi_brief_projectGoal', projectGoal);
    localStorage.setItem('mideessi_brief_budget', budget);
    localStorage.setItem('mideessi_brief_timeline', timeline);
    localStorage.setItem('mideessi_brief_focusAreas', JSON.stringify(focusAreas));
  }, [currentStep, email, nom, entreprise, telephone, countryCode, countryAbbr, companySize, competitors, inspirationUrls, message, projectGoal, budget, timeline, focusAreas]);

  /* ── Pre-fill from auth ── */
  useEffect(() => {
    if (user && !email) setEmail(user.email || '');
  }, [user]);

  /* ── Helpers ── */
  const toggleFocusArea = (v: string) =>
    setFocusAreas(c => c.includes(v) ? c.filter(i => i !== v) : [...c, v]);

  const buildCompleteMessage = () => {
    const parts = [message.trim()];
    if (projectGoal)          parts.push(`Besoin principal : ${projectGoal}`);
    if (companySize)          parts.push(`Taille entreprise : ${companySizeOptions.find(o => o.value === companySize)?.label || companySize}`);
    if (focusAreas.length)    parts.push(`Axes prioritaires : ${focusAreas.map(v => focusOptions.find(o => o.value === v)?.label || v).join(', ')}`);
    if (competitors.trim())   parts.push(`Concurrents : ${competitors.trim()}`);
    if (inspirationUrls.trim()) parts.push(`Références design : ${inspirationUrls.trim()}`);
    if (budget)               parts.push(`Budget : ${budget}`);
    if (timeline)             parts.push(`Échéancier : ${timeline}`);
    return parts.filter(Boolean).join('\n\n');
  };

  const progress = useMemo(() => {
    const fields = [nom, email, message, budget, timeline, projectGoal];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [nom, email, message, budget, timeline, projectGoal]);

  const isStepValid = useMemo(() => {
    if (currentStep === 0) return nom.trim() !== '' && email.trim() !== '';
    if (currentStep === 1) return message.trim() !== '';
    return true;
  }, [currentStep, nom, email, message]);

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    setError('');

    if (!user) {
      setError('Veuillez vous connecter pour soumettre votre dossier.');
      setTimeout(() => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }, 1500);
      return;
    }

    if (!email.trim() || !nom.trim() || !message.trim()) {
      setError('Veuillez compléter les champs obligatoires.');
      return;
    }
    if (attachment && attachment.size > 20 * 1024 * 1024) {
      setError('Le fichier dépasse 20 Mo.');
      return;
    }

    setLoading(true);
    try {
      let attachmentUrl: string | null = null;
      if (attachment) {
        const { uploadFileToCloudinary } = await import('../lib/cloudinary');
        const isMedia = attachment.type.startsWith('image/') || attachment.type.startsWith('video/');
        attachmentUrl = await uploadFileToCloudinary(attachment, 'mideessi/briefs', isMedia ? 'auto' : 'raw');
      }

      const fullPhone = telephone.trim() ? `${countryCode} ${telephone.trim()}` : null;

      const { error: insertError, status: respStatus } = await supabase.from('quote_requests').insert([{
        client_id:      user?.client_id || null,
        email:          email.trim(),
        nom:            nom.trim(),
        entreprise:     entreprise.trim() || null,
        telephone:      fullPhone,
        offre_type:     initialType,
        offre_slug:     initialSlug,
        offre_nom:      initialName,
        message:        buildCompleteMessage(),
        attachment_url: attachmentUrl,
        status:         'submitted',
        progress:       10,
      }]);

      const clearCache = () => [
        'mideessi_brief_step','mideessi_brief_email','mideessi_brief_nom',
        'mideessi_brief_entreprise','mideessi_brief_telephone','mideessi_brief_countryCode',
        'mideessi_brief_companySize','mideessi_brief_competitors','mideessi_brief_inspirationUrls',
        'mideessi_brief_message','mideessi_brief_projectGoal','mideessi_brief_budget',
        'mideessi_brief_timeline','mideessi_brief_focusAreas',
      ].forEach(k => localStorage.removeItem(k));

      if (insertError) {
        const isBlock = respStatus === 404 ||
          ['row-level security','policy','relation','not found'].some(s => insertError.message?.toLowerCase().includes(s));
        if (isBlock) {
          const wa = `*NOUVEAU BRIEF CLIENT*\n\n• *Nom* : ${nom.trim()}\n• *Email* : ${email.trim()}\n• *Entreprise* : ${entreprise || 'Non spécifiée'}\n• *Téléphone* : ${fullPhone || 'Non spécifié'}\n• *Offre* : ${initialName || 'Non spécifiée'}\n• *Budget* : ${budget || 'À définir'}\n• *Délai* : ${timeline || 'À définir'}\n\n*Description* :\n${message.trim()}`;
          window.open(`https://wa.me/2290164409691?text=${encodeURIComponent(wa)}`, '_blank');
          clearCache();
          setSuccess(true);
          setTimeout(() => navigate(user ? '/clients/dossiers' : '/offres'), 4000);
        } else {
          setError(`Impossible d'envoyer le dossier : ${insertError.message}`);
        }
      } else {
        clearCache();
        setSuccess(true);
        setTimeout(() => navigate(user ? '/clients/dossiers' : '/offres'), 3000);
      }
    } catch {
      setError("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setAttachment(file);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Dossier transmis ! 🎉</h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Votre brief a bien été reçu. Notre équipe vous recontacte sous <strong className="text-yellow-400">24h à 48h</strong>.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left space-y-3">
            {statusSteps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/10 text-gray-500'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${i === 0 ? 'text-emerald-400' : 'text-gray-500'}`}>{step.label}</p>
                  <p className="text-[10px] text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            Redirection en cours…
          </div>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080d1c] text-gray-900 dark:text-gray-100 pb-24 transition-colors duration-300">
      <SEO title="Soumettre un dossier | MIDEESSI" description="Soumettez votre dossier et obtenez une étude gratuite et un devis personnalisé sous 48h." />

      {/* ── Hero Header ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] pt-28 pb-16 px-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-[0.03]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-400 transition-colors mb-8 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Retour aux offres
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Brief interactif
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                Soumettez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">dossier</span>
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                Décrivez votre projet en 4 étapes simples. Notre équipe analyse votre demande et vous revient avec une étude gratuite et un devis sur-mesure sous 48h.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap lg:flex-nowrap">
              {[
                { icon: ShieldCheck, label: 'Données sécurisées', color: 'text-emerald-400' },
                { icon: Clock3,      label: 'Réponse < 48h',      color: 'text-blue-400' },
                { icon: BadgeCheck,  label: 'Étude gratuite',     color: 'text-yellow-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs font-bold text-gray-300 whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-10">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1.5 font-semibold">Complétion du brief</span>
              <span className="font-black text-yellow-400 text-sm">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f97316)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 mb-8 relative z-10">
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-2 flex gap-1">
          {FORM_STEPS.map((step, i) => {
            const done   = i < currentStep;
            const active = i === currentStep;
            const Icon   = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => i < currentStep && setCurrentStep(i)}
                disabled={i > currentStep}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all duration-200 text-xs font-bold ${
                  active
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                    : done
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer'
                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-gray-900/20' : done ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {done ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Icon className="w-3 h-3" />}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden text-[10px]">{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Form panel ── */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">

              {/* Panel header */}
              <div className="relative bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-white/5 dark:to-white/[0.02] border-b border-gray-200 dark:border-white/10 px-6 py-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-l-full" />
                <div className="ml-3">
                  <p className="text-[10px] uppercase tracking-widest text-yellow-500 dark:text-yellow-400 font-bold mb-0.5">Étape {currentStep + 1} / {FORM_STEPS.length}</p>
                  <h2 className="text-base font-black text-gray-900 dark:text-white">
                    {currentStep === 0 && 'Vos coordonnées de contact'}
                    {currentStep === 1 && 'Décrivez votre projet'}
                    {currentStep === 2 && 'Budget & détails complémentaires'}
                    {currentStep === 3 && 'Récapitulatif & validation'}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl text-sm text-red-600 dark:text-red-400 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* ── STEP 0: Identity ── */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Nom complet *" hint="Votre prénom et nom">
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            placeholder="Jean Dupont"
                            className={INPUT_CLS + ' pl-10'}
                            required
                          />
                        </div>
                      </FormField>
                      <FormField label="Adresse e-mail *" hint="Pour recevoir votre devis">
                        <div className="relative">
                          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="vous@entreprise.com"
                            className={INPUT_CLS + ' pl-10'}
                            required
                          />
                        </div>
                      </FormField>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Entreprise / Marque" hint="Raison sociale ou nom de marque">
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            value={entreprise}
                            onChange={e => setEntreprise(e.target.value)}
                            placeholder="Ex. MIDEESSI Group"
                            className={INPUT_CLS + ' pl-10'}
                          />
                        </div>
                      </FormField>
                      <FormField label="Téléphone" hint="Avec indicatif pays">
                        <div className="relative">
                          <PhoneInput
                            value={telephone}
                            selectedAbbr={countryAbbr}
                            onChange={setTelephone}
                            onCountrySelect={(code, abbr) => {
                              setCountryCode(code);
                              setCountryAbbr(abbr);
                              setTelephone(''); // reset number when country changes
                            }}
                          />
                        </div>
                      </FormField>
                    </div>

                    {/* Company size */}
                    <FormField label="Taille de votre structure" hint="Combien de personnes compose votre équipe ?">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {companySizeOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setCompanySize(opt.value)}
                            className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 text-center transition-all duration-200 ${
                              companySize === opt.value
                                ? 'border-yellow-400 bg-yellow-400/10 shadow-md shadow-yellow-400/10'
                                : 'border-gray-200 dark:border-white/10 bg-transparent hover:border-yellow-400/40 hover:bg-yellow-400/5'
                            }`}
                          >
                            <opt.icon className={`w-6 h-6 ${companySize === opt.value ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <span className={`text-xs font-black ${companySize === opt.value ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</span>
                            <span className="text-[10px] text-gray-400">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                    </FormField>

                    <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Vos données sont 100 % confidentielles et protégées. Elles ne seront jamais partagées avec des tiers.</p>
                    </div>
                  </div>
                )}

                {/* ── STEP 1: Project ── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField label="Votre objectif principal" hint="En une phrase, quel est votre besoin clé ?">
                      <div className="relative">
                        <Target className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          value={projectGoal}
                          onChange={e => setProjectGoal(e.target.value)}
                          placeholder="Ex. Créer un site e-commerce pour mes produits artisanaux"
                          className={INPUT_CLS + ' pl-10'}
                        />
                      </div>
                    </FormField>

                    <FormField label="Axes d'étude prioritaires" hint="Sélectionnez tout ce qui concerne votre projet">
                      <div className="grid grid-cols-2 gap-2.5">
                        {focusOptions.map(o => {
                          const active = focusAreas.includes(o.value);
                          return (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => toggleFocusArea(o.value)}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                active
                                  ? 'border-yellow-400 bg-yellow-400/10 shadow-md'
                                  : 'border-gray-200 dark:border-white/10 hover:border-yellow-400/40 hover:bg-yellow-400/5'
                              }`}
                            >
                              <o.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-400'}`} />
                              <span className={`text-xs font-bold ${active ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'}`}>{o.label}</span>
                              {active && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 ml-auto flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </FormField>

                    <FormField label="Description complète de votre besoin *" hint="Contexte, objectifs, cibles, contraintes, vision...">
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Décrivez votre projet en détail : qui est votre cible, qu'est-ce qui vous distingue, quels résultats attendez-vous..."
                        className={`${INPUT_CLS} resize-none`}
                        required
                      />
                      <p className="text-[10px] text-gray-400 text-right mt-1">{message.length} car.</p>
                    </FormField>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Vos concurrents directs" hint="Qui visez-vous à surpasser ?">
                        <div className="relative">
                          <TrendingUp className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                          <textarea
                            value={competitors}
                            onChange={e => setCompetitors(e.target.value)}
                            rows={2}
                            placeholder="Ex. Coca-Cola, Pepsi, Bel Afrik…"
                            className={`${INPUT_CLS} resize-none pl-10`}
                          />
                        </div>
                      </FormField>
                      <FormField label="Références & inspirations" hint="Sites, comptes ou marques qui vous inspirent">
                        <div className="relative">
                          <Lightbulb className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                          <textarea
                            value={inspirationUrls}
                            onChange={e => setInspirationUrls(e.target.value)}
                            rows={2}
                            placeholder="Ex. apple.com, notion.so, @mideessi…"
                            className={`${INPUT_CLS} resize-none pl-10`}
                          />
                        </div>
                      </FormField>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Details ── */}
                {currentStep === 2 && (
                  <div className="space-y-7">
                    <FormField label="Budget estimé" hint="Votre enveloppe approximative pour ce projet">
                      <div className="space-y-2">
                        {budgetOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setBudget(opt.value)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                              budget === opt.value
                                ? 'border-yellow-400 bg-yellow-400/10 shadow-md'
                                : 'border-gray-200 dark:border-white/10 hover:border-yellow-400/40 hover:bg-yellow-400/5'
                            }`}
                          >
                            <div>
                              <p className={`text-sm font-bold ${budget === opt.value ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}>{opt.label}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{opt.sub}</p>
                            </div>
                            {budget === opt.value && <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </FormField>

                    <FormField label="Échéance souhaitée" hint="Dans quel délai souhaitez-vous démarrer ?">
                      <div className="grid grid-cols-2 gap-3">
                        {timelineOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setTimeline(opt.value)}
                            className={`flex flex-col gap-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              timeline === opt.value
                                ? 'border-yellow-400 bg-yellow-400/10 shadow-md'
                                : 'border-gray-200 dark:border-white/10 hover:border-yellow-400/40 hover:bg-yellow-400/5'
                            }`}
                          >
                            <opt.icon className={`w-5 h-5 ${timeline === opt.value ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-400'}`} />
                            <span className={`text-xs font-bold ${timeline === opt.value ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}>{opt.label}</span>
                            <span className="text-[10px] text-gray-400">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                    </FormField>

                    {/* File upload */}
                    <FormField label="Document annexe" hint="Cahier des charges, logos, mockups, charte graphique (max 20 Mo)">
                      <label
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                          dragOver
                            ? 'border-yellow-400 bg-yellow-400/5 scale-[1.01]'
                            : attachment
                            ? 'border-emerald-400 bg-emerald-500/5'
                            : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] hover:border-yellow-400/50 hover:bg-yellow-400/[0.02]'
                        }`}
                      >
                        <input type="file" className="hidden" onChange={e => setAttachment(e.target.files?.[0] || null)} />
                        {attachment ? (
                          <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                              <FileText className="w-6 h-6 text-emerald-500" />
                            </div>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{attachment.name}</p>
                            <p className="text-[10px] text-gray-400">{(attachment.size / 1024 / 1024).toFixed(2)} Mo</p>
                            <button
                              type="button"
                              onClick={e => { e.preventDefault(); setAttachment(null); }}
                              className="text-xs text-red-500 hover:underline font-semibold"
                            >
                              Retirer le fichier
                            </button>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                              <Upload className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Glissez-déposez un fichier</p>
                              <p className="text-xs text-gray-400 mt-1">ou cliquez pour parcourir</p>
                              <p className="text-[10px] text-gray-400 mt-1">PDF, ZIP, Images, Vidéos — Max 20 Mo</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </FormField>
                  </div>
                )}

                {/* ── STEP 3: Summary ── */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    {!user && (
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-700/50 rounded-2xl">
                        <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300">Connexion requise pour soumettre</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">Votre progression est sauvegardée. Connectez-vous pour finaliser l'envoi.</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
                        {[
                          { label: 'Nom complet', value: nom },
                          { label: 'E-mail', value: email },
                          { label: 'Entreprise', value: entreprise || '—' },
                          { label: 'Téléphone', value: telephone ? `${countryCode} ${telephone}` : '—' },
                          { label: 'Taille structure', value: companySizeOptions.find(o => o.value === companySize)?.label || '—' },
                          { label: 'Budget estimé', value: budget || 'Non défini' },
                          { label: 'Délai souhaité', value: timeline || 'Non défini' },
                          { label: 'Offre choisie', value: initialName || 'Non précisée' },
                        ].map(item => (
                          <div key={item.label}>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{item.label}</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {focusAreas.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Axes prioritaires</p>
                          <div className="flex flex-wrap gap-1.5">
                            {focusAreas.map(v => {
                              const opt = focusOptions.find(o => o.value === v);
                              return (
                                <span key={v} className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/25 px-2 py-0.5 rounded-lg">
                                  {opt && <opt.icon className="w-3 h-3" />} {opt?.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {message && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Description du besoin</p>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs line-clamp-4">{message}</p>
                        </div>
                      )}

                      {competitors && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Concurrents</p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs">{competitors}</p>
                        </div>
                      )}

                      {inspirationUrls && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Références / inspirations</p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs">{inspirationUrls}</p>
                        </div>
                      )}

                      {attachment && (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          <FileText className="w-4 h-4" />
                          <span>Fichier joint : {attachment.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-2xl">
                      <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">En soumettant ce formulaire, vous acceptez d'être recontacté par l'équipe MIDEESSI pour la suite du traitement de votre dossier.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Navigation buttons ── */}
              <div className="px-6 sm:px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>

                {currentStep < FORM_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => isStepValid && setCurrentStep(currentStep + 1)}
                    disabled={!isStepValid}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl text-sm font-black hover:shadow-lg hover:shadow-yellow-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl text-sm font-black hover:shadow-xl hover:shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <><SpinnerIcon className="w-4 h-4" /> Envoi en cours…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Envoyer mon dossier</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            {/* Tips card */}
            <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                </span>
                Conseils de brief
              </h3>
              <div className="space-y-4 text-xs text-gray-600 dark:text-gray-400">
                {([
                  { Icon: Target,     title: 'Soyez précis',         desc: 'Plus votre description est détaillée, plus notre proposition sera pertinente et chiffrée.' },
                  { Icon: Upload,     title: 'Partagez vos assets',  desc: 'Logos, maquettes ou exemples visuels accélèrent énormément l\'analyse.' },
                  { Icon: TrendingUp, title: 'Définissez votre budget', desc: 'Un budget réaliste nous aide à concevoir une solution technique adaptée.' },
                  { Icon: BarChart3,  title: 'Citez vos concurrents', desc: 'Connaître votre marché nous aide à vous positionner différemment.' },
                ] as { Icon: React.ElementType; title: string; desc: string }[]).map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center mt-0.5">
                      <tip.Icon className="w-3.5 h-3.5 text-yellow-500" />
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 mb-0.5">{tip.title}</p>
                      <p className="leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process card */}
            <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d1b3e] border border-white/10 rounded-3xl p-5 shadow-xl text-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-4">Notre processus</h3>
              <div className="space-y-3">
                {statusSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? 'bg-yellow-400 text-gray-900' : 'bg-white/10 text-gray-400'}`}>
                      <step.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${i === 0 ? 'text-yellow-400' : 'text-gray-300'}`}>{step.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact fallback */}
            <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-md text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Vous préférez discuter directement ?</p>
              <a
                href="https://wa.me/2290164409691"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Discuter sur WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* ── Utility styles & sub-components ── */
const INPUT_CLS = [
  "w-full px-4 py-3",
  "bg-white/60 dark:bg-white/5 backdrop-blur-sm",
  "border border-gray-200 dark:border-white/10",
  "rounded-xl",
  "text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400",
  "focus:outline-none focus:border-yellow-400/60 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.12)]",
  "transition-all duration-200",
].join(' ');

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" className={`animate-spin ${props.className}`}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default SubmitDossier;
