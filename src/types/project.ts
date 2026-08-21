export type ProjectStatus =
  | 'projet_recu'
  | 'brief'
  | 'contenu'
  | 'design'
  | 'developpement'
  | 'revision'
  | 'mise_en_ligne';

export type FulfillmentMode = 'rdv' | 'distance';

export type ActivityType =
  | 'Restaurant'
  | 'Commerce'
  | 'Association'
  | 'Cabinet'
  | 'Profession libérale'
  | 'Autre';

export type ProjectGoal =
  | 'Présenter mon activité'
  | 'Obtenir des contacts'
  | 'Présenter mes services'
  | 'Prendre des rendez-vous'
  | 'Vendre mes produits en ligne'
  | 'Autre';

export interface ProjectFeatureOption {
  id: string;
  name: string;
  description: string;
  price: number; // En FCFA (0 si inclus)
  includedInOffer?: string[]; // Slugs d'offres où c'est inclus gratuitement
}

export interface ContentChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  status: 'recu' | 'manquant';
  fileUrl?: string;
  fileName?: string;
  updatedAt?: string;
}

export interface ProjectRevisionRequest {
  id: string;
  date: string;
  comment: string;
  status: 'en_attente' | 'prise_en_compte' | 'terminee';
}

export interface WebProject {
  id: string;
  user_id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;

  offer_slug: 'vitrine' | 'e-commerce' | 'application-web' | 'application-mobile' | 'sur-mesure';
  offer_name: string;

  fulfillment_mode: FulfillmentMode;
  meeting_date?: string;
  meeting_time?: string;

  activity: ActivityType;
  goal: ProjectGoal;
  brief_description: string;

  selected_features: string[]; // List of feature IDs
  price_total: number;
  payment_type: 'full' | 'installment';
  payment_schedule: {
    upfront: number;
    installment_amount: number;
    installments_count: number;
    paid_installments: number;
  };

  status: ProjectStatus;
  estimated_days: string;

  contents_checklist: ContentChecklistItem[];
  preview_url?: string;
  final_url?: string;

  revisions: ProjectRevisionRequest[];
  max_revisions: number;

  created_at: string;
  updated_at: string;
}

export const AVAILABLE_FEATURES: ProjectFeatureOption[] = [
  { id: 'presentation', name: 'Présentation de l\'entreprise', description: 'Page À propos, vision et équipe', price: 0, includedInOffer: ['vitrine', 'e-commerce', 'application-web'] },
  { id: 'services', name: 'Présentation des Services', description: 'Catalogue détaillé de vos offres', price: 0, includedInOffer: ['vitrine', 'e-commerce', 'application-web'] },
  { id: 'galerie', name: 'Galerie photos & réalisations', description: 'Grille d\'images HD dynamiques', price: 15000, includedInOffer: ['vitrine', 'e-commerce'] },
  { id: 'contact_form', name: 'Formulaire de contact sécurisé', description: 'Envoi direct des messages sur email', price: 0, includedInOffer: ['vitrine', 'e-commerce', 'application-web'] },
  { id: 'whatsapp_button', name: 'Bouton WhatsApp direct', description: 'Clic direct vers votre numéro WhatsApp', price: 0, includedInOffer: ['vitrine', 'e-commerce', 'application-web'] },
  { id: 'google_maps', name: 'Carte Google Maps interactive', description: 'Localisation exacte de votre établissement', price: 10000, includedInOffer: ['vitrine', 'e-commerce'] },
  { id: 'booking', name: 'Prise de rendez-vous / Réservation', description: 'Module de choix de dates et créneaux', price: 35000, includedInOffer: ['application-web'] },
  { id: 'blog', name: 'Blog / Actualités', description: 'Système d\'articles et publications régulières', price: 25000, includedInOffer: ['application-web'] },
  { id: 'mobile_money', name: 'Paiement Mobile Money (MTN, Moov, Wave)', description: 'Encaissement automatique instantané', price: 45000, includedInOffer: ['e-commerce', 'application-web'] },
];

export const INITIAL_CHECKLIST_TEMPLATE: ContentChecklistItem[] = [
  { id: 'logo', label: 'Logo de l\'entreprise', description: 'Format PNG ou vectoriel fond transparent', required: true, status: 'manquant' },
  { id: 'photos', label: 'Photos d\'illustration', description: '5 à 10 visuels de vos produits, plats ou locaux', required: true, status: 'manquant' },
  { id: 'texts', label: 'Textes de présentation', description: 'Description de vos services, histoires et valeurs', required: true, status: 'manquant' },
  { id: 'prices', label: 'Tarifs et catalogue', description: 'Liste des prix ou menu (si applicable)', required: false, status: 'manquant' },
  { id: 'contact', label: 'Coordonnées officielles', description: 'Téléphone, adresse physique, horaires d\'ouverture', required: true, status: 'manquant' },
];
